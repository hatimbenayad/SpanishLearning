import { BackupData, VocabularyItem, GrammarLesson, ReadingMaterial } from '../types';

/**
 * Formal JSON Schema Validation Service
 * Implements Section 14 of PRD: JSON Import and Export with Schema Validation
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class JSONSchemaValidator {
  /**
   * Validates user progress backup package
   */
  public static validateBackupData(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['El archivo no contiene un objeto JSON válido.'] };
    }

    if (!data.version || typeof data.version !== 'string') {
      errors.push('Falta el campo de versión requerido ("version").');
    }

    if (!data.exportedAt || isNaN(Date.parse(data.exportedAt))) {
      errors.push('Falta una fecha válida de exportación ("exportedAt").');
    }

    if (!data.userProgress || typeof data.userProgress !== 'object') {
      errors.push('Faltan los datos de progreso del usuario ("userProgress").');
    } else {
      const p = data.userProgress;
      if (!p.userId || typeof p.userId !== 'string') errors.push('userProgress.userId es obligatorio.');
      if (!p.cefrLevel || !['A1', 'A2', 'B1', 'B2'].includes(p.cefrLevel)) {
        errors.push('userProgress.cefrLevel debe ser A1, A2, B1 o B2.');
      }
      if (typeof p.totalLearningMinutes !== 'number') {
        errors.push('userProgress.totalLearningMinutes debe ser numérico.');
      }
      if (!Array.isArray(p.weeklyActivity)) {
        errors.push('userProgress.weeklyActivity debe ser un arreglo de métricas diarias.');
      }
      if (!p.skillProficiency || typeof p.skillProficiency !== 'object') {
        errors.push('userProgress.skillProficiency debe contener los niveles de habilidades.');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an imported external vocabulary pack
   */
  public static validateVocabularyPack(data: any): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      return { valid: false, errors: ['El paquete de vocabulario debe ser una lista de términos.'] };
    }

    data.forEach((item, index) => {
      const prefix = `Palabra [${index}]`;
      if (!item.id) errors.push(`${prefix}: falta el ID.`);
      if (!item.word) errors.push(`${prefix}: falta la palabra en español.`);
      if (!item.translation) errors.push(`${prefix}: falta la traducción al inglés.`);
      if (!item.cefrLevel || !['A1', 'A2', 'B1', 'B2'].includes(item.cefrLevel)) {
        errors.push(`${prefix}: nivel CEFR inválido.`);
      }
      if (!item.phonetic) errors.push(`${prefix}: falta la pronunciación fonética.`);
      if (!item.source || !item.license) {
        errors.push(`${prefix}: falta la atribución de fuente o licencia (PRD Sección 12).`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

