import React, { useMemo, useState, useEffect } from "react";
import { useExercises, useWeekSets } from "../hooks/useExercises";
import { getWeekNumber, randomFrom } from "../lib/utils";
import { CATEGORIES, MOTIVATIONAL_PHRASES } from "../lib/seedData";
import CategorySection from "../components/CategorySection";
import CardioSection from "../components/CardioSection";
import BodyWeightSection from "../components/BodyWeightSection";

function RotatingPhrase() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % MOTIVATIONAL_PHRASES.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="text-[10px] tracking-[0.3em] text-gray-400 mt-2 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {MOTIVATIONAL_PHRASES[index]}
    </p>
  );
}

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
        <RotatingPhrase />
      </div>

      {/* Body Weight */}
      <BodyWeightSection />

      {/* Categories */}
      {CATEGORIES.filter(c => c !== "Cardio").map((cat, i) => (
        <div key={cat} className="stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
          <CategorySection
            title={cat}
            exercises={byCategory[cat] || []}
            doneIds={doneIds}
          />
        </div>
      ))}

      {/* Cardio */}
      <div className="stagger-item" style={{ animationDelay: "150ms" }}>
        <CardioSection />
      </div>
    </div>
  );
}
