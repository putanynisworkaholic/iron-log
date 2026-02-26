import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { SEED_EXERCISES } from "../lib/seedData";
import { getStartOfWeek } from "../lib/utils";

// ── Exercises ────────────────────────────────────────────────
export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchExercises(); }, []);

  async function fetchExercises() {
    setLoading(true);
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .order("category")
      .order("name");
    if (!error) setExercises(data || []);
    setLoading(false);
  }

  async function addExercise(exercise) {
    const { data, error } = await supabase
      .from("exercises")
      .insert(exercise)
      .select()
      .single();
    if (!error) setExercises(prev => [...prev, data]);
    return { data, error };
  }

  return { exercises, loading, refetch: fetchExercises, addExercise };
}

// ── Exercise History ─────────────────────────────────────────
// Returns logs grouped per session date: { id, date, sets: [{weight, reps}] }
export function useExerciseHistory(exerciseId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!exerciseId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("workout_sets")
      .select("*, workout_sessions(date)")
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      // Group by session date into { id, date, sets: [{weight, reps}] }
      const grouped = {};
      data.forEach(s => {
        const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
        if (!grouped[date]) grouped[date] = { id: s.id, date, sets: [] };
        grouped[date].sets.push({ weight: s.weight_kg, reps: s.reps });
      });
      setHistory(
        Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date))
      );
    }
    setLoading(false);
  }, [exerciseId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const logSets = useCallback(async (sets, targetWeight, targetReps) => {
    const validSets = sets
      .filter(s => s.weight && s.reps)
      .map(s => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps) }));
    if (!validSets.length) return { error: "No valid sets" };

    const today = new Date().toISOString().split("T")[0];

    // Get or create today's session
    let sessionId;
    const { data: existing } = await supabase
      .from("workout_sessions")
      .select("id")
      .eq("date", today)
      .single();

    if (existing) {
      sessionId = existing.id;
    } else {
      const { data: newSession, error } = await supabase
        .from("workout_sessions")
        .insert({ date: today })
        .select()
        .single();
      if (error) return { error };
      sessionId = newSession.id;
    }

    const setsToInsert = validSets.map((s, i) => ({
      exercise_id: exerciseId,
      session_id: sessionId,
      set_number: i + 1,
      weight_kg: s.weight,
      reps: s.reps,
      target_weight_kg: targetWeight ? parseFloat(targetWeight) : null,
      target_reps: targetReps ? parseInt(targetReps) : null,
    }));

    const { error } = await supabase.from("workout_sets").insert(setsToInsert);
    if (!error) fetchHistory();
    return { error };
  }, [exerciseId, fetchHistory]);

  return { history, loading, logSets, refetch: fetchHistory };
}

// ── Week Sets (done indicators) ──────────────────────────────
export function useWeekSets() {
  const [doneIds, setDoneIds] = useState(new Set());

  useEffect(() => {
    (async () => {
      const startOfWeek = getStartOfWeek().toISOString().split("T")[0];
      const { data } = await supabase
        .from("workout_sets")
        .select("exercise_id")
        .gte("created_at", startOfWeek);
      if (data) {
        setDoneIds(new Set(data.map(s => s.exercise_id)));
      }
    })();
  }, []);

  return doneIds;
}

// ── Progress Data ────────────────────────────────────────────
export function useProgressData() {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [cardioLogs, setCardioLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Fetch workout sets with exercise and session info
      const { data: sets } = await supabase
        .from("workout_sets")
        .select("*, exercises(name, category), workout_sessions(date)")
        .order("created_at", { ascending: false });

      // Group into per-exercise-per-date logs
      if (sets) {
        const grouped = {};
        sets.forEach(s => {
          const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
          const key = `${s.exercise_id}_${date}`;
          if (!grouped[key]) {
            grouped[key] = {
              id: key,
              exercise_id: s.exercise_id,
              exercise_name: s.exercises?.name,
              category: s.exercises?.category,
              date,
              sets: [],
            };
          }
          grouped[key].sets.push({ weight: s.weight_kg, reps: s.reps });
        });
        setWorkoutLogs(Object.values(grouped));
      }

      // Fetch cardio
      const { data: cardio } = await supabase
        .from("cardio_sessions")
        .select("*")
        .order("date", { ascending: false })
        .limit(50);
      setCardioLogs(cardio || []);

      setLoading(false);
    })();
  }, []);

  return { workoutLogs, cardioLogs, loading };
}

// ── Cardio ───────────────────────────────────────────────────
export function useCardio() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("cardio_sessions")
        .select("*")
        .order("date", { ascending: false })
        .limit(20);
      setSessions(data || []);
    })();
  }, []);

  const logCardio = useCallback(async ({ duration_minutes, calories }) => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("cardio_sessions")
      .insert({ date: today, duration_minutes, calories })
      .select()
      .single();
    if (!error) setSessions(prev => [data, ...prev]);
    return { error };
  }, []);

  return { sessions, logCardio };
}

// ── Body Weight ──────────────────────────────────────────────
export function useBodyWeight() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("body_weight_logs")
        .select("*")
        .order("date", { ascending: true })
        .limit(100);
      setLogs(data || []);
    })();
  }, []);

  const logWeight = useCallback(async (weight_kg) => {
    const today = new Date().toISOString().split("T")[0];

    // Upsert: update if today already exists
    const { data: existing } = await supabase
      .from("body_weight_logs")
      .select("id")
      .eq("date", today)
      .single();

    if (existing) {
      await supabase
        .from("body_weight_logs")
        .update({ weight_kg })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("body_weight_logs")
        .insert({ date: today, weight_kg });
    }

    const { data } = await supabase
      .from("body_weight_logs")
      .select("*")
      .order("date", { ascending: true });
    setLogs(data || []);
  }, []);

  return { logs, logWeight };
}
