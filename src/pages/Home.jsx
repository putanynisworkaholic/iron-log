import React, { useMemo } from "react";
import { useExercises, useWeekSets } from "../hooks/useExercises";
import { getWeekNumber } from "../lib/utils";
import { CATEGORIES } from "../lib/seedData";
import CategorySection from "../components/CategorySection";
import CardioSection from "../components/CardioSection";
import BodyWeightSection from "../components/BodyWeightSection";

export default function Home() {
  const { exercises, loading } = useExercises();
  const doneIds = useWeekSets();
  const weekNum = getWeekNumber();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

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
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">{today}</p>
        <h2 className="text-xl font-bold tracking-wide leading-tight">TODAY'S SESSION</h2>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">WEEK {weekNum} OF 52</p>
      </div>

      {/* Body Weight */}
      <BodyWeightSection />

      {/* Categories — all collapsed by default */}
      {CATEGORIES.filter(c => c !== "Cardio").map(cat => (
        <CategorySection
          key={cat}
          title={cat}
          exercises={byCategory[cat] || []}
          doneIds={doneIds}
        />
      ))}

      {/* Cardio */}
      <CardioSection />
    </div>
  );
}
