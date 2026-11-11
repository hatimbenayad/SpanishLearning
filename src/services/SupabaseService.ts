import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProgress, FSRSCard, VocabularyItem } from '../types';

/**
 * Supabase Cloud Client & Remote Data Abstraction Layer
 * Implements PRD Section 1 & 13 (Rule #6: Keep Supabase access behind a dedicated data layer).
 */

export interface RemoteUserProgressRecord {
  user_id: string;
  cefr_level: string;
  daily_goal_minutes: number;
  current_streak: number;
  best_streak: number;
  total_learning_minutes: number;
  vocabulary_count: number;
  completed_lesson_ids: string[];
  saved_word_ids: string[];
  skill_proficiency: UserProgress['skillProficiency'];
  updated_at: string;
}

export interface RemoteFSRSCardRecord {
  user_id: string;
  word_id: string;
  word_payload?: VocabularyItem | null;
  state: FSRSCard['state'];
  reps: number;
  lapses: number;
  stability: number;
  difficulty: number;
  due: string;
  last_review?: string | null;
  is_favorite: boolean;
  updated_at: string;
}

export interface RemoteSyncTransport {
  isConfigured(): boolean;
  fetchUserProgress(userId: string): Promise<RemoteUserProgressRecord | null>;
  upsertUserProgress(record: RemoteUserProgressRecord): Promise<void>;
  fetchUserCards(userId: string): Promise<RemoteFSRSCardRecord[]>;
  upsertUserCard(record: RemoteFSRSCardRecord): Promise<void>;
}

export class SupabaseService implements RemoteSyncTransport {
  private static instance: SupabaseService;
  private client: SupabaseClient | null = null;
  private customTransport: RemoteSyncTransport | null = null;

  private constructor() {
    this.initFromEnv();
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  private initFromEnv(): void {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (url && anonKey && url.startsWith('http')) {
      this.client = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: true,
        },
      });
    }
  }

  /**
   * Allows injecting a deterministic mock transport in tests or custom adapters
   */
  public setTransport(transport: RemoteSyncTransport | null): void {
    this.customTransport = transport;
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public isConfigured(): boolean {
    if (this.customTransport) {
      return this.customTransport.isConfigured();
    }
    return this.client !== null;
  }

  public async fetchUserProgress(userId: string): Promise<RemoteUserProgressRecord | null> {
    if (this.customTransport) {
      return this.customTransport.fetchUserProgress(userId);
    }
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as RemoteUserProgressRecord) || null;
  }

  public async upsertUserProgress(record: RemoteUserProgressRecord): Promise<void> {
    if (this.customTransport) {
      return this.customTransport.upsertUserProgress(record);
    }
    if (!this.client) return;

    const { error } = await this.client
      .from('user_progress')
      .upsert(record, { onConflict: 'user_id' });

    if (error) throw new Error(error.message);
  }

  public async fetchUserCards(userId: string): Promise<RemoteFSRSCardRecord[]> {
    if (this.customTransport) {
      return this.customTransport.fetchUserCards(userId);
    }
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('user_vocabulary_cards')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return (data as RemoteFSRSCardRecord[]) || [];
  }

  public async upsertUserCard(record: RemoteFSRSCardRecord): Promise<void> {
    if (this.customTransport) {
      return this.customTransport.upsertUserCard(record);
    }
    if (!this.client) return;

    const { error } = await this.client
      .from('user_vocabulary_cards')
      .upsert(record, { onConflict: 'user_id,word_id' });

    if (error) throw new Error(error.message);
  }
}
