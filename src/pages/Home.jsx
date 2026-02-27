import React, { useMemo, useState, useEffect } from "react";
import { useExercises, useWeekSets } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import { getWeekNumber } from "../lib/utils";
import { MOTIVATIONAL_PHRASES } from "../lib/seedData";
import { SPLIT_TYPES, DAY_NAMES } from "../lib/splitConfig";
import CategorySection from "../components/CategorySection";
import CardioSection from "../components/CardioSection";
import BodyWeightSection from "../components/BodyWeightSection";
import { DumbbellIcon } from "../components/Icons";

function RotatingHeader({ name }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % MOTIVATIONAL_PHRASES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3">
      <span className="dumbbell-bounce shrink-0 mt-0.5" aria-hidden="true">
        <DumbbellIcon size={20} className="text-black" />
      </span>
      <h2
        className="text-xl font-bold tracking-wide leading-tight transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {MOTIVATIONAL_PHRASES[index]}, {name}
      </h2>
    </div>
  );
}

export default function Home() {
  const { exercises, loading } = useExercises();
  const { profile } = useProfile();
  const doneIds = useWeekSets();
  const weekNum = getWeekNumber();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

  // Determine sections to show based on split
  const sections = useMemo(() => {
    if (!profile?.split) return [];
    const split = profile.split;

    if (split === "Day Split") {
      const todayFull = new Date().toLocaleDateString("en-US", { weekday: "long" }); // "Monday"
      const ids = profile?.daySplit?.[todayFull] || [];
      return [{
        title: todayFull.toUpperCase(),
        exercises: exercises.filter(ex => ids.includes(ex.id)),
        isDaySection: true,
      }];
    }

    if (split === "Custom") {
      const customDays = profile?.customDays || [];
      return customDays.map(day => ({
        title: day,
        exercises: exercises.filter(ex => ex.category === day),
      }));
    }

    const splitDef = SPLIT_TYPES.find(s => s.id === split);
    const splitSections = splitDef?.sections || [];
    return splitSections.map(section => ({
      title: section,
      exercises: exercises.filter(ex => ex.category === section),
    }));
  }, [profile, exercises]);

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
        <RotatingHeader name={profile?.name || ""} />
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">WEEK {weekNum} OF 52</p>
      </div>

      {/* Body Weight */}
      <BodyWeightSection />

      {/* Split sections */}
      {sections.map((section, i) => (
        <div key={section.title} className="stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
          <CategorySection
            title={section.title}
            exercises={section.exercises}
            doneIds={doneIds}
          />
        </div>
      ))}

      {/* Cardio */}
      <div className="stagger-item" style={{ animationDelay: `${sections.length * 50}ms` }}>
        <CardioSection />
      </div>
    </div>
  );
}
