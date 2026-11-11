import { UserProgress } from '../types';
import { initialVocabulary } from './vocabulary';

export const initialUserProgress: UserProgress = {
  userId: 'usr-daizy-01',
  name: 'Daizy Shah',
  avatarUrl: undefined,
  cefrLevel: 'A1',
  dailyGoalMinutes: 30,
  currentStreak: 12,
  bestStreak: 15,
  totalLearningMinutes: 215, // sum of weeklyActivity (25+35+40+50+30+15+20 = 215m -> 3h 35m)
  vocabularyCount: initialVocabulary.length,
  completedLessonIds: ['gram-1', 'read-1'],
  savedWordIds: ['vocab-1', 'vocab-3', 'vocab-5'],
  weeklyActivity: [
    { day: 'Lun', fullDate: 'Lunes 3', minutes: 25, lessons: 2 },
    { day: 'Mar', fullDate: 'Martes 4', minutes: 35, lessons: 3 },
    { day: 'Mié', fullDate: 'Miércoles 5', minutes: 40, lessons: 4 },
    { day: 'Jue', fullDate: 'Jueves 6', minutes: 50, lessons: 4, isCurrentDay: true },
    { day: 'Vie', fullDate: 'Viernes 7', minutes: 30, lessons: 2 },
    { day: 'Sáb', fullDate: 'Sábado 8', minutes: 15, lessons: 1 },
    { day: 'Dom', fullDate: 'Domingo 9', minutes: 20, lessons: 2 },
  ],
  skillProficiency: {
    reading: 78,
    listening: 64,
    writing: 52,
    speaking: 45,
  },
};

