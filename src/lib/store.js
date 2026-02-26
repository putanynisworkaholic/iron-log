// localStorage-based data store — no external DB needed

const KEYS = {
  exercises: "ironlog_exercises",
  workoutLogs: "ironlog_workout_logs",
  cardioLogs: "ironlog_cardio_logs",
  bodyWeightLogs: "ironlog_body_weight",
};

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Exercises ────────────────────────────────────────────────
export function getExercises() {
  return read(KEYS.exercises);
}

export function addExercise({ name, category }) {
  const list = read(KEYS.exercises);
  const ex = { id: uid(), name, category, created_at: new Date().toISOString() };
  list.push(ex);
  write(KEYS.exercises, list);
  return ex;
}

export function seedExercisesIfEmpty(seedList) {
  const existing = read(KEYS.exercises);
  if (existing.length > 0) return;
  const seeded = seedList.map(e => ({
    id: uid(),
    name: e.name,
    category: e.category,
    created_at: new Date().toISOString(),
  }));
  write(KEYS.exercises, seeded);
}

// ── Workout Logs ─────────────────────────────────────────────
// Each log: { id, exercise_id, date, sets: [{ weight, reps }] }
export function getWorkoutLogs() {
  return read(KEYS.workoutLogs);
}

export function getExerciseLogs(exerciseId) {
  return read(KEYS.workoutLogs)
    .filter(l => l.exercise_id === exerciseId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function logWorkout({ exercise_id, sets, target_weight, target_reps }) {
  const list = read(KEYS.workoutLogs);
  const entry = {
    id: uid(),
    exercise_id,
    date: new Date().toISOString().split("T")[0],
    sets, // array of { weight, reps }
    target_weight: target_weight || null,
    target_reps: target_reps || null,
    created_at: new Date().toISOString(),
  };
  list.push(entry);
  write(KEYS.workoutLogs, list);
  return entry;
}

export function getWeekExerciseIds(since) {
  return read(KEYS.workoutLogs)
    .filter(l => l.date >= since)
    .map(l => l.exercise_id);
}

// ── Cardio ───────────────────────────────────────────────────
// Each log: { id, date, duration_minutes, calories }
export function getCardioLogs() {
  return read(KEYS.cardioLogs).sort((a, b) => b.date.localeCompare(a.date));
}

export function logCardio({ duration_minutes, calories }) {
  const list = read(KEYS.cardioLogs);
  const entry = {
    id: uid(),
    date: new Date().toISOString().split("T")[0],
    duration_minutes,
    calories: calories || null,
    created_at: new Date().toISOString(),
  };
  list.push(entry);
  write(KEYS.cardioLogs, list);
  return entry;
}

// ── Body Weight ──────────────────────────────────────────────
// Each entry: { id, date, weight_kg }
export function getBodyWeightLogs() {
  return read(KEYS.bodyWeightLogs).sort((a, b) => a.date.localeCompare(b.date));
}

export function logBodyWeight(weight_kg) {
  const list = read(KEYS.bodyWeightLogs);
  const today = new Date().toISOString().split("T")[0];
  // Replace if already logged today
  const idx = list.findIndex(e => e.date === today);
  const entry = { id: uid(), date: today, weight_kg };
  if (idx >= 0) {
    entry.id = list[idx].id;
    list[idx] = entry;
  } else {
    list.push(entry);
  }
  write(KEYS.bodyWeightLogs, list);
  return entry;
}
