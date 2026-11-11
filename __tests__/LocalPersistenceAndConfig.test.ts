import { SupabaseService } from '../src/services/SupabaseService';
import { DatabaseService } from '../src/services/DatabaseService';
import { LearningService } from '../src/services/LearningService';

describe('Local Persistence & Per-User Supabase Settings', () => {
  afterEach(async () => {
    await SupabaseService.getInstance().clearConfiguration();
  });

  it('should reject invalid Supabase URL or short anon key in Settings', async () => {
    const sb = SupabaseService.getInstance();
    const badUrl = await sb.configure('not-a-url', 'valid-length-key-123456789012345');
    expect(badUrl.success).toBe(false);

    const shortKey = await sb.configure('https://myproject.supabase.co', 'short');
    expect(shortKey.success).toBe(false);
    expect(sb.isConfigured()).toBe(false);
  });

  it('should configure, persist, mask, and clear user Supabase settings dynamically', async () => {
    const sb = SupabaseService.getInstance();
    const db = DatabaseService.getInstance();
    await db.initializeDatabase();

    const res = await sb.configure(
      'https://userproject.supabase.co/',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.samplekey12345'
    );
    expect(res.success).toBe(true);
    expect(sb.isConfigured()).toBe(true);

    const cfg = sb.getConfiguration();
    expect(cfg.url).toBe('https://userproject.supabase.co');
    expect(cfg.anonKeyMasked).toContain('••••••');
    expect(cfg.anonKeyMasked).not.toContain('samplekey12345');

    const storedSettings = await db.getAppSettings();
    expect(storedSettings.supabaseConfig?.url).toBe('https://userproject.supabase.co');

    // Clear returns cleanly to 100% local mode
    await sb.clearConfiguration();
    expect(sb.isConfigured()).toBe(false);
    const clearedSettings = await db.getAppSettings();
    expect(clearedSettings.supabaseConfig).toBeUndefined();
  });

  it('should save, list, export in JSON, and delete writing drafts locally', async () => {
    const service = LearningService.getInstance();
    await service.initialize();

    const draft = await service.saveWritingDraft({
      id: 'draft-test-1',
      promptId: 'write-1',
      title: 'Mi rutina de la mañana',
      cefrLevel: 'A1',
      text: 'Me levanto temprano y tomo café con leche en la terraza.',
      wordCount: 11,
    });

    expect(draft.updatedAt).toBeDefined();
    expect(service.getWritingDrafts().some(d => d.id === 'draft-test-1')).toBe(true);

    const backupJson = service.exportBackupJSON();
    const parsed = JSON.parse(backupJson);
    expect(Array.isArray(parsed.writingDrafts)).toBe(true);
    expect(parsed.writingDrafts.some((d: any) => d.id === 'draft-test-1')).toBe(true);

    await service.deleteWritingDraft('draft-test-1');
    expect(service.getWritingDrafts().some(d => d.id === 'draft-test-1')).toBe(false);

    // Restoring JSON brings the writing draft back!
    const restoreRes = service.importBackupJSON(backupJson);
    expect(restoreRes.success).toBe(true);
    expect(service.getWritingDrafts().some(d => d.id === 'draft-test-1')).toBe(true);
  });

  it('should persist onboarding completion and profile preferences locally', async () => {
    const service = LearningService.getInstance();
    await service.initialize();

    await service.completeOnboarding({
      name: 'Carlos',
      cefrLevel: 'B1',
      dailyGoalMinutes: 30,
    });

    expect(service.hasCompletedOnboarding()).toBe(true);
    const progress = service.getProgress();
    expect(progress.name).toBe('Carlos');
    expect(progress.cefrLevel).toBe('B1');
    expect(progress.dailyGoalMinutes).toBe(30);
  });
});
