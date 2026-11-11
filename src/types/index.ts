export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type LearningCategory =
  | 'reading'
  | 'listening'
  | 'vocabulary'
  | 'grammar'
  | 'verbs'
  | 'exercises'
  | 'writing'
  | 'speaking';

export type PartOfSpeech =
  | 'sustantivo'
  | 'verbo'
  | 'adjetivo'
  | 'adverbio'
  | 'pronombre'
  | 'preposición'
  | 'conjunción'
  | 'interjección';

export type FSRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface FSRSCard {
  cardId: string;
  reps: number;
  lapses: number;
  stability: number;
  difficulty: number;
  due: string; // ISO date
  lastReview?: string;
  state: 'new' | 'learning' | 'review' | 'relearning';
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  definition: string;
  partOfSpeech: PartOfSpeech;
  gender?: 'm' | 'f' | 'mf';
  plural?: string;
  phonetic: string;
  exampleSentence: string;
  exampleTranslation: string;
  cefrLevel: CEFRLevel;
  topic: string;
  source: string;
  license: string;
  isFavorite?: boolean;
  fsrsCard?: FSRSCard;
}

export interface GrammarRuleCard {
  id: string;
  title: string;
  explanation: string;
  examples: Array<{
    spanish: string;
    english: string;
    highlight?: string;
  }>;
}

export interface GrammarLesson {
  id: string;
  title: string;
  subtitle: string;
  cefrLevel: CEFRLevel;
  order: number;
  summary: string;
  ruleCards: GrammarRuleCard[];
  comparisonCards?: Array<{
    title: string;
    leftConcept: { label: string; rules: string[] };
    rightConcept: { label: string; rules: string[] };
  }>;
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanation: string;
  }>;
  practiceQuestions: ExerciseItem[];
}

export interface ConjugationForms {
  yo: string;
  tu: string;
  elEllaUsted: string;
  nosotros: string;
  vosotros: string;
  ellosEllasUstedes: string;
}

export interface VerbItem {
  infinitive: string;
  translation: string;
  isRegular: boolean;
  group: '-ar' | '-er' | '-ir';
  tenses: {
    presente: ConjugationForms;
    preteritoPerfecto: ConjugationForms;
    imperfecto: ConjugationForms;
    futuro: ConjugationForms;
    condicional: ConjugationForms;
    subjuntivo: ConjugationForms;
  };
  examples: Array<{ spanish: string; english: string }>;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  author: string;
  cefrLevel: CEFRLevel;
  durationMinutes: number;
  wordCount: number;
  excerpt: string;
  fullText: string;
  translationGlossary: Record<string, { translation: string; phonetic: string; notes?: string }>;
  comprehensionQuestions: ExerciseItem[];
  source: string;
  license: string;
}

export interface TranscriptSentence {
  id: string;
  startTime: number;
  endTime: number;
  spanish: string;
  english: string;
}

export interface ListeningMaterial {
  id: string;
  title: string;
  speaker: string;
  cefrLevel: CEFRLevel;
  durationSeconds: number;
  audioUrl?: string;
  transcript: TranscriptSentence[];
  comprehensionQuestions: ExerciseItem[];
  source: string;
  license: string;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_in_the_blank'
  | 'sentence_reorder'
  | 'word_match'
  | 'translation';

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  instruction: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: CEFRLevel;
}

export interface DailyActivityMetric {
  day: string; // e.g. 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
  fullDate: string;
  minutes: number;
  lessons: number;
  isCurrentDay?: boolean;
}

export interface SkillProficiency {
  reading: number; // 0 - 100%
  listening: number;
  writing: number;
  speaking: number;
}

export interface UserProgress {
  userId: string;
  name: string;
  avatarUrl?: string;
  cefrLevel: CEFRLevel;
  dailyGoalMinutes: number;
  currentStreak: number;
  bestStreak: number;
  totalLearningMinutes: number;
  vocabularyCount: number;
  completedLessonIds: string[];
  savedWordIds: string[];
  weeklyActivity: DailyActivityMetric[];
  skillProficiency: SkillProficiency;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface WritingDraft {
  id: string;
  promptId: string;
  title: string;
  cefrLevel: CEFRLevel;
  text: string;
  wordCount: number;
  updatedAt: string;
}

export interface AppSettings {
  hasCompletedOnboarding: boolean;
  supabaseConfig?: SupabaseConfig;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  userProgress: UserProgress;
  customVocabulary: VocabularyItem[];
  favoriteWordIds: string[];
  writingDrafts?: WritingDraft[];
}

