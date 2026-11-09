import { JSONSchemaValidator } from '../src/services/JSONSchemaValidator';
import { initialUserProgress } from '../src/data/userProgress';
import { initialVocabulary } from '../src/data/vocabulary';

describe('JSONSchemaValidator', () => {
  it('should validate complete user backup data', () => {
    const validBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userProgress: initialUserProgress,
      customVocabulary: initialVocabulary,
      favoriteWordIds: ['vocab-1'],
    };

    const result = JSONSchemaValidator.validateBackupData(validBackup);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should reject backup missing version or userProgress', () => {
    const invalidBackup = {
      exportedAt: new Date().toISOString(),
    };

    const result = JSONSchemaValidator.validateBackupData(invalidBackup);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });

  it('should validate external vocabulary pack with attribution & licenses', () => {
    const validPack = [
      {
        id: 'pack-1',
        word: 'la flor',
        translation: 'the flower',
        definition: 'Parte reproductora de una planta.',
        partOfSpeech: 'sustantivo',
        phonetic: '[fla-lor]',
        cefrLevel: 'A1',
        topic: 'Naturaleza',
        source: 'Wiktionary',
        license: 'CC-BY-SA 4.0',
      },
    ];

    const result = JSONSchemaValidator.validateVocabularyPack(validPack);
    expect(result.valid).toBe(true);
  });

  it('should flag vocabulary pack without source attribution', () => {
    const invalidPack = [
      {
        id: 'pack-2',
        word: 'el sol',
        translation: 'the sun',
        phonetic: '[sol]',
        cefrLevel: 'A1',
      },
    ];

    const result = JSONSchemaValidator.validateVocabularyPack(invalidPack);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('licencia'))).toBe(true);
  });
});
