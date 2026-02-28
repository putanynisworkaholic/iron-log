import React, { useMemo, useState, useEffect } from "react";
import { useExercises, useWeekSets } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import { useCheatDays } from "../hooks/useCheatDays";
import { getWeekNumber } from "../lib/utils";
import { MOTIVATIONAL_PHRASES } from "../lib/seedData";
import { SPLIT_TYPES, DAY_NAMES } from "../lib/splitConfig";
import CategorySection from "../components/CategorySection";
import CardioSection from "../components/CardioSection";
import BodyWeightSection from "../components/BodyWeightSection";
import CheatDayModal from "../components/CheatDayModal";
import { DumbbellIcon, DevilIcon } from "../components/Icons";

const NAME_FORMATS = [
  (name, msg) => `${name}, ${msg}`,
  (name, msg) => `${msg}, ${name}`,
  (name, msg) => `${msg} ${name}!`,
  (name, msg) => `${name} — ${msg}`,
];

function RotatingHeader({ name }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length));
  const [formatIdx, setFormatIdx] = useState(() => Math.floor(Math.random() * NAME_FORMATS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % MOTIVATIONAL_PHRASES.length);
        setFormatIdx(Math.floor(Math.random() * NAME_FORMATS.length));
        setVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const message = NAME_FORMATS[formatIdx](name, MOTIVATIONAL_PHRASES[index]);

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="dumbbell-bounce shrink-0" aria-hidden="true">
        <DumbbellIcon size={16} />
      </span>
      <h2
        className="font-bold tracking-wide leading-tight transition-opacity duration-500 whitespace-nowrap overflow-hidden text-ellipsis"
        style={{
          opacity: visible ? 1 : 0,
          fontSize: "clamp(13px, 3.2vw, 17px)",
        }}
      >
        {message}
      </h2>
    </div>
  );
}

export default function Home() {
  const { exercises, loading } = useExercises();
  const { profile } = useProfile();
  const { logCheatDay } = useCheatDays();
  const doneIds = useWeekSets();
  const weekNum = getWeekNumber();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

  const [cheatOpen, setCheatOpen] = useState(false);

  // Determine sections to show based on split
  const sections = useMemo(() => {
    if (!profile?.split) return [];
    const split = profile.split;

    if (split === "Day Split") {
      const todayFull = new Date().toLocaleDateString("en-US", { weekday: "long" });
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
      <div className="mb-8 text-center">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">{today}</p>
        <RotatingHeader name={profile?.name || ""} />
        <div className="flex items-center justify-center gap-3 mt-1">
          <p className="text-[10px] tracking-[0.3em] text-gray-400">WEEK {weekNum} OF 52</p>
          <button
            onClick={() => setCheatOpen(true)}
            className="flex items-center gap-1 py-0.5 px-2 border border-gray-200 text-[9px] tracking-widest text-gray-400 active:border-black active:text-black transition-colors"
          >
            <DevilIcon size={10} />
            CHEAT
          </button>
        </div>
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

      {/* Cheat Day Modal */}
      <CheatDayModal
        open={cheatOpen}
        onClose={() => setCheatOpen(false)}
        userName={profile?.name || ""}
        onConfess={(selections) => logCheatDay(selections)}
      />
    </div>
  );
}
