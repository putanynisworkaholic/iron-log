-- ============================================================
-- IRON LOG — Supabase Schema (single-user, no auth)
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── EXERCISES ───────────────────────────────────────────────
CREATE TABLE exercises (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('Push', 'Pull', 'Leg', 'Cardio')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;

-- ─── WORKOUT SESSIONS ─────────────────────────────────────────
CREATE TABLE workout_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workout_sessions DISABLE ROW LEVEL SECURITY;

-- ─── WORKOUT SETS ─────────────────────────────────────────────
CREATE TABLE workout_sets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id       UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  session_id        UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
  set_number        INTEGER NOT NULL DEFAULT 1,
  weight_kg         NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps              INTEGER NOT NULL DEFAULT 0,
  target_weight_kg  NUMERIC(6,2),
  target_reps       INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX sets_exercise_idx ON workout_sets(exercise_id);
CREATE INDEX sets_session_idx ON workout_sets(session_id);

ALTER TABLE workout_sets DISABLE ROW LEVEL SECURITY;

-- ─── CARDIO SESSIONS ──────────────────────────────────────────
CREATE TABLE cardio_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date              DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes  INTEGER NOT NULL,
  calories          INTEGER,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cardio_sessions DISABLE ROW LEVEL SECURITY;

-- ─── BODY WEIGHT LOGS ─────────────────────────────────────────
CREATE TABLE body_weight_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg   NUMERIC(5,1) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE body_weight_logs DISABLE ROW LEVEL SECURITY;

-- ─── SEED EXERCISES ───────────────────────────────────────────
INSERT INTO exercises (name, category) VALUES
  -- Push
  ('Incline Bar Bench', 'Push'),
  ('Flat Bar Bench', 'Push'),
  ('Smith Shoulder Press', 'Push'),
  ('Cable Lateral Raise', 'Push'),
  ('Dips', 'Push'),
  ('Pec Fly', 'Push'),
  ('Rope Pushdown', 'Push'),
  ('Tricep Extension', 'Push'),
  -- Pull
  ('Lat Pulldown', 'Pull'),
  ('Close Lat Pulldown', 'Pull'),
  ('Close Lat Pulldown Cable', 'Pull'),
  ('Wide Row Machine', 'Pull'),
  ('Close Row Cable', 'Pull'),
  ('Close Row Machine', 'Pull'),
  ('T Bar Row', 'Pull'),
  ('Barbell Row Machine', 'Pull'),
  ('Rear Deltoid', 'Pull'),
  -- Leg
  ('Leg Curl', 'Leg'),
  ('Leg Extension', 'Leg'),
  ('Leg Press', 'Leg'),
  ('Deadlift', 'Leg'),
  ('Glute', 'Leg'),
  ('Squat', 'Leg');
