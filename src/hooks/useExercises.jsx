import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

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

export function useExerciseHistory(exerciseId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!exerciseId) return;
    fetchHistory();
  }, [exerciseId]);

  async function fetchHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from("workout_sets")
      .select("*, workout_sessions(date)")
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false })
      .limit(60);
    if (!error) setHistory(data || []);
    setLoading(false);
  }

  async function logSets(sets, targetWeight, targetReps) {
    const today = new Date().toISOString().split("T")[0];
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

    const setsToInsert = sets.map((s, i) => ({
      exercise_id: exerciseId,
      session_id: sessionId,
      set_number: i + 1,
      weight_kg: parseFloat(s.weight) || 0,
      reps: parseInt(s.reps) || 0,
      target_weight_kg: targetWeight ? parseFloat(targetWeight) : null,
      target_reps: targetReps ? parseInt(targetReps) : null,
    }));

    const { error } = await supabase.from("workout_sets").insert(setsToInsert);
    if (!error) fetchHistory();
    return { error };
  }

  return { history, loading, logSets, refetch: fetchHistory };
}

export function useProgressData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    setLoading(true);
    const { data: sets, error } = await supabase
      .from("workout_sets")
      .select("*, exercises(name, category), workout_sessions(date)")
      .order("created_at", { ascending: false });
    if (!error) setData(sets || []);
    setLoading(false);
  }

  return { data, loading, refetch: fetchProgress };
}

export function useCardio() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchCardio();
  }, []);

  async function fetchCardio() {
    const { data } = await supabase
      .from("cardio_sessions")
      .select("*")
      .order("date", { ascending: false })
      .limit(20);
    setSessions(data || []);
  }

  async function logCardio({ date, duration_minutes, calories }) {
    const { data, error } = await supabase
      .from("cardio_sessions")
      .insert({ date, duration_minutes, calories })
      .select()
      .single();
    if (!error) setSessions(prev => [data, ...prev]);
    return { error };
  }

  return { sessions, logCardio };
}
