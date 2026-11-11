import { DatabaseService, SyncMutation } from './DatabaseService';
import {
  SupabaseService,
  RemoteUserProgressRecord,
  RemoteFSRSCardRecord,
} from './SupabaseService';
import { AuthService } from './AuthService';
import { UserProgress, FSRSCard, VocabularyItem } from '../types';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  cloudConfigured: boolean;
  lastSyncedAt: string | null;
  pendingChangesCount: number;
  lastError: string | null;
}

export interface SyncResult {
  success: boolean;
  pushedCount: number;
  pulledCount: number;
  conflictsResolved: number;
  message: string;
}

export class SyncEngine {
  private static instance: SyncEngine;
  private dbService: DatabaseService;
  private supabaseService: SupabaseService;
  private authService: AuthService;

  private status: Omit<SyncStatus, 'pendingChangesCount' | 'cloudConfigured'> = {
    isOnline: true,
    isSyncing: false,
    lastSyncedAt: new Date().toISOString(),
    lastError: null,
  };

  private constructor() {
    this.dbService = DatabaseService.getInstance();
    this.supabaseService = SupabaseService.getInstance();
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): SyncEngine {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine();
    }
    return SyncEngine.instance;
  }

  public getStatus(): SyncStatus {
    const mutations = this.dbService.getPendingMutations();
    return {
      ...this.status,
      cloudConfigured: this.supabaseService.isConfigured(),
      pendingChangesCount: mutations.length,
    };
  }

  public setOnlineStatus(isOnline: boolean): void {
    this.status.isOnline = isOnline;
  }

  /**
   * Monotonic Conflict Resolution for UserProgress (PRD §13):
   * Never silently overwrites newer progress or completed lessons.
   */
  public static resolveProgressConflict(
    local: UserProgress & { updatedAt?: string },
    remote: RemoteUserProgressRecord
  ): UserProgress & { updatedAt: string } {
    const localTime = local.updatedAt ? Date.parse(local.updatedAt) : 0;
    const remoteTime = Date.parse(remote.updated_at);
    const preferRemoteScalar = remoteTime > localTime;

    const mergedLessons = Array.from(
      new Set([...local.completedLessonIds, ...(remote.completed_lesson_ids || [])])
    );
    const mergedSavedWords = Array.from(
      new Set([...local.savedWordIds, ...(remote.saved_word_ids || [])])
    );

    return {
      ...local,
      cefrLevel: (preferRemoteScalar ? remote.cefr_level : local.cefrLevel) as UserProgress['cefrLevel'],
      dailyGoalMinutes: preferRemoteScalar ? remote.daily_goal_minutes : local.dailyGoalMinutes,
      currentStreak: Math.max(local.currentStreak, remote.current_streak),
      bestStreak: Math.max(local.bestStreak, remote.best_streak),
      totalLearningMinutes: Math.max(local.totalLearningMinutes, remote.total_learning_minutes),
      vocabularyCount: Math.max(local.vocabularyCount, remote.vocabulary_count),
      completedLessonIds: mergedLessons,
      savedWordIds: mergedSavedWords,
      skillProficiency: {
        reading: Math.max(local.skillProficiency.reading, remote.skill_proficiency?.reading || 0),
        listening: Math.max(local.skillProficiency.listening, remote.skill_proficiency?.listening || 0),
        writing: Math.max(local.skillProficiency.writing, remote.skill_proficiency?.writing || 0),
        speaking: Math.max(local.skillProficiency.speaking, remote.skill_proficiency?.speaking || 0),
      },
      updatedAt: new Date(Math.max(localTime, remoteTime, Date.now())).toISOString(),
    };
  }

  /**
   * Deterministic Conflict Resolution for FSRS Cards (PRD §13):
   * Latest review timestamp wins; ties resolve to higher repetition count.
   */
  public static resolveCardConflict(
    local: FSRSCard,
    remote: RemoteFSRSCardRecord
  ): FSRSCard {
    const localReviewTime = local.lastReview ? Date.parse(local.lastReview) : 0;
    const remoteReviewTime = remote.last_review ? Date.parse(remote.last_review) : Date.parse(remote.updated_at);

    if (remoteReviewTime > localReviewTime || (remoteReviewTime === localReviewTime && remote.reps > local.reps)) {
      return {
        cardId: remote.word_id,
        reps: remote.reps,
        lapses: remote.lapses,
        stability: remote.stability,
        difficulty: remote.difficulty,
        due: remote.due,
        lastReview: remote.last_review || remote.updated_at,
        state: remote.state,
      };
    }

    return local;
  }

  /**
   * Bidirectional synchronization between local SQLite outbox and Supabase PostgreSQL
   */
  public async synchronize(): Promise<SyncResult> {
    if (!this.status.isOnline) {
      return {
        success: false,
        pushedCount: 0,
        pulledCount: 0,
        conflictsResolved: 0,
        message: 'Dispositivo sin conexión a internet.',
      };
    }

    await this.dbService.initializeDatabase();
    const mutations = this.dbService.getPendingMutations();
    const isCloudConfigured = this.supabaseService.isConfigured();

    if (!isCloudConfigured) {
      // Offline-first local mode without remote .env credentials
      if (mutations.length === 0) {
        this.status.lastSyncedAt = new Date().toISOString();
        return {
          success: true,
          pushedCount: 0,
          pulledCount: 0,
          conflictsResolved: 0,
          message: 'Todos los datos locales están al día.',
        };
      }

      const processedIds = mutations.map(m => m.id);
      await this.dbService.clearMutations(processedIds);
      this.status.lastSyncedAt = new Date().toISOString();
      this.status.lastError = null;

      return {
        success: true,
        pushedCount: processedIds.length,
        pulledCount: 0,
        conflictsResolved: 0,
        message: `Guardados ${processedIds.length} cambios localmente (configura Supabase en .env para sincronización en la nube).`,
      };
    }

    // Remote Cloud Sync Path
    const user = this.authService.getCurrentUser();
    this.status.isSyncing = true;

    try {
      let conflictsResolved = 0;
      let pulledCount = 0;
      const processedIds: string[] = [];

      // Fetch remote snapshots once for conflict evaluation
      const remoteProgress = await this.supabaseService.fetchUserProgress(user.id);
      const remoteCards = await this.supabaseService.fetchUserCards(user.id);
      const remoteCardMap = new Map(remoteCards.map(c => [c.word_id, c]));

      // 1. Push Phase with Conflict Resolution
      for (const m of mutations) {
        if (m.table === 'user_progress') {
          const localProgress = JSON.parse(m.payload) as UserProgress & { updatedAt?: string };
          let finalProgress = localProgress;

          if (remoteProgress) {
            finalProgress = SyncEngine.resolveProgressConflict(localProgress, remoteProgress);
            conflictsResolved += 1;
            await this.dbService.saveUserProgress(finalProgress, finalProgress.updatedAt, false);
          }

          await this.supabaseService.upsertUserProgress({
            user_id: user.id,
            cefr_level: finalProgress.cefrLevel,
            daily_goal_minutes: finalProgress.dailyGoalMinutes,
            current_streak: finalProgress.currentStreak,
            best_streak: finalProgress.bestStreak,
            total_learning_minutes: finalProgress.totalLearningMinutes,
            vocabulary_count: finalProgress.vocabularyCount,
            completed_lesson_ids: finalProgress.completedLessonIds,
            saved_word_ids: finalProgress.savedWordIds,
            skill_proficiency: finalProgress.skillProficiency,
            updated_at: finalProgress.updatedAt || m.timestamp,
          });
          processedIds.push(m.id);
        } else if (m.table === 'fsrs_cards') {
          const localCard = JSON.parse(m.payload) as FSRSCard;
          const remoteMatch = remoteCardMap.get(localCard.cardId);
          let finalCard = localCard;

          if (remoteMatch) {
            finalCard = SyncEngine.resolveCardConflict(localCard, remoteMatch);
            conflictsResolved += 1;
            await this.dbService.saveFSRSCard(finalCard, false);
          }

          await this.supabaseService.upsertUserCard({
            user_id: user.id,
            word_id: finalCard.cardId,
            state: finalCard.state,
            reps: finalCard.reps,
            lapses: finalCard.lapses,
            stability: finalCard.stability,
            difficulty: finalCard.difficulty,
            due: finalCard.due,
            last_review: finalCard.lastReview || null,
            is_favorite: remoteMatch?.is_favorite ?? false,
            updated_at: finalCard.lastReview || m.timestamp,
          });
          processedIds.push(m.id);
        } else if (m.table === 'vocabulary') {
          const localVocab = JSON.parse(m.payload) as VocabularyItem;
          const remoteMatch = remoteCardMap.get(localVocab.id);

          await this.supabaseService.upsertUserCard({
            user_id: user.id,
            word_id: localVocab.id,
            word_payload: localVocab,
            state: localVocab.fsrsCard?.state || remoteMatch?.state || 'new',
            reps: localVocab.fsrsCard?.reps || remoteMatch?.reps || 0,
            lapses: localVocab.fsrsCard?.lapses || remoteMatch?.lapses || 0,
            stability: localVocab.fsrsCard?.stability || remoteMatch?.stability || 1.0,
            difficulty: localVocab.fsrsCard?.difficulty || remoteMatch?.difficulty || 5.0,
            due: localVocab.fsrsCard?.due || remoteMatch?.due || new Date().toISOString(),
            last_review: localVocab.fsrsCard?.lastReview || remoteMatch?.last_review || null,
            is_favorite: Boolean(localVocab.isFavorite),
            updated_at: m.timestamp,
          });
          processedIds.push(m.id);
        }
      }

      // 2. Pull Phase for remote records not touched locally
      if (remoteProgress && mutations.every(m => m.table !== 'user_progress')) {
        const localProgress = await this.dbService.getUserProgress();
        if (localProgress) {
          const merged = SyncEngine.resolveProgressConflict(localProgress, remoteProgress);
          await this.dbService.saveUserProgress(merged, merged.updatedAt, false);
          pulledCount += 1;
        }
      }

      for (const remoteCard of remoteCards) {
        const localCard = await this.dbService.getFSRSCard(remoteCard.word_id);
        if (!localCard) {
          await this.dbService.saveFSRSCard(
            {
              cardId: remoteCard.word_id,
              reps: remoteCard.reps,
              lapses: remoteCard.lapses,
              stability: remoteCard.stability,
              difficulty: remoteCard.difficulty,
              due: remoteCard.due,
              lastReview: remoteCard.last_review || undefined,
              state: remoteCard.state,
            },
            false
          );
          pulledCount += 1;
        }
      }

      await this.dbService.clearMutations(processedIds);
      this.status.lastSyncedAt = new Date().toISOString();
      this.status.lastError = null;
      this.status.isSyncing = false;

      return {
        success: true,
        pushedCount: processedIds.length,
        pulledCount,
        conflictsResolved,
        message: `Sincronizados ${processedIds.length} cambio(s) subidos y ${pulledCount} descargado(s) con Supabase.`,
      };
    } catch (err: any) {
      this.status.isSyncing = false;
      this.status.lastError = err.message;
      return {
        success: false,
        pushedCount: 0,
        pulledCount: 0,
        conflictsResolved: 0,
        message: `Error de sincronización: ${err.message}`,
      };
    }
  }
}
