import { initialVocabulary } from '../src/data/vocabulary';
import { grammarLessons } from '../src/data/grammar';
import { verbDatabase } from '../src/data/verbs';
import { readingLibrary } from '../src/data/reading';
import { JSONSchemaValidator } from '../src/services/JSONSchemaValidator';
import { LearningService } from '../src/services/LearningService';
import { formatMinutesToHours } from '../src/utils/formatters';

describe('A1-B2 CEFR Curriculum Integrity', () => {
  it('should cover all CEFR levels (A1, A2, B1, B2) in vocabulary and pass JSON schema validation', () => {
    const validation = JSONSchemaValidator.validateVocabularyPack(initialVocabulary);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);

    const levels = new Set(initialVocabulary.map(v => v.cefrLevel));
    expect(levels.has('A1')).toBe(true);
    expect(levels.has('A2')).toBe(true);
    expect(levels.has('B1')).toBe(true);
    expect(levels.has('B2')).toBe(true);
    expect(initialVocabulary.length).toBeGreaterThanOrEqual(24);
  });

  it('should cover all CEFR levels (A1, A2, B1, B2) in progressive grammar lessons', () => {
    const levels = new Set(grammarLessons.map(g => g.cefrLevel));
    expect(levels.has('A1')).toBe(true);
    expect(levels.has('A2')).toBe(true);
    expect(levels.has('B1')).toBe(true);
    expect(levels.has('B2')).toBe(true);

    for (const lesson of grammarLessons) {
      expect(lesson.ruleCards.length).toBeGreaterThanOrEqual(1);
      expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
      expect(lesson.practiceQuestions.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should provide complete 6-tense pronoun forms for every verb in the database', () => {
    expect(verbDatabase.length).toBeGreaterThanOrEqual(10);
    const tenses = ['presente', 'preteritoPerfecto', 'imperfecto', 'futuro', 'condicional', 'subjuntivo'] as const;
    const pronouns = ['yo', 'tu', 'elEllaUsted', 'nosotros', 'vosotros', 'ellosEllasUstedes'] as const;

    for (const verb of verbDatabase) {
      for (const t of tenses) {
        for (const p of pronouns) {
          expect(verb.tenses[t][p]).toBeTruthy();
        }
      }
      expect(verb.examples.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should cover A1 through B2 reading passages with glossaries and comprehension questions', () => {
    const levels = new Set(readingLibrary.map(r => r.cefrLevel));
    expect(levels.has('A1')).toBe(true);
    expect(levels.has('A2')).toBe(true);
    expect(levels.has('B1')).toBe(true);
    expect(levels.has('B2')).toBe(true);

    for (const story of readingLibrary) {
      expect(Object.keys(story.translationGlossary).length).toBeGreaterThanOrEqual(4);
      expect(story.comprehensionQuestions.length).toBeGreaterThanOrEqual(1);
      expect(story.license).toBeTruthy();
      expect(story.source).toBeTruthy();
    }
  });

  it('should save words tapped in Reading mode into LearningService vocabulary without duplicating', () => {
    const service = LearningService.getInstance();
    const initialCount = service.getVocabulary().length;

    const saved = service.saveWordFromReader('la vereda', 'the path', '[be-ˈɾe-ða]', 'B1', 'Test Story');
    expect(saved.isFavorite).toBe(true);
    expect(service.getVocabulary().length).toBe(initialCount + 1);

    // Saving same word again should deduplicate
    service.saveWordFromReader('la vereda', 'the path', '[be-ˈɾe-ða]', 'B1', 'Test Story');
    expect(service.getVocabulary().length).toBe(initialCount + 1);
  });

  it('should compute FSRS forecast and format durations accurately', () => {
    const service = LearningService.getInstance();
    const forecast = service.getReviewForecast();
    expect(forecast.dueToday).toBeGreaterThan(0);
    expect(forecast.dueThisWeek).toBeGreaterThanOrEqual(forecast.dueToday);

    expect(formatMinutesToHours(45)).toBe('45m');
    expect(formatMinutesToHours(215)).toBe('3h 35m');
  });
});
