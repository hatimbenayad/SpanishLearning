-- ============================================================================
-- Migration: 202611110002_rls_policies.sql
-- Description: Row Level Security (RLS) policies and auto-profile provisioning
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.cefr_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Public Read-Only Policies for Curriculum & Licensing Metadata
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read access for cefr_levels"
  ON public.cefr_levels FOR SELECT USING (true);

CREATE POLICY "Public read access for content_sources"
  ON public.content_sources FOR SELECT USING (true);

CREATE POLICY "Public read access for lessons"
  ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Public read access for vocabulary_items"
  ON public.vocabulary_items FOR SELECT USING (true);

CREATE POLICY "Public read access for grammar_lessons"
  ON public.grammar_lessons FOR SELECT USING (true);

CREATE POLICY "Public read access for verbs"
  ON public.verbs FOR SELECT USING (true);

CREATE POLICY "Public read access for reading_materials"
  ON public.reading_materials FOR SELECT USING (true);

CREATE POLICY "Public read access for exercises"
  ON public.exercises FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- User-Scoped RLS Policies (auth.uid() strict isolation)
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own vocabulary FSRS cards"
  ON public.user_vocabulary_cards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own review history"
  ON public.review_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own daily activity logs"
  ON public.daily_activity_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own learning sessions"
  ON public.learning_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Automatic Profile & Progress Creation on Sign-Up
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Estudiante')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
