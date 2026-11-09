import { FSRSCard, FSRSRating } from '../types';

/**
 * Deterministic Spaced Repetition Scheduling Engine (FSRS-inspired)
 * Ratings:
 * 1 = Again (forgotten / reset)
 * 2 = Hard (recalled with high effort)
 * 3 = Good (recalled normally)
 * 4 = Easy (recalled effortlessly)
 */

export class FSRSEngine {
  /**
   * Creates a fresh FSRS card record for a new vocabulary word
   */
  public static createNewCard(cardId: string): FSRSCard {
    return {
      cardId,
      reps: 0,
      lapses: 0,
      stability: 1.0,
      difficulty: 5.0,
      due: new Date().toISOString(),
      state: 'new',
    };
  }

  /**
   * Calculates the updated card parameters based on user recall rating
   */
  public static scheduleNextReview(
    card: FSRSCard,
    rating: FSRSRating,
    now: Date = new Date()
  ): { updatedCard: FSRSCard; intervalDays: number } {
    let reps = card.reps;
    let lapses = card.lapses;
    let stability = card.stability;
    let difficulty = card.difficulty;
    let state = card.state;
    let intervalDays = 1;

    switch (rating) {
      case 1: // Again
        lapses += 1;
        reps = 0;
        stability = Math.max(0.5, stability * 0.5);
        difficulty = Math.min(10.0, difficulty + 1.0);
        state = 'relearning';
        intervalDays = 0.007; // ~10 minutes
        break;

      case 2: // Hard
        reps += 1;
        stability = stability * 1.2;
        difficulty = Math.min(10.0, difficulty + 0.3);
        state = 'review';
        intervalDays = Math.max(1, Math.round(stability * 0.9));
        break;

      case 3: // Good
        reps += 1;
        stability = Math.max(1.5, stability * 2.2);
        difficulty = Math.max(1.0, difficulty - 0.2);
        state = 'review';
        intervalDays = Math.max(2, Math.round(stability));
        break;

      case 4: // Easy
        reps += 1;
        stability = Math.max(2.5, stability * 3.5);
        difficulty = Math.max(1.0, difficulty - 0.5);
        state = 'review';
        intervalDays = Math.max(4, Math.round(stability * 1.5));
        break;
    }

    const nextDueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    const updatedCard: FSRSCard = {
      cardId: card.cardId,
      reps,
      lapses,
      stability: Number(stability.toFixed(2)),
      difficulty: Number(difficulty.toFixed(2)),
      due: nextDueDate.toISOString(),
      lastReview: now.toISOString(),
      state,
    };

    return {
      updatedCard,
      intervalDays,
    };
  }

  /**
   * Checks if a card is currently due for review
   */
  public static isDue(card: FSRSCard, now: Date = new Date()): boolean {
    return new Date(card.due).getTime() <= now.getTime();
  }
}
