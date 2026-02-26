import React, { useMemo, useState, useEffect } from "react";
import { useExercises } from "../hooks/useExercises";
import { supabase } from "../lib/supabase";
import { getWeekNumber, getStartOfWeek } from "../lib/utils";
import CategorySection from "../components/CategorySection";
import CardioSection from "../components/CardioSection";
import { CATEGORIES } from "../lib/seedData";

export default function Home() {
  const { exercises, loading } = useExercises();
  const [weekSets, setWeekSets] = useState([]);
  const weekNum = getWeekNumber();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

  useEffect(() => {
    fetchWeekSets();
  }, []);

  async function fetchWeekSets() {
    const startOfWeek = getStartOfWeek().toISOString().split("T")[0];
    const { data } = await supabase
      .from("workout_sets")
      .select("exercise_id, workout_sessions(date)")
      .gte("created_at", startOfWeek);
    setWeekSets(data || []);
  }

  const byCategory = useMemo(() => {
    const map = {};
    CATEGORIES.filter(c => c !== "Cardio").forEach(c => {
      map[c] = exercises.filter(ex => ex.category === c);
    });
    return map;
  }, [exercises]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[10px] tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">{today}</p>
        <h2 className="text-xl font-bold tracking-wide leading-tight">TODAY'S SESSION</h2>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">WEEK {weekNum} OF 52</p>
      </div>

      {CATEGORIES.filter(c => c !== "Cardio").map(cat => (
        <CategorySection
          key={cat}
          title={cat}
          exercises={byCategory[cat] || []}
          weekSets={weekSets}
        />
      ))}

      <CardioSection />
    </div>
  );
}
