import {
  UserProgress,
  VocabularyItem,
  BackupData,
  FSRSRating,
  CEFRLevel,
  WritingDraft,
} from '../types';
import { initialUserProgress } from '../data/userProgress';
import { initialVocabulary } from '../data/vocabulary';
import { FSRSEngine } from './FSRSEngine';
import { JSONSchemaValidator } from './JSONSchemaValidator';
import { ContentIngestionService, IngestionReport } from './ContentIngestionService';
import { DatabaseService } from './DatabaseService';
import { SupabaseService } from './SupabaseService';

export class LearningService {
  private static instance: LearningService;
  private dbService: DatabaseService;
  private isHydrated = false;

  private userProgress: UserProgress = { ...initialUserProgress };
  private vocabularyList: VocabularyItem[] = [...initialVocabulary];
  private writingDrafts: WritingDraft[] = [];
  private onboardingDone = false;

  private constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  public static getInstance(): LearningService {
    if (!LearningService.instance) {
      LearningService.instance = new LearningService();
    }
    return LearningService.instance;
  }

  /**
   * Initializes offline local persistence (SQLite / Web localStorage) and hydrates all saved user data
   */
  public async initialize(): Promise<void> {
    if (this.isHydrated) return;

    await this.dbService.initializeDatabase();
    await SupabaseService.getInstance().loadSavedConfiguration();

    const settings = await this.dbService.getAppSettings();
    this.onboardingDone = Boolean(settings.hasCompletedOnboarding);

    const savedProgress = await this.dbService.getUserProgress();
    if (savedProgress) {
      this.userProgress = { ...savedProgress };
    }

    const savedVocab = await this.dbService.getVocabulary();
    for (const item of savedVocab) {
      const idx = this.vocabularyList.findIndex(v => v.id === item.id);
      if (idx >= 0) {
        this.vocabularyList[idx] = item;
      } else {
        this.vocabularyList.unshift(item);
      }
    }

    const savedCards = await this.dbService.getAllFSRSCards();
    for (const card of savedCards) {
      const vocab = this.vocabularyList.find(v => v.id === card.cardId);
      if (vocab) {
        vocab.fsrsCard = card;
      }
    }

    this.writingDrafts = await this.dbService.getWritingDrafts();
    this.userProgress.vocabularyCount = this.vocabularyList.length;
    this.isHydrated = true;
  }

  public hasCompletedOnboarding(): boolean {
    return this.onboardingDone;
  }

  public async completeOnboarding(prefs: {
    name?: string;
    cefrLevel: CEFRLevel;
    dailyGoalMinutes: number;
  }): Promise<void> {
    if (prefs.name?.trim()) {
      this.userProgress.name = prefs.name.trim();
    }
    this.userProgress.cefrLevel = prefs.cefrLevel;
    this.userProgress.dailyGoalMinutes = prefs.dailyGoalMinutes;
    this.onboardingDone = true;

    const currentSettings = await this.dbService.getAppSettings();
    await this.dbService.saveAppSettings({
      ...currentSettings,
      hasCompletedOnboarding: true,
    });
    await this.dbService.saveUserProgress(this.userProgress);
  }

  public async updateProfilePreferences(prefs: {
    name?: string;
    cefrLevel?: CEFRLevel;
    dailyGoalMinutes?: number;
  }): Promise<void> {
    if (prefs.name !== undefined && prefs.name.trim()) {
      this.userProgress.name = prefs.name.trim();
    }
    if (prefs.cefrLevel !== undefined) {
      this.userProgress.cefrLevel = prefs.cefrLevel;
    }
    if (prefs.dailyGoalMinutes !== undefined) {
      this.userProgress.dailyGoalMinutes = prefs.dailyGoalMinutes;
    }
    await this.dbService.saveUserProgress(this.userProgress);
  }

  public getWritingDrafts(): WritingDraft[] {
    return [...this.writingDrafts];
  }

