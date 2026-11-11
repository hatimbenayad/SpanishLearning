import { VocabularyItem, UserProgress, FSRSCard } from '../types';

/**
 * Local Offline SQLite Database Service
 * Implements Section 13 of PRD: Offline-first architecture and Expo SQLite persistence.
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
  driver: 'expo-sqlite' | 'memory-fallback';
  vocabularyCount: number;
  fsrsCardsCount: number;
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
  `CREATE TABLE IF NOT EXISTS pending_mutations (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    record_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );`,
];

export class DatabaseService {
  private static instance: DatabaseService;
  private isInitialized = false;
  private driver: 'expo-sqlite' | 'memory-fallback' = 'memory-fallback';
  private sqliteDb: any = null;

  // In-memory mirrored cache for fast synchronous access & Jest compatibility
  private localVocabulary = new Map<string, VocabularyItem>();
  private localFSRSCards = new Map<string, FSRSCard>();
  private localUserProgress: (UserProgress & { updatedAt?: string }) | null = null;
  private mutationQueue: SyncMutation[] = [];

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initializeDatabase(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Load expo-sqlite dynamically only in native/Expo runtime
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
        }
      }
    } catch {
      // Gracefully operate with in-memory fallback when native SQLite isn't linked (e.g. Jest/Node/Web)
      this.driver = 'memory-fallback';
      this.sqliteDb = null;
    }

    this.isInitialized = true;
    return true;
  }

  public getCacheStats(): LocalCacheStats {
    return {
      initialized: this.isInitialized,
      driver: this.driver,
      vocabularyCount: this.localVocabulary.size,
      fsrsCardsCount: this.localFSRSCards.size,
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

    if (enqueueSync) {
      await this.enqueueMutation('user_progress', 'UPDATE', progress.userId, stamped, updatedAt);
    }
  }

  public async getUserProgress(): Promise<(UserProgress & { updatedAt?: string }) | null> {
    return this.localUserProgress ? { ...this.localUserProgress } : null;
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
  }

  private async enqueueMutation(
    table: SyncMutation['table'],
    operation: SyncMutation['operation'],
    recordId: string,
    data: any,
    timestamp: string
  ): Promise<void> {
    const payload = JSON.stringify(data);

    // Coalesce repeated offline mutations to the same (table, recordId)
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
  }
}
