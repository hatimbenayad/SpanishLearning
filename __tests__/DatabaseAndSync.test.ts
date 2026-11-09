import { DatabaseService } from '../src/services/DatabaseService';
import { SyncEngine } from '../src/services/SyncEngine';
import { initialVocabulary } from '../src/data/vocabulary';
import { initialUserProgress } from '../src/data/userProgress';

describe('DatabaseService and SyncEngine', () => {
  let db: DatabaseService;
  let sync: SyncEngine;

  beforeEach(() => {
    db = DatabaseService.getInstance();
    sync = SyncEngine.getInstance();
  });

  it('should initialize database successfully', async () => {
    const initialized = await db.initializeDatabase();
    expect(initialized).toBe(true);
  });

  it('should store and retrieve vocabulary in offline persistence', async () => {
    const item = initialVocabulary[0];
    await db.saveVocabularyItem(item);

    const items = await db.getVocabulary();
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items.some(i => i.id === item.id)).toBe(true);
  });

  it('should queue pending mutations for offline changes', async () => {
    await db.saveUserProgress(initialUserProgress);
    const mutations = db.getPendingMutations();
    expect(mutations.length).toBeGreaterThan(0);
    expect(mutations.some(m => m.table === 'user_progress')).toBe(true);
  });

  it('should synchronize pending changes when online', async () => {
    sync.setOnlineStatus(true);
    const result = await sync.synchronize();
    expect(result.success).toBe(true);

    const status = sync.getStatus();
    expect(status.pendingChangesCount).toBe(0);
  });

  it('should halt sync when offline without data loss', async () => {
    // Add another item
    await db.saveVocabularyItem(initialVocabulary[1]);
    sync.setOnlineStatus(false);

    const result = await sync.synchronize();
    expect(result.success).toBe(false);
    expect(result.message).toContain('sin conexión');

    const status = sync.getStatus();
    expect(status.pendingChangesCount).toBeGreaterThan(0);
  });
});
