import { VocabularyItem, UserProgress, FSRSCard, WritingDraft, AppSettings } from '../types';

/**
 * Local Offline Persistence Service (SQLite on iOS/Android + localStorage JSON on Web)
 * Implements Section 13 of PRD: Offline-first local persistence across app restarts.
 */

export interface SyncMutation {
  id: string;
  table: 'vocabulary' | 'fsrs_cards' | 'user_progress';
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  recordId: string;
  payload: string; // JSON string
  timestamp: string;
}

export interface LocalCacheStats {
  initialized: boolean;
  driver: 'expo-sqlite' | 'web-localstorage' | 'memory-fallback';
  vocabularyCount: number;
  fsrsCardsCount: number;
  writingDraftsCount: number;
  pendingMutationsCount: number;
  schemaVersion: number;
}

export const SQLITE_MIGRATIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS local_vocabulary (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS local_fsrs_cards (
    card_id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    due TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS local_user_progress (
    user_id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS local_writing_drafts (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS local_app_settings (
    key TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS pending_mutations (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    record_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );`,
];

const WEB_STORAGE_KEY = 'spanishlearn_local_store_v1';

interface WebStorageSnapshot {
  vocabulary: Record<string, VocabularyItem>;
  fsrsCards: Record<string, FSRSCard>;
  userProgress: (UserProgress & { updatedAt?: string }) | null;
  writingDrafts: Record<string, WritingDraft>;
  appSettings: AppSettings;
  mutationQueue: SyncMutation[];
}

export class DatabaseService {
  private static instance: DatabaseService;
  private isInitialized = false;
  private driver: LocalCacheStats['driver'] = 'memory-fallback';
  private sqliteDb: any = null;

  // Hydrated cache for synchronous/fast runtime access
  private localVocabulary = new Map<string, VocabularyItem>();
  private localFSRSCards = new Map<string, FSRSCard>();
  private localUserProgress: (UserProgress & { updatedAt?: string }) | null = null;
  private localWritingDrafts = new Map<string, WritingDraft>();
  private localAppSettings: AppSettings = { hasCompletedOnboarding: false };
  private mutationQueue: SyncMutation[] = [];

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private hasWebLocalStorage(): boolean {
    try {
      return (
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined' &&
        window.localStorage !== null
      );
    } catch {
      return false;
    }
  }

  private persistWebSnapshot(): void {
    if (this.driver !== 'web-localstorage' || !this.hasWebLocalStorage()) return;
    try {
      const snapshot: WebStorageSnapshot = {
        vocabulary: Object.fromEntries(this.localVocabulary.entries()),
        fsrsCards: Object.fromEntries(this.localFSRSCards.entries()),
        userProgress: this.localUserProgress,
        writingDrafts: Object.fromEntries(this.localWritingDrafts.entries()),
        appSettings: this.localAppSettings,
        mutationQueue: this.mutationQueue,
      };
      window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Initializes SQLite (iOS/Android) or localStorage (Web) and hydrates saved state
   */
  public async initializeDatabase(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const SQLite = require('expo-sqlite');
        if (SQLite?.openDatabaseAsync) {
          this.sqliteDb = await SQLite.openDatabaseAsync('spanishlearn.db');
          for (const ddl of SQLITE_MIGRATIONS) {
            await this.sqliteDb.execAsync(ddl);
          }
          await this.sqliteDb.runAsync(
            `INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES (?, ?)`,
            [1, new Date().toISOString()]
          );
          this.driver = 'expo-sqlite';
          await this.hydrateFromSQLite();
        }
      } else if (this.hasWebLocalStorage()) {
        this.driver = 'web-localstorage';
        this.hydrateFromWebStorage();
      }
    } catch {
      this.driver = 'memory-fallback';
      this.sqliteDb = null;
    }

    this.isInitialized = true;
    return true;
  }

  private async hydrateFromSQLite(): Promise<void> {
    if (!this.sqliteDb) return;

    const vocabRows: Array<{ id: string; payload: string }> = await this.sqliteDb.getAllAsync(
      `SELECT id, payload FROM local_vocabulary`
    );
    for (const row of vocabRows) {
      this.localVocabulary.set(row.id, JSON.parse(row.payload));
    }

    const cardRows: Array<{ card_id: string; payload: string }> = await this.sqliteDb.getAllAsync(
      `SELECT card_id, payload FROM local_fsrs_cards`
    );
    for (const row of cardRows) {
      this.localFSRSCards.set(row.card_id, JSON.parse(row.payload));
    }

    const progressRows: Array<{ payload: string }> = await this.sqliteDb.getAllAsync(
      `SELECT payload FROM local_user_progress LIMIT 1`
    );
    if (progressRows.length > 0) {
      this.localUserProgress = JSON.parse(progressRows[0].payload);
    }

    const draftRows: Array<{ id: string; payload: string }> = await this.sqliteDb.getAllAsync(
      `SELECT id, payload FROM local_writing_drafts`
    );
    for (const row of draftRows) {
      this.localWritingDrafts.set(row.id, JSON.parse(row.payload));
    }

    const settingRows: Array<{ payload: string }> = await this.sqliteDb.getAllAsync(
      `SELECT payload FROM local_app_settings WHERE key = 'app_settings' LIMIT 1`
    );
    if (settingRows.length > 0) {
      this.localAppSettings = JSON.parse(settingRows[0].payload);
    }

    const mutationRows: Array<{
      id: string;
      table_name: SyncMutation['table'];
      operation: SyncMutation['operation'];
      record_id: string;
      payload: string;
      timestamp: string;
    }> = await this.sqliteDb.getAllAsync(`SELECT * FROM pending_mutations ORDER BY timestamp ASC`);
    this.mutationQueue = mutationRows.map(r => ({
      id: r.id,
      table: r.table_name,
      operation: r.operation,
      recordId: r.record_id,
      payload: r.payload,
      timestamp: r.timestamp,
    }));
  }

  private hydrateFromWebStorage(): void {
    try {
      const raw = window.localStorage.getItem(WEB_STORAGE_KEY);
      if (!raw) return;
      const snapshot = JSON.parse(raw) as Partial<WebStorageSnapshot>;

      if (snapshot.vocabulary) {
        Object.entries(snapshot.vocabulary).forEach(([k, v]) => this.localVocabulary.set(k, v));
      }
      if (snapshot.fsrsCards) {
        Object.entries(snapshot.fsrsCards).forEach(([k, v]) => this.localFSRSCards.set(k, v));
      }
      if (snapshot.userProgress) {
        this.localUserProgress = snapshot.userProgress;
      }
      if (snapshot.writingDrafts) {
        Object.entries(snapshot.writingDrafts).forEach(([k, v]) =>
          this.localWritingDrafts.set(k, v)
        );
      }
      if (snapshot.appSettings) {
        this.localAppSettings = snapshot.appSettings;
      }
      if (Array.isArray(snapshot.mutationQueue)) {
        this.mutationQueue = snapshot.mutationQueue;
      }
    } catch {
      // Ignore corrupt web cache
    }
  }

  public getCacheStats(): LocalCacheStats {
    return {
      initialized: this.isInitialized,
      driver: this.driver,
      vocabularyCount: this.localVocabulary.size,
      fsrsCardsCount: this.localFSRSCards.size,
      writingDraftsCount: this.localWritingDrafts.size,
      pendingMutationsCount: this.mutationQueue.length,
      schemaVersion: 1,
    };
  }

  public async saveVocabularyItem(item: VocabularyItem, enqueueSync: boolean = true): Promise<void> {
    const now = new Date().toISOString();
    this.localVocabulary.set(item.id, item);

    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(
        `INSERT OR REPLACE INTO local_vocabulary (id, payload, updated_at) VALUES (?, ?, ?)`,
        [item.id, JSON.stringify(item), now]
      );
    }
    this.persistWebSnapshot();

    if (enqueueSync) {
      await this.enqueueMutation('vocabulary', 'UPDATE', item.id, item, now);
    }
  }

  public async getVocabulary(): Promise<VocabularyItem[]> {
    return Array.from(this.localVocabulary.values());
  }

  public async saveFSRSCard(card: FSRSCard, enqueueSync: boolean = true): Promise<void> {
    const now = card.lastReview || new Date().toISOString();
    this.localFSRSCards.set(card.cardId, card);

    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(
        `INSERT OR REPLACE INTO local_fsrs_cards (card_id, payload, due, updated_at) VALUES (?, ?, ?, ?)`,
        [card.cardId, JSON.stringify(card), card.due, now]
      );
    }
    this.persistWebSnapshot();

    if (enqueueSync) {
      await this.enqueueMutation('fsrs_cards', 'UPDATE', card.cardId, card, now);
    }
  }

  public async getFSRSCard(cardId: string): Promise<FSRSCard | null> {
    return this.localFSRSCards.get(cardId) || null;
  }

  public async getAllFSRSCards(): Promise<FSRSCard[]> {
    return Array.from(this.localFSRSCards.values());
  }

  public async saveUserProgress(
    progress: UserProgress,
    updatedAt: string = new Date().toISOString(),
    enqueueSync: boolean = true
  ): Promise<void> {
    const stamped = { ...progress, updatedAt };
    this.localUserProgress = stamped;

    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(
        `INSERT OR REPLACE INTO local_user_progress (user_id, payload, updated_at) VALUES (?, ?, ?)`,
        [progress.userId, JSON.stringify(stamped), updatedAt]
      );
    }
    this.persistWebSnapshot();

    if (enqueueSync) {
      await this.enqueueMutation('user_progress', 'UPDATE', progress.userId, stamped, updatedAt);
    }
  }

  public async getUserProgress(): Promise<(UserProgress & { updatedAt?: string }) | null> {
    return this.localUserProgress ? { ...this.localUserProgress } : null;
  }

  public async saveWritingDraft(draft: WritingDraft): Promise<void> {
    this.localWritingDrafts.set(draft.id, draft);
    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(
        `INSERT OR REPLACE INTO local_writing_drafts (id, payload, updated_at) VALUES (?, ?, ?)`,
        [draft.id, JSON.stringify(draft), draft.updatedAt]
      );
    }
    this.persistWebSnapshot();
  }

  public async getWritingDrafts(): Promise<WritingDraft[]> {
    return Array.from(this.localWritingDrafts.values()).sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    );
  }

  public async deleteWritingDraft(draftId: string): Promise<void> {
    this.localWritingDrafts.delete(draftId);
    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(`DELETE FROM local_writing_drafts WHERE id = ?`, [draftId]);
    }
    this.persistWebSnapshot();
  }

  public async saveAppSettings(settings: AppSettings): Promise<void> {
    const now = new Date().toISOString();
    this.localAppSettings = { ...settings };
    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(
        `INSERT OR REPLACE INTO local_app_settings (key, payload, updated_at) VALUES (?, ?, ?)`,
        ['app_settings', JSON.stringify(this.localAppSettings), now]
      );
    }
    this.persistWebSnapshot();
  }

  public async getAppSettings(): Promise<AppSettings> {
    return { ...this.localAppSettings };
  }

  public getPendingMutations(): SyncMutation[] {
    return [...this.mutationQueue];
  }

  public async clearMutations(mutationIds: string[]): Promise<void> {
    this.mutationQueue = this.mutationQueue.filter(m => !mutationIds.includes(m.id));
    if (this.sqliteDb && mutationIds.length > 0) {
      const placeholders = mutationIds.map(() => '?').join(',');
      await this.sqliteDb.runAsync(
        `DELETE FROM pending_mutations WHERE id IN (${placeholders})`,
        mutationIds
      );
    }
    this.persistWebSnapshot();
  }

  private async enqueueMutation(
    table: SyncMutation['table'],
    operation: SyncMutation['operation'],
    recordId: string,
    data: any,
    timestamp: string
  ): Promise<void> {
    const payload = JSON.stringify(data);

    const existingIdx = this.mutationQueue.findIndex(
      m => m.table === table && m.recordId === recordId
    );

    if (existingIdx >= 0) {
      this.mutationQueue[existingIdx] = {
        ...this.mutationQueue[existingIdx],
        operation,
        payload,
        timestamp,
      };
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          `UPDATE pending_mutations SET operation = ?, payload = ?, timestamp = ? WHERE id = ?`,
          [operation, payload, timestamp, this.mutationQueue[existingIdx].id]
        );
      }
      this.persistWebSnapshot();
      return;
    }

    const mutation: SyncMutation = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      table,
      operation,
      recordId,
      payload,
      timestamp,
    };
    this.mutationQueue.push(mutation);

    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(
        `INSERT INTO pending_mutations (id, table_name, operation, record_id, payload, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [mutation.id, table, operation, recordId, payload, timestamp]
      );
    }
    this.persistWebSnapshot();
  }
}
