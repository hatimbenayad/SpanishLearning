import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService, SQLITE_MIGRATIONS } from '../src/services/DatabaseService';
import {
  SupabaseService,
  RemoteSyncTransport,
  RemoteUserProgressRecord,
  RemoteFSRSCardRecord,
} from '../src/services/SupabaseService';
import { SyncEngine } from '../src/services/SyncEngine';
import { AuthService } from '../src/services/AuthService';
import { FSRSEngine } from '../src/services/FSRSEngine';
import { initialUserProgress } from '../src/data/userProgress';

describe('Supabase Sync, Auth, Conflict Resolution & Migrations (Issue #2)', () => {
  afterEach(() => {
    SupabaseService.getInstance().setTransport(null);
    SyncEngine.getInstance().setOnlineStatus(true);
  });

  it('should include valid PostgreSQL migrations and RLS policies', () => {
    const schemaPath = path.resolve(__dirname, '../supabase/migrations/202611110001_initial_schema.sql');
    const rlsPath = path.resolve(__dirname, '../supabase/migrations/202611110002_rls_policies.sql');

    expect(fs.existsSync(schemaPath)).toBe(true);
    expect(fs.existsSync(rlsPath)).toBe(true);

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    const rlsSql = fs.readFileSync(rlsPath, 'utf-8');

    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.user_progress');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.user_vocabulary_cards');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.vocabulary_items');
    expect(rlsSql).toContain('ENABLE ROW LEVEL SECURITY');
    expect(rlsSql).toContain('auth.uid() = user_id');
    expect(SQLITE_MIGRATIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('should resolve UserProgress conflicts monotonically without silently overwriting progress', () => {
    const local = {
      ...initialUserProgress,
      totalLearningMinutes: 250,
      bestStreak: 14,
      completedLessonIds: ['gram-1', 'read-1', 'gram-5'],
      savedWordIds: ['vocab-1', 'vocab-a2-2'],
      updatedAt: '2026-11-11T12:00:00.000Z',
    };

    const remote: RemoteUserProgressRecord = {
      user_id: local.userId,
      cefr_level: 'A2',
      daily_goal_minutes: 30,
      current_streak: 12,
      best_streak: 18,
      total_learning_minutes: 215,
      vocabulary_count: 35,
      completed_lesson_ids: ['gram-1', 'gram-3'],
      saved_word_ids: ['vocab-1', 'vocab-5'],
      skill_proficiency: { reading: 85, listening: 64, writing: 40, speaking: 45 },
      updated_at: '2026-11-11T13:00:00.000Z', // Remote timestamp is newer
    };

    const merged = SyncEngine.resolveProgressConflict(local, remote);

    // Monotonic sums/maxima preserved across both sides
    expect(merged.totalLearningMinutes).toBe(250);
    expect(merged.bestStreak).toBe(18);
    expect(merged.vocabularyCount).toBe(35);
    expect(merged.skillProficiency.reading).toBe(85);
    expect(merged.skillProficiency.writing).toBe(52);
    // Union of completed lessons & saved words
    expect(merged.completedLessonIds).toEqual(
      expect.arrayContaining(['gram-1', 'read-1', 'gram-5', 'gram-3'])
    );
    expect(merged.savedWordIds).toEqual(
      expect.arrayContaining(['vocab-1', 'vocab-a2-2', 'vocab-5'])
    );
    // Scalar preference follows newer timestamp
    expect(merged.cefrLevel).toBe('A2');
  });

  it('should resolve FSRS card conflicts by selecting newest review timestamp', () => {
    const localCard = FSRSEngine.createNewCard('vocab-1');
    localCard.reps = 2;
    localCard.lastReview = '2026-11-10T10:00:00.000Z';

    const remoteCard: RemoteFSRSCardRecord = {
      user_id: 'usr-1',
      word_id: 'vocab-1',
      state: 'review',
      reps: 4,
      lapses: 0,
      stability: 6.5,
      difficulty: 4.1,
      due: '2026-11-18T10:00:00.000Z',
      last_review: '2026-11-11T09:00:00.000Z',
      is_favorite: true,
      updated_at: '2026-11-11T09:00:00.000Z',
    };

    const winning = SyncEngine.resolveCardConflict(localCard, remoteCard);
    expect(winning.reps).toBe(4);
    expect(winning.stability).toBe(6.5);
  });

  it('should push offline mutations and pull remote records via injected Supabase transport', async () => {
    const db = DatabaseService.getInstance();
    const supabase = SupabaseService.getInstance();
    const sync = SyncEngine.getInstance();
    const auth = AuthService.getInstance();

    await db.initializeDatabase();
    auth.setActiveUser({
      id: 'usr-cloud-99',
      email: 'hatim@example.com',
      name: 'Hatim',
      isGuest: false,
    });

    const upsertedProgress: RemoteUserProgressRecord[] = [];
    const upsertedCards: RemoteFSRSCardRecord[] = [];

    const mockTransport: RemoteSyncTransport = {
      isConfigured: () => true,
      fetchUserProgress: async () => null,
      upsertUserProgress: async rec => {
        upsertedProgress.push(rec);
      },
      fetchUserCards: async () => [
        {
          user_id: 'usr-cloud-99',
          word_id: 'remote-word-42',
          state: 'review',
          reps: 3,
          lapses: 0,
          stability: 4.2,
          difficulty: 4.5,
          due: '2026-11-15T10:00:00.000Z',
          last_review: '2026-11-11T08:00:00.000Z',
          is_favorite: true,
          updated_at: '2026-11-11T08:00:00.000Z',
        },
      ],
      upsertUserCard: async rec => {
        upsertedCards.push(rec);
      },
    };

    supabase.setTransport(mockTransport);

    // Queue offline changes (including repeated edits to verify coalescing)
    const testProgress = { ...initialUserProgress, userId: 'usr-cloud-99', totalLearningMinutes: 300 };
    await db.saveUserProgress(testProgress);
    await db.saveUserProgress({ ...testProgress, totalLearningMinutes: 315 });

    const card = FSRSEngine.createNewCard('vocab-1');
    const { updatedCard } = FSRSEngine.scheduleNextReview(card, 3);
    await db.saveFSRSCard(updatedCard);

    sync.setOnlineStatus(true);
    const result = await sync.synchronize();

    expect(result.success).toBe(true);
    expect(upsertedProgress.length).toBe(1); // Coalesced!
    expect(upsertedProgress[0].total_learning_minutes).toBe(315);
    expect(upsertedCards.length).toBe(1);
    expect(result.pulledCount).toBe(1); // Remote card hydrated locally

    const pulledLocalCard = await db.getFSRSCard('remote-word-42');
    expect(pulledLocalCard).not.toBeNull();
    expect(pulledLocalCard?.reps).toBe(3);
    expect(sync.getStatus().pendingChangesCount).toBe(0);
  });

  it('should validate email/password inputs cleanly in AuthService', async () => {
    const auth = AuthService.getInstance();
    const badEmail = await auth.signUp('not-an-email', 'secret123', 'Hatim');
    expect(badEmail.success).toBe(false);

    const shortPw = await auth.signUp('hatim@example.com', '123', 'Hatim');
    expect(shortPw.success).toBe(false);

    await auth.signOut();
    expect(auth.getCurrentUser().isGuest).toBe(true);
  });
});
