import { UserProgress, VocabularyItem, BackupData, FSRSRating, CEFRLevel } from '../types';
import { initialUserProgress } from '../data/userProgress';
import { initialVocabulary } from '../data/vocabulary';
import { FSRSEngine } from './FSRSEngine';
import { JSONSchemaValidator } from './JSONSchemaValidator';
import { ContentIngestionService, IngestionReport } from './ContentIngestionService';

export class LearningService {
  private static instance: LearningService;

  private userProgress: UserProgress = { ...initialUserProgress };
  private vocabularyList: VocabularyItem[] = [...initialVocabulary];

  private constructor() {}

  public static getInstance(): LearningService {
    if (!LearningService.instance) {
      LearningService.instance = new LearningService();
    }
    return LearningService.instance;
  }

  public getProgress(): UserProgress {
    return { ...this.userProgress };
  }

  public getVocabulary(): VocabularyItem[] {
    return [...this.vocabularyList];
  }

  /**
   * Computes real FSRS due forecast counts for today, tomorrow, and next 7 days
   */
  public getReviewForecast(now: Date = new Date()): { dueToday: number; dueTomorrow: number; dueThisWeek: number } {
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const endOfTomorrow = new Date(endOfToday.getTime() + 24 * 60 * 60 * 1000);
    const endOfWeek = new Date(endOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

    let dueToday = 0;
    let dueTomorrow = 0;
    let dueThisWeek = 0;

    for (const item of this.vocabularyList) {
      if (!item.fsrsCard) {
        // New unreviewed cards are ready to study today
        dueToday += 1;
        dueThisWeek += 1;
        continue;
      }

      const dueTime = new Date(item.fsrsCard.due).getTime();
      if (dueTime <= endOfToday.getTime()) {
        dueToday += 1;
        dueThisWeek += 1;
      } else if (dueTime <= endOfTomorrow.getTime()) {
        dueTomorrow += 1;
        dueThisWeek += 1;
      } else if (dueTime <= endOfWeek.getTime()) {
        dueThisWeek += 1;
      }
    }

    return { dueToday, dueTomorrow, dueThisWeek };
  }

  public toggleFavoriteWord(id: string): boolean {
    const word = this.vocabularyList.find(w => w.id === id);
    if (!word) return false;
    word.isFavorite = !word.isFavorite;

    if (word.isFavorite) {
      if (!this.userProgress.savedWordIds.includes(id)) {
        this.userProgress.savedWordIds.push(id);
      }
    } else {
      this.userProgress.savedWordIds = this.userProgress.savedWordIds.filter(wId => wId !== id);
    }
    return word.isFavorite;
  }

  public rateVocabularyWord(id: string, rating: FSRSRating): void {
    const word = this.vocabularyList.find(w => w.id === id);
    if (!word) return;

    const currentCard = word.fsrsCard || FSRSEngine.createNewCard(id);
    const { updatedCard } = FSRSEngine.scheduleNextReview(currentCard, rating);
    word.fsrsCard = updatedCard;

    // Increment user learning minutes subtly (e.g. 1 min per review)
    this.userProgress.totalLearningMinutes += 1;
  }

  public completeLesson(lessonId: string): void {
    if (!this.userProgress.completedLessonIds.includes(lessonId)) {
      this.userProgress.completedLessonIds.push(lessonId);
      this.userProgress.totalLearningMinutes += 15;

      // Update active day metric in chart
      const todayMetric = this.userProgress.weeklyActivity.find(a => a.isCurrentDay);
      if (todayMetric) {
        todayMetric.minutes += 15;
        todayMetric.lessons += 1;
      }
    }
  }

  /**
   * Saves an unfamiliar word encountered in Reading mode directly into the user's vocabulary deck
   */
  public saveWordFromReader(
    word: string,
    translation: string,
    phonetic: string = '[—]',
    cefrLevel: CEFRLevel = 'A1',
    source: string = 'Lecturas Editorial'
  ): VocabularyItem {
    const normalized = word.trim().toLowerCase();
    const existing = this.vocabularyList.find(
      w => w.word.toLowerCase() === normalized || w.word.toLowerCase().endsWith(` ${normalized}`)
    );

    if (existing) {
      if (!existing.isFavorite) {
        this.toggleFavoriteWord(existing.id);
      }
      return existing;
    }

    const newId = `reader-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: VocabularyItem = {
      id: newId,
      word: word.trim(),
      translation: translation.trim(),
      definition: `Palabra guardada desde lectura: "${translation.trim()}".`,
      partOfSpeech: 'sustantivo',
      phonetic,
      exampleSentence: '',
      exampleTranslation: '',
      cefrLevel,
      topic: 'Lecturas Guardadas',
      source,
      license: 'CC-BY-SA 4.0',
      isFavorite: true,
      fsrsCard: FSRSEngine.createNewCard(newId),
    };

    this.vocabularyList.unshift(newItem);
    if (!this.userProgress.savedWordIds.includes(newId)) {
      this.userProgress.savedWordIds.push(newId);
    }
    this.userProgress.vocabularyCount += 1;
    return newItem;
  }

  /**
   * Imports and validates an external vocabulary pack through the ContentIngestionService pipeline
   */
  public importVocabularyPack(rawItems: any[]): IngestionReport<VocabularyItem> {
    const report = ContentIngestionService.ingestVocabularyPack(rawItems, this.vocabularyList);
    if (report.accepted.length > 0) {
      this.vocabularyList.push(...report.accepted);
      this.userProgress.vocabularyCount += report.accepted.length;
    }
    return report;
  }

  /**
   * Export all user progress and vocabulary into a portable versioned JSON backup
   */
  public exportBackupJSON(): string {
    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userProgress: this.userProgress,
      customVocabulary: this.vocabularyList.filter(v => v.isFavorite || v.fsrsCard),
      favoriteWordIds: this.userProgress.savedWordIds,
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Import and validate a user JSON backup
   */
  public importBackupJSON(jsonStr: string): { success: boolean; message: string } {
    try {
      const data: BackupData = JSON.parse(jsonStr);
      const validation = JSONSchemaValidator.validateBackupData(data);
      if (!validation.valid) {
        return {
          success: false,
          message: `Esquema de respaldo inválido: ${validation.errors.join(' ')}`,
        };
      }

      this.userProgress = { ...data.userProgress };
      if (Array.isArray(data.customVocabulary)) {
        data.customVocabulary.forEach(item => {
          const idx = this.vocabularyList.findIndex(v => v.id === item.id);
          if (idx >= 0) {
            this.vocabularyList[idx] = item;
          } else {
            this.vocabularyList.push(item);
          }
        });
      }

      return { success: true, message: 'Copia de seguridad restaurada con éxito.' };
    } catch (err: any) {
      return { success: false, message: `Error al procesar el archivo JSON: ${err.message}` };
    }
  }
}

