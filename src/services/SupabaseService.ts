import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProgress, FSRSCard, VocabularyItem, SupabaseConfig } from '../types';
import { DatabaseService } from './DatabaseService';

/**
 * Supabase Cloud Client & Remote Data Abstraction Layer
 * Implements PRD Section 1 & 13, supporting per-user Supabase configuration in Settings
 * and falling back gracefully to 100% local JSON/SQLite persistence when unconfigured.
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
  private activeConfig: SupabaseConfig | null = null;

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
      this.instantiateClient(url, anonKey);
    }
  }

  private instantiateClient(url: string, anonKey: string): void {
    this.activeConfig = { url: url.trim(), anonKey: anonKey.trim() };
    this.client = createClient(this.activeConfig.url, this.activeConfig.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
      },
    });
  }

  /**
   * Restores user-configured Supabase credentials from local SQLite / storage
   */
  public async loadSavedConfiguration(): Promise<void> {
    const db = DatabaseService.getInstance();
    const settings = await db.getAppSettings();
    if (settings.supabaseConfig?.url && settings.supabaseConfig?.anonKey) {
      this.instantiateClient(settings.supabaseConfig.url, settings.supabaseConfig.anonKey);
    }
  }

  /**
   * Configures and saves the user's personal Supabase project URL & Anon Key locally
   */
  public async configure(
    url: string,
    anonKey: string
  ): Promise<{ success: boolean; message: string }> {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://')) {
      return {
        success: false,
        message: 'La URL de Supabase debe comenzar con https:// (ej: https://xyz.supabase.co).',
      };
    }
    if (cleanKey.length < 20) {
      return {
        success: false,
        message: 'La clave pública (Anon Key) parece incompleta.',
      };
    }

    this.instantiateClient(cleanUrl, cleanKey);

    const db = DatabaseService.getInstance();
    const currentSettings = await db.getAppSettings();
    await db.saveAppSettings({
      ...currentSettings,
      supabaseConfig: { url: cleanUrl, anonKey: cleanKey },
    });

    return {
      success: true,
      message: 'Configuración de Supabase guardada correctamente.',
    };
  }

  /**
   * Disconnects user Supabase configuration and returns to 100% local persistence mode
   */
  public async clearConfiguration(): Promise<void> {
    this.client = null;
    this.activeConfig = null;

    const db = DatabaseService.getInstance();
    const currentSettings = await db.getAppSettings();
    const { supabaseConfig: _, ...rest } = currentSettings;
    await db.saveAppSettings(rest);
  }

  public getConfiguration(): { url: string; anonKeyMasked: string; isConfigured: boolean } {
    if (!this.activeConfig) {
      return { url: '', anonKeyMasked: '', isConfigured: false };
    }
    const key = this.activeConfig.anonKey;
    const masked =
      key.length > 10 ? `${key.substring(0, 6)}••••••${key.substring(key.length - 4)}` : '••••••';
    return {
      url: this.activeConfig.url,
      anonKeyMasked: masked,
      isConfigured: true,
    };
  }

  /**
   * Tests reachability and schema availability against the configured Supabase instance
   */
  public async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.client) {
      return { ok: false, message: 'No hay un proyecto Supabase configurado todavía.' };
    }
    try {
      const { error } = await this.client.from('cefr_levels').select('code').limit(1);
      if (error) {
        return {
          ok: false,
          message: `Conectado al servidor, pero falta ejecutar las migraciones SQL: ${error.message}`,
        };
      }
      return { ok: true, message: 'Conexión verificada con tu proyecto Supabase.' };
    } catch (err: any) {
      return { ok: false, message: `No se pudo contactar con Supabase: ${err.message}` };
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
