-- ============================================================================
-- Migration: 202611110001_initial_schema.sql
-- Description: Normalized PostgreSQL schema for SpanishLearn (PRD Section 13)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. CEFR Levels lookup
CREATE TABLE IF NOT EXISTS public.cefr_levels (
  code VARCHAR(2) PRIMARY KEY CHECK (code IN ('A1', 'A2', 'B1', 'B2')),
  name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

INSERT INTO public.cefr_levels (code, name, description, sort_order) VALUES
  ('A1', 'Principiante', 'Beginner survival Spanish and everyday expressions.', 1),
  ('A2', 'Elemental', 'Elementary routines, past narration, and travel.', 2),
  ('B1', 'Intermedio', 'Intermediate opinions, culture, and initial subjunctive.', 3),
  ('B2', 'Intermedio Alto', 'Upper-intermediate literary nuance and complex discourse.', 4)
ON CONFLICT (code) DO NOTHING;

-- 2. Open-Source Content Sources & License Provenance (PRD §12)
CREATE TABLE IF NOT EXISTS public.content_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL UNIQUE,
  author_or_contributor VARCHAR(160),
  license VARCHAR(80) NOT NULL,
  attribution_text TEXT NOT NULL,
  download_url TEXT,
  content_version VARCHAR(40) NOT NULL DEFAULT '1.0.0',
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. User Profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100) NOT NULL DEFAULT 'Estudiante',
  avatar_url TEXT,
  cefr_level VARCHAR(2) NOT NULL DEFAULT 'A1' REFERENCES public.cefr_levels(code),
  daily_goal_minutes INTEGER NOT NULL DEFAULT 20 CHECK (daily_goal_minutes BETWEEN 5 AND 240),
  preferred_variety VARCHAR(40) NOT NULL DEFAULT 'es-ES',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Curriculum Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cefr_level VARCHAR(2) NOT NULL REFERENCES public.cefr_levels(code),
  category VARCHAR(40) NOT NULL CHECK (category IN ('reading', 'vocabulary', 'grammar', 'verbs', 'exercises', 'writing')),
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  sort_order INTEGER NOT NULL DEFAULT 1,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_id UUID REFERENCES public.content_sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_cefr_category ON public.lessons(cefr_level, category);

-- 5. Vocabulary Items (PRD §5)
CREATE TABLE IF NOT EXISTS public.vocabulary_items (
  id VARCHAR(64) PRIMARY KEY,
  word VARCHAR(120) NOT NULL,
  translation VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  part_of_speech VARCHAR(40) NOT NULL,
  gender VARCHAR(4),
  plural VARCHAR(120),
  phonetic VARCHAR(120) NOT NULL,
  example_sentence TEXT NOT NULL DEFAULT '',
  example_translation TEXT NOT NULL DEFAULT '',
  cefr_level VARCHAR(2) NOT NULL REFERENCES public.cefr_levels(code),
  topic VARCHAR(100) NOT NULL,
  source VARCHAR(120) NOT NULL,
  license VARCHAR(80) NOT NULL,
  source_id UUID REFERENCES public.content_sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocab_cefr ON public.vocabulary_items(cefr_level);
CREATE INDEX IF NOT EXISTS idx_vocab_word ON public.vocabulary_items(LOWER(word));

-- 6. Grammar Lessons (PRD §6)
CREATE TABLE IF NOT EXISTS public.grammar_lessons (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT NOT NULL,
  cefr_level VARCHAR(2) NOT NULL REFERENCES public.cefr_levels(code),
  sort_order INTEGER NOT NULL,
  summary TEXT NOT NULL,
  rule_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  comparison_cards JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grammar_cefr ON public.grammar_lessons(cefr_level, sort_order);

-- 7. Verb Conjugation Database (PRD §7)
CREATE TABLE IF NOT EXISTS public.verbs (
  infinitive VARCHAR(64) PRIMARY KEY,
  translation VARCHAR(160) NOT NULL,
  is_regular BOOLEAN NOT NULL,
  verb_group VARCHAR(4) NOT NULL CHECK (verb_group IN ('-ar', '-er', '-ir')),
  tenses JSONB NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 8. Reading Materials (PRD §8)
CREATE TABLE IF NOT EXISTS public.reading_materials (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(160) NOT NULL,
  cefr_level VARCHAR(2) NOT NULL REFERENCES public.cefr_levels(code),
  duration_minutes INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  excerpt TEXT NOT NULL,
  full_text TEXT NOT NULL,
  translation_glossary JSONB NOT NULL DEFAULT '{}'::jsonb,
  source VARCHAR(120) NOT NULL,
  license VARCHAR(80) NOT NULL,
  source_id UUID REFERENCES public.content_sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_cefr ON public.reading_materials(cefr_level);

-- 9. Reusable Exercises (PRD §10)
CREATE TABLE IF NOT EXISTS public.exercises (
  id VARCHAR(64) PRIMARY KEY,
  lesson_id VARCHAR(64) REFERENCES public.lessons(id) ON DELETE SET NULL,
  exercise_type VARCHAR(40) NOT NULL,
  instruction TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB NOT NULL,
  explanation TEXT NOT NULL,
  difficulty VARCHAR(2) NOT NULL REFERENCES public.cefr_levels(code)
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON public.exercises(lesson_id);

-- 10. User Progress Summary (Monotonic & Timestamped for Conflict Resolution)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  cefr_level VARCHAR(2) NOT NULL DEFAULT 'A1' REFERENCES public.cefr_levels(code),
  daily_goal_minutes INTEGER NOT NULL DEFAULT 20,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  total_learning_minutes INTEGER NOT NULL DEFAULT 0,
  vocabulary_count INTEGER NOT NULL DEFAULT 0,
  completed_lesson_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  saved_word_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  skill_proficiency JSONB NOT NULL DEFAULT '{"reading":0,"listening":0,"writing":0,"speaking":0}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 11. User FSRS Review Cards
CREATE TABLE IF NOT EXISTS public.user_vocabulary_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  word_id VARCHAR(64) NOT NULL,
  word_payload JSONB,
  state VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (state IN ('new', 'learning', 'review', 'relearning')),
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  stability REAL NOT NULL DEFAULT 1.0,
  difficulty REAL NOT NULL DEFAULT 5.0,
  due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_review TIMESTAMPTZ,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_user_cards_due ON public.user_vocabulary_cards(user_id, due);

CREATE TRIGGER trg_user_cards_updated_at
  BEFORE UPDATE ON public.user_vocabulary_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 12. Review History Log
CREATE TABLE IF NOT EXISTS public.review_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  word_id VARCHAR(64) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 4),
  stability_before REAL,
  stability_after REAL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_history_user ON public.review_history(user_id, reviewed_at DESC);

-- 13. Daily Activity Logs
CREATE TABLE IF NOT EXISTS public.daily_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 0 CHECK (minutes >= 0),
  lessons_completed INTEGER NOT NULL DEFAULT 0 CHECK (lessons_completed >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

CREATE TRIGGER trg_daily_activity_updated_at
  BEFORE UPDATE ON public.daily_activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 14. Learning Sessions
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  category VARCHAR(40) NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  score_percent INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
