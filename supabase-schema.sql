-- ═══════════════════════════════════════════════
-- SELENE ACADEMIA — Supabase Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- ── User Profiles ──
-- Extends Supabase Auth with academy-specific data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  surname TEXT,
  document_type TEXT CHECK (document_type IN ('dni', 'nie', 'pasaporte')),
  document_number TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_city TEXT,
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  interests TEXT[] DEFAULT '{}',
  experience_level TEXT DEFAULT 'none',
  xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Enrollments ──
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  progress REAL DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  stripe_session_id TEXT,
  amount_paid INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- ── Lesson Progress ──
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- ── Quiz Attempts ──
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  score REAL NOT NULL CHECK (score >= 0 AND score <= 1),
  answers JSONB,
  passed BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Certificates ──
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  certificate_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ── Payments ──
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  stripe_session_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);

-- ── Row Level Security ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON enrollments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quizzes" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quizzes" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
-- Certificates inserted by server only (service role)

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
-- Payments inserted by webhook only (service role)

-- ── Auto-create profile on signup ──
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Updated_at trigger ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