  public async saveWritingDraft(draft: Omit<WritingDraft, 'updatedAt'>): Promise<WritingDraft> {
    const completeDraft: WritingDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    const idx = this.writingDrafts.findIndex(d => d.id === completeDraft.id);
    if (idx >= 0) {
      this.writingDrafts[idx] = completeDraft;
    } else {
      this.writingDrafts.unshift(completeDraft);
    }
    await this.dbService.saveWritingDraft(completeDraft);
    return completeDraft;
  }

  public async deleteWritingDraft(draftId: string): Promise<void> {
    this.writingDrafts = this.writingDrafts.filter(d => d.id !== draftId);
    await this.dbService.deleteWritingDraft(draftId);
  }

  public getProgress(): UserProgress {
    return { ...this.userProgress };
  }

  public getVocabulary(): VocabularyItem[] {
    return [...this.vocabularyList];
  }

  /**
   * Computes real FSRS due forecast counts for today, tomorrow, and next 7 days
   */
  public getReviewForecast(now: Date = new Date()): { dueToday: number; dueTomorrow: number; dueThisWeek: number } {
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const endOfTomorrow = new Date(endOfToday.getTime() + 24 * 60 * 60 * 1000);
    const endOfWeek = new Date(endOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

    let dueToday = 0;
    let dueTomorrow = 0;
    let dueThisWeek = 0;

    for (const item of this.vocabularyList) {
      if (!item.fsrsCard) {
        // New unreviewed cards are ready to study today
        dueToday += 1;
        dueThisWeek += 1;
        continue;
      }

      const dueTime = new Date(item.fsrsCard.due).getTime();
      if (dueTime <= endOfToday.getTime()) {
        dueToday += 1;
        dueThisWeek += 1;
      } else if (dueTime <= endOfTomorrow.getTime()) {
        dueTomorrow += 1;
        dueThisWeek += 1;
      } else if (dueTime <= endOfWeek.getTime()) {
        dueThisWeek += 1;
      }
    }

    return { dueToday, dueTomorrow, dueThisWeek };
  }

  public toggleFavoriteWord(id: string): boolean {
    const word = this.vocabularyList.find(w => w.id === id);
    if (!word) return false;
    word.isFavorite = !word.isFavorite;

    if (word.isFavorite) {
      if (!this.userProgress.savedWordIds.includes(id)) {
        this.userProgress.savedWordIds.push(id);
      }
    } else {
      this.userProgress.savedWordIds = this.userProgress.savedWordIds.filter(wId => wId !== id);
    }

    void this.dbService.saveVocabularyItem(word);
    void this.dbService.saveUserProgress(this.userProgress);
    return word.isFavorite;
  }

  public rateVocabularyWord(id: string, rating: FSRSRating): void {
    const word = this.vocabularyList.find(w => w.id === id);
    if (!word) return;

    const currentCard = word.fsrsCard || FSRSEngine.createNewCard(id);
    const { updatedCard } = FSRSEngine.scheduleNextReview(currentCard, rating);
    word.fsrsCard = updatedCard;

    // Increment user learning minutes subtly (e.g. 1 min per review)
    this.userProgress.totalLearningMinutes += 1;

    void this.dbService.saveFSRSCard(updatedCard);
    void this.dbService.saveUserProgress(this.userProgress);
  }

  public completeLesson(lessonId: string): void {
    if (!this.userProgress.completedLessonIds.includes(lessonId)) {
      this.userProgress.completedLessonIds.push(lessonId);
      this.userProgress.totalLearningMinutes += 15;

      // Update active day metric in chart
      const todayMetric = this.userProgress.weeklyActivity.find(a => a.isCurrentDay);
      if (todayMetric) {
        todayMetric.minutes += 15;
        todayMetric.lessons += 1;
      }

      void this.dbService.saveUserProgress(this.userProgress);
    }
  }

  /**
   * Saves an unfamiliar word encountered in Reading mode directly into the user's vocabulary deck
   */
  public saveWordFromReader(
    word: string,
    translation: string,
    phonetic: string = '[—]',
    cefrLevel: CEFRLevel = 'A1',
    source: string = 'Lecturas Editorial'
  ): VocabularyItem {
    const normalized = word.trim().toLowerCase();
    const existing = this.vocabularyList.find(
      w => w.word.toLowerCase() === normalized || w.word.toLowerCase().endsWith(` ${normalized}`)
    );

    if (existing) {
      if (!existing.isFavorite) {
        this.toggleFavoriteWord(existing.id);
      }
      return existing;
    }

    const newId = `reader-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: VocabularyItem = {
      id: newId,
      word: word.trim(),
      translation: translation.trim(),
      definition: `Palabra guardada desde lectura: "${translation.trim()}".`,
      partOfSpeech: 'sustantivo',
      phonetic,
      exampleSentence: '',
      exampleTranslation: '',
      cefrLevel,
      topic: 'Lecturas Guardadas',
      source,
      license: 'CC-BY-SA 4.0',
      isFavorite: true,
      fsrsCard: FSRSEngine.createNewCard(newId),
    };

    this.vocabularyList.unshift(newItem);
    if (!this.userProgress.savedWordIds.includes(newId)) {
      this.userProgress.savedWordIds.push(newId);
    }
    this.userProgress.vocabularyCount += 1;
    void this.dbService.saveVocabularyItem(newItem);
    void this.dbService.saveUserProgress(this.userProgress);
    return newItem;
  }

  /**
   * Imports and validates an external vocabulary pack through the ContentIngestionService pipeline
   */
  public importVocabularyPack(rawItems: any[]): IngestionReport<VocabularyItem> {
    const report = ContentIngestionService.ingestVocabularyPack(rawItems, this.vocabularyList);
    if (report.accepted.length > 0) {
      this.vocabularyList.push(...report.accepted);
      this.userProgress.vocabularyCount += report.accepted.length;
      for (const item of report.accepted) {
        void this.dbService.saveVocabularyItem(item);
      }
      void this.dbService.saveUserProgress(this.userProgress);
    }
    return report;
  }

  /**
   * Export all user progress, vocabulary, and writing drafts into a portable versioned JSON backup
   */
  public exportBackupJSON(): string {
    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userProgress: this.userProgress,
      customVocabulary: this.vocabularyList.filter(v => v.isFavorite || v.fsrsCard),
      favoriteWordIds: this.userProgress.savedWordIds,
      writingDrafts: this.writingDrafts,
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Import and validate a user JSON backup and persist locally
   */
  public importBackupJSON(jsonStr: string): { success: boolean; message: string } {
    try {
      const data: BackupData = JSON.parse(jsonStr);
      const validation = JSONSchemaValidator.validateBackupData(data);
      if (!validation.valid) {
        return {
          success: false,
          message: `Esquema de respaldo inválido: ${validation.errors.join(' ')}`,
        };
      }

      this.userProgress = { ...data.userProgress };
      void this.dbService.saveUserProgress(this.userProgress);

      if (Array.isArray(data.customVocabulary)) {
        data.customVocabulary.forEach(item => {
          const idx = this.vocabularyList.findIndex(v => v.id === item.id);
          if (idx >= 0) {
            this.vocabularyList[idx] = item;
          } else {
            this.vocabularyList.push(item);
          }
          void this.dbService.saveVocabularyItem(item);
          if (item.fsrsCard) {
            void this.dbService.saveFSRSCard(item.fsrsCard);
          }
        });
      }

      if (Array.isArray(data.writingDrafts)) {
        for (const draft of data.writingDrafts) {
          const idx = this.writingDrafts.findIndex(d => d.id === draft.id);
          if (idx >= 0) {
            this.writingDrafts[idx] = draft;
          } else {
            this.writingDrafts.push(draft);
          }
          void this.dbService.saveWritingDraft(draft);
        }
      }

      return { success: true, message: 'Copia de seguridad restaurada y guardada localmente con éxito.' };
    } catch (err: any) {
      return { success: false, message: `Error al procesar el archivo JSON: ${err.message}` };
    }
  }
}

