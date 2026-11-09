import { LearningService } from '../src/services/LearningService';

describe('LearningService', () => {
  let service: LearningService;

  beforeEach(() => {
    service = LearningService.getInstance();
  });

  it('should return initial user progress with CEFR level', () => {
    const progress = service.getProgress();
    expect(progress.name).toBe('Daizy Shah');
    expect(progress.cefrLevel).toBe('A1');
    expect(progress.currentStreak).toBe(12);
    expect(progress.weeklyActivity.length).toBe(7);
  });

  it('should toggle favorite status of vocabulary item', () => {
    const vocab = service.getVocabulary();
    const firstWord = vocab[0];
    const initialFav = firstWord.isFavorite ?? false;

    const newFav = service.toggleFavoriteWord(firstWord.id);
    expect(newFav).toBe(!initialFav);

    // Toggle back
    const restoredFav = service.toggleFavoriteWord(firstWord.id);
    expect(restoredFav).toBe(initialFav);
  });

  it('should export and import backup data in valid JSON format', () => {
    const exportedJson = service.exportBackupJSON();
    expect(typeof exportedJson).toBe('string');

    const parsed = JSON.parse(exportedJson);
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.userProgress.name).toBe('Daizy Shah');

    // Test import
    const importResult = service.importBackupJSON(exportedJson);
    expect(importResult.success).toBe(true);
  });

  it('should handle corrupt JSON gracefully on import', () => {
    const badResult = service.importBackupJSON('{ corrupted: json }}}');
    expect(badResult.success).toBe(false);
    expect(badResult.message).toContain('Error');
  });
});
