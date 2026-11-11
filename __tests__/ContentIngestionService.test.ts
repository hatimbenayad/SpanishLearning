import { ContentIngestionService } from '../src/services/ContentIngestionService';
import { initialVocabulary } from '../src/data/vocabulary';
import { readingLibrary } from '../src/data/reading';

describe('ContentIngestionService (PRD Section 12 Pipeline)', () => {
  it('should ingest valid open-source vocabulary items and deduplicate existing ones', () => {
    const incomingPack = [
      {
        id: 'ext-1',
        word: 'la tertulia', // already exists in initialVocabulary!
        translation: 'social gathering',
        definition: 'Reunión habitual de personas.',
        partOfSpeech: 'sustantivo',
        phonetic: '[teɾ-ˈtu-lja]',
        cefrLevel: 'B1',
        topic: 'Cultura',
        source: 'Wiktionary',
        license: 'CC-BY-SA 4.0',
      },
      {
        id: 'ext-2',
        word: 'el atardecer',
        translation: 'sunset / dusk',
        definition: 'Última parte de la tarde, cuando se pone el sol.',
        partOfSpeech: 'sustantivo',
        gender: 'm',
        phonetic: '[a-taɾ-ðe-ˈθeɾ]',
        exampleSentence: 'Contemplamos el atardecer desde la colina.',
        exampleTranslation: 'We watched the sunset from the hill.',
        cefrLevel: 'A2',
        topic: 'Naturaleza',
        source: 'Tatoeba',
        license: 'CC-BY 2.0 FR',
      },
    ];

    const report = ContentIngestionService.ingestVocabularyPack(incomingPack, initialVocabulary);
    expect(report.duplicatesSkipped).toBe(1);
    expect(report.accepted.length).toBe(1);
    expect(report.accepted[0].word).toBe('el atardecer');
    expect(report.rejected.length).toBe(0);
  });

  it('should reject content with missing or fabricated/unknown attribution metadata', () => {
    const invalidPack = [
      {
        id: 'bad-1',
        word: 'la estrella',
        translation: 'the star',
        phonetic: '[es-ˈtɾe-ʎa]',
        cefrLevel: 'A1',
        source: 'unknown',
        license: 'unknown',
      },
      {
        id: 'bad-2',
        word: 'la nube',
        translation: 'the cloud',
        phonetic: '[ˈnu-βe]',
        cefrLevel: 'A1',
      },
    ];

    const report = ContentIngestionService.ingestVocabularyPack(invalidPack, initialVocabulary);
    expect(report.accepted.length).toBe(0);
    expect(report.rejected.length).toBe(2);
  });

  it('should flag uncertain CEFR classification when simple tag contradicts complex prose', () => {
    const complexWord = [
      {
        id: 'flag-1',
        word: 'la verosimilitud',
        translation: 'plausibility',
        definition: 'Cualidad de parecer verdadero.',
        partOfSpeech: 'sustantivo',
        phonetic: '[be-ɾo-si-mi-li-ˈtuð]',
        exampleSentence:
          'A pesar de las contradicciones estructurales contemporáneas, la perspectiva narrativa alcanza extraordinaria coherencia estilística y profundidad filosófica.',
        cefrLevel: 'A1', // Mislabeled as A1!
        source: 'Wiktionary',
        license: 'CC-BY-SA 4.0',
      },
    ];

    const report = ContentIngestionService.ingestVocabularyPack(complexWord, []);
    expect(report.accepted.length).toBe(1);
    expect(report.flaggedUncertainCEFR.length).toBe(1);
    expect(report.flaggedUncertainCEFR[0].assignedLevel).toBe('A1');
    expect(['B1', 'B2']).toContain(report.flaggedUncertainCEFR[0].proposedLevel);
  });

  it('should audit all reading materials for valid licensing and realistic CEFR classification', () => {
    for (const story of readingLibrary) {
      const audit = ContentIngestionService.auditReadingMaterial(story);
      expect(audit.valid).toBe(true);
    }
  });
});
