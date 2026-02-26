import { useState, useEffect, useCallback } from "react";
import {
  getExercises, addExercise as storeAddExercise,
  getExerciseLogs, logWorkout, getWorkoutLogs,
  getWeekExerciseIds, getCardioLogs, logCardio as storeLogCardio,
  getBodyWeightLogs, logBodyWeight as storeLogBodyWeight,
  seedExercisesIfEmpty,
} from "../lib/store";
import { SEED_EXERCISES } from "../lib/seedData";

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedExercisesIfEmpty(SEED_EXERCISES);
    setExercises(getExercises());
    setLoading(false);
  }, []);

  const addExercise = useCallback((exercise) => {
    const ex = storeAddExercise(exercise);
    setExercises(getExercises());
    return { data: ex, error: null };
  }, []);

  return { exercises, loading, addExercise, refetch: () => setExercises(getExercises()) };
}

export function useExerciseHistory(exerciseId) {
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(() => {
    if (!exerciseId) return;
    setHistory(getExerciseLogs(exerciseId));
  }, [exerciseId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const logSets = useCallback((sets, targetWeight, targetReps) => {
    const validSets = sets
      .filter(s => s.weight && s.reps)
      .map(s => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps) }));
    if (!validSets.length) return { error: "No valid sets" };
    logWorkout({
      exercise_id: exerciseId,
      sets: validSets,
      target_weight: targetWeight ? parseFloat(targetWeight) : null,
      target_reps: targetReps ? parseInt(targetReps) : null,
    });
    fetchHistory();
    return { error: null };
  }, [exerciseId, fetchHistory]);

  return { history, logSets, refetch: fetchHistory };
}

export function useWeekSets() {
  const [doneIds, setDoneIds] = useState(new Set());

  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(now);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    const since = start.toISOString().split("T")[0];
    setDoneIds(new Set(getWeekExerciseIds(since)));
  }, []);

  return doneIds;
}

export function useProgressData() {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [cardioLogs, setCardioLogs] = useState([]);

  useEffect(() => {
    setWorkoutLogs(getWorkoutLogs());
    setCardioLogs(getCardioLogs());
  }, []);

  return { workoutLogs, cardioLogs };
}

export function useCardio() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => { setSessions(getCardioLogs()); }, []);

  const log = useCallback(({ duration_minutes, calories }) => {
    storeLogCardio({ duration_minutes, calories });
    setSessions(getCardioLogs());
    return { error: null };
  }, []);

  return { sessions, logCardio: log };
}

export function useBodyWeight() {
  const [logs, setLogs] = useState([]);

  useEffect(() => { setLogs(getBodyWeightLogs()); }, []);

  const log = useCallback((weight_kg) => {
    storeLogBodyWeight(weight_kg);
    setLogs(getBodyWeightLogs());
  }, []);

  return { logs, logWeight: log };
}
