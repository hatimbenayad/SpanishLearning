import { UserProgress, VocabularyItem, BackupData, FSRSRating } from '../types';
import { initialUserProgress } from '../data/userProgress';
import { initialVocabulary } from '../data/vocabulary';
import { FSRSEngine } from './FSRSEngine';

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
      if (!data.version || !data.userProgress) {
        return { success: false, message: 'Esquema de respaldo inválido: faltan campos obligatorios.' };
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
