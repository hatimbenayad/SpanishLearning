import { sampleExerciseSession } from '../src/data/exercises';
import { LearningService } from '../src/services/LearningService';

describe('Exercise Engine & Session Flow', () => {
  it('should provide multi-format exercise items', () => {
    expect(sampleExerciseSession.length).toBeGreaterThanOrEqual(4);

    const types = sampleExerciseSession.map(s => s.item.type);
    expect(types).toContain('multiple_choice');
    expect(types).toContain('sentence_reorder');
    expect(types).toContain('word_match');
    expect(types).toContain('fill_in_the_blank');
  });

  it('should have valid matching pairs for word match exercise', () => {
    const matchQ = sampleExerciseSession.find(s => s.item.type === 'word_match');
    expect(matchQ).toBeDefined();
    expect(matchQ?.matchingPairs).toBeDefined();
    expect(matchQ?.matchingPairs?.length).toBeGreaterThanOrEqual(3);
  });

  it('should credit completed exercise session to user progress', () => {
    const service = LearningService.getInstance();
    const initialMinutes = service.getProgress().totalLearningMinutes;

    service.completeLesson('test-session-completed');
    const updatedMinutes = service.getProgress().totalLearningMinutes;

    expect(updatedMinutes).toBeGreaterThan(initialMinutes);
  });
});

