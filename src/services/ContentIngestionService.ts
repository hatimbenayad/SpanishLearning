import { VocabularyItem, CEFRLevel, ReadingMaterial } from '../types';
import { JSONSchemaValidator } from './JSONSchemaValidator';

/**
 * Open-Source Content Ingestion Pipeline
 * Implements PRD Section 12:
 * 1. Import content
 * 2. Validate structure
 * 3. Check required licensing metadata
 * 4. Assign or propose CEFR levels
 * 5. Flag uncertain difficulty classifications
 * 6. Remove duplicates
 * 7. Store content in appropriate format
 */

export interface IngestionReport<T> {
  accepted: T[];
  rejected: Array<{ item: any; reasons: string[] }>;
  duplicatesSkipped: number;
  flaggedUncertainCEFR: Array<{ id: string; assignedLevel: CEFRLevel; proposedLevel: CEFRLevel; reason: string }>;
}

export class ContentIngestionService {
  /**
   * Proposes an approximate CEFR level from text complexity (average word length & sentence length)
   */
  public static proposeReadingCEFR(text: string): { level: CEFRLevel; uncertain: boolean; reason: string } {
    const cleanText = text.trim();
    if (!cleanText) {
      return { level: 'A1', uncertain: true, reason: 'Texto vacío o insuficiente.' };
    }

    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);

    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : words.length;
    const avgWordLength = words.reduce((acc, w) => acc + w.replace(/[^a-záéíóúüñ]/gi, '').length, 0) / Math.max(1, words.length);

    // Heuristic complexity scoring
    const score = avgSentenceLength * 0.7 + avgWordLength * 2.2;

    if (score < 16) {
      return { level: 'A1', uncertain: words.length < 30, reason: words.length < 30 ? 'Muestra corta (<30 palabras).' : 'Oraciones simples y léxico básico.' };
    } else if (score < 22) {
      return { level: 'A2', uncertain: false, reason: 'Complejidad elemental moderada.' };
    } else if (score < 29) {
      return { level: 'B1', uncertain: false, reason: 'Oraciones compuestas e índice léxico intermedio.' };
    } else {
      return { level: 'B2', uncertain: false, reason: 'Sintaxis compleja y vocabulario avanzado.' };
    }
  }

  /**
   * Runs the full 7-step ingestion pipeline for open-source vocabulary packs (e.g. Wiktionary / Tatoeba)
   */
  public static ingestVocabularyPack(
    rawItems: any[],
    existingItems: VocabularyItem[]
  ): IngestionReport<VocabularyItem> {
    const accepted: VocabularyItem[] = [];
    const rejected: Array<{ item: any; reasons: string[] }> = [];
    const flaggedUncertainCEFR: IngestionReport<VocabularyItem>['flaggedUncertainCEFR'] = [];
    let duplicatesSkipped = 0;

    if (!Array.isArray(rawItems)) {
      return {
        accepted: [],
        rejected: [{ item: rawItems, reasons: ['La entrada debe ser un arreglo JSON de vocabulario.'] }],
        duplicatesSkipped: 0,
        flaggedUncertainCEFR: [],
      };
    }

    const existingWordsSet = new Set(existingItems.map(i => i.word.trim().toLowerCase()));
    const existingIdsSet = new Set(existingItems.map(i => i.id));

    for (const raw of rawItems) {
      // Step 2 & 3: Structure + Licensing Metadata Validation
      const validation = JSONSchemaValidator.validateVocabularyPack([raw]);
      if (!validation.valid) {
        rejected.push({ item: raw, reasons: validation.errors });
        continue;
      }

      // Enforce non-empty license/source (never fabricate attribution)
      if (
        !raw.source ||
        String(raw.source).trim().toLowerCase() === 'unknown' ||
        !raw.license ||
        String(raw.license).trim().toLowerCase() === 'unknown'
      ) {
        rejected.push({
          item: raw,
          reasons: ['Fuente o licencia desconocida; no se permite atribución fabricada (PRD §12).'],
        });
        continue;
      }

      // Step 6: Deduplicate by ID or normalized Spanish word
      const normalizedWord = String(raw.word).trim().toLowerCase();
      if (existingIdsSet.has(raw.id) || existingWordsSet.has(normalizedWord)) {
        duplicatesSkipped += 1;
        continue;
      }

      // Step 4 & 5: Check / propose CEFR level and flag discrepancies
      const sentenceToEvaluate = raw.exampleSentence || raw.definition || raw.word;
      const complexity = this.proposeReadingCEFR(sentenceToEvaluate);
      const assignedLevel: CEFRLevel = raw.cefrLevel;

      if (complexity.uncertain || (assignedLevel === 'A1' && (complexity.level === 'B1' || complexity.level === 'B2'))) {
        flaggedUncertainCEFR.push({
          id: raw.id,
          assignedLevel,
          proposedLevel: complexity.level,
          reason: `Clasificación CEFR incierta: asignado ${assignedLevel}, heurística sugiere ${complexity.level} (${complexity.reason})`,
        });
      }

      // Step 7: Store normalized item
      const cleanItem: VocabularyItem = {
        id: String(raw.id),
        word: String(raw.word).trim(),
        translation: String(raw.translation).trim(),
        definition: String(raw.definition || raw.translation).trim(),
        partOfSpeech: raw.partOfSpeech || 'sustantivo',
        gender: raw.gender,
        plural: raw.plural,
        phonetic: String(raw.phonetic).trim(),
        exampleSentence: String(raw.exampleSentence || '').trim(),
        exampleTranslation: String(raw.exampleTranslation || '').trim(),
        cefrLevel: assignedLevel,
        topic: String(raw.topic || 'General').trim(),
        source: String(raw.source).trim(),
        license: String(raw.license).trim(),
        isFavorite: false,
      };

      existingWordsSet.add(normalizedWord);
      existingIdsSet.add(cleanItem.id);
      accepted.push(cleanItem);
    }

    return {
      accepted,
      rejected,
      duplicatesSkipped,
      flaggedUncertainCEFR,
    };
  }

  /**
   * Validates that a reading text checks full licensing metadata and isn't misclassified
   * solely by its first paragraph (PRD §12: "Do not classify an entire book as A1 merely because its first chapter is easy").
   */
  public static auditReadingMaterial(material: ReadingMaterial): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    if (!material.source || !material.license) {
      issues.push('Falta información de fuente o licencia.');
    }
    const proposal = this.proposeReadingCEFR(material.fullText);
    const levelsOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
    const assignedIdx = levelsOrder.indexOf(material.cefrLevel);
    const proposedIdx = levelsOrder.indexOf(proposal.level);

    if (proposedIdx - assignedIdx >= 2) {
      issues.push(`Texto completo sugiere nivel ${proposal.level}, muy superior al ${material.cefrLevel} asignado.`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}
