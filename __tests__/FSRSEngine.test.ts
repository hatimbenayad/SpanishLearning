import { FSRSEngine } from '../src/services/FSRSEngine';

describe('FSRSEngine', () => {
  it('should initialize a fresh FSRS card record', () => {
    const card = FSRSEngine.createNewCard('test-card-1');
    expect(card.cardId).toBe('test-card-1');
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.state).toBe('new');
    expect(card.stability).toBe(1.0);
  });

  it('should schedule next review on Good rating (rating = 3)', () => {
    const card = FSRSEngine.createNewCard('test-card-1');
    const now = new Date('2026-01-01T12:00:00Z');
    const { updatedCard, intervalDays } = FSRSEngine.scheduleNextReview(card, 3, now);

    expect(updatedCard.reps).toBe(1);
    expect(updatedCard.state).toBe('review');
    expect(intervalDays).toBeGreaterThanOrEqual(2);
    expect(new Date(updatedCard.due).getTime()).toBeGreaterThan(now.getTime());
  });

  it('should increase lapse and reset reps on Again rating (rating = 1)', () => {
    const card = FSRSEngine.createNewCard('test-card-1');
    card.reps = 4;
    const now = new Date('2026-01-01T12:00:00Z');
    const { updatedCard, intervalDays } = FSRSEngine.scheduleNextReview(card, 1, now);

    expect(updatedCard.lapses).toBe(1);
    expect(updatedCard.reps).toBe(0);
    expect(updatedCard.state).toBe('relearning');
    expect(intervalDays).toBeLessThan(1); // sub-day interval
  });

  it('should award larger interval on Easy rating (rating = 4)', () => {
    const card = FSRSEngine.createNewCard('test-card-1');
    const now = new Date('2026-01-01T12:00:00Z');
    const goodResult = FSRSEngine.scheduleNextReview(card, 3, now);
    const easyResult = FSRSEngine.scheduleNextReview(card, 4, now);

    expect(easyResult.intervalDays).toBeGreaterThan(goodResult.intervalDays);
    expect(easyResult.updatedCard.stability).toBeGreaterThan(goodResult.updatedCard.stability);
  });

  it('should correctly identify when a card is due', () => {
    const card = FSRSEngine.createNewCard('test-card-1');
    const now = new Date('2026-01-02T12:00:00Z');
    card.due = new Date('2026-01-01T12:00:00Z').toISOString();

    expect(FSRSEngine.isDue(card, now)).toBe(true);

    card.due = new Date('2026-01-05T12:00:00Z').toISOString();
    expect(FSRSEngine.isDue(card, now)).toBe(false);
  });
});

