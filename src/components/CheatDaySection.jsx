import React, { useState, useEffect, useRef } from "react";
import { useCheatDays } from "../hooks/useCheatDays";
import { useProfile } from "../hooks/useProfile";
import Collapse from "./Collapse";
import {
  DevilIcon,
  SkippedTrainingIcon,
  SkippedCardioIcon,
  BurgerIcon,
  LazyIcon,
  BeerIcon,
  CigaretteIcon,
  StayedUpLateIcon,
  ZeroWaterIcon,
  StressEatingIcon,
  SkippedStretchingIcon,
} from "./Icons";

const CHEAT_OPTIONS = [
  { id: "skipped_training",   label: "Skipped Training",   Icon: SkippedTrainingIcon },
  { id: "skipped_cardio",     label: "Skipped Cardio",     Icon: SkippedCardioIcon },
  { id: "junk_food",          label: "Junk Food",          Icon: BurgerIcon },
  { id: "too_lazy",           label: "Too Lazy",           Icon: LazyIcon },
  { id: "alcohol",            label: "Alcohol",            Icon: BeerIcon },
  { id: "smoking",            label: "Smoking",            Icon: CigaretteIcon },
  { id: "stayed_up_late",     label: "Stayed Up Late",     Icon: StayedUpLateIcon },
  { id: "zero_water",         label: "Zero Water",         Icon: ZeroWaterIcon },
  { id: "stress_eating",      label: "Stress Eating",      Icon: StressEatingIcon },
  { id: "skipped_stretching", label: "Skipped Stretching", Icon: SkippedStretchingIcon },
];

function getRoastMessage(selections, name) {
  const s = new Set(selections);
  if (s.size === 0) return null;

  if (s.size >= 5)
    return `${name} said 'new year who dis' 💀🔥`;
  if (s.size >= 3)
    return `Legendary effort in all the wrong ways, ${name} 💀`;

  // Two-item combos
  if (s.size === 2) {
    if (s.has("junk_food") && s.has("alcohol"))
      return `Full send on the self-destruction 🍔🍺`;
    if (s.has("skipped_training") && s.has("too_lazy"))
      return `Two birds, one couch, ${name} 🛋️`;
    if (s.has("alcohol") && s.has("smoking"))
      return `Living dangerously, ${name} 🚬🍺`;
    return `Legendary effort in all the wrong ways, ${name} 💀`;
  }

  // Single selections
  if (s.has("skipped_training"))   return `Rest day with extra steps, ${name} 😏`;
  if (s.has("skipped_cardio"))     return `The couch called. You answered 🛋️`;
  if (s.has("junk_food"))          return `Fueled by chaos today, ${name} 🍔`;
  if (s.has("too_lazy"))           return `Horizontal excellence, ${name} 💤`;
  if (s.has("alcohol"))            return `Hydrated differently, ${name} 🍺`;
  if (s.has("smoking"))            return `Lungs said what? 🚬`;
  if (s.has("stayed_up_late"))     return `Sleep is for the weak, apparently 🌙`;
  if (s.has("zero_water"))         return `A raisin. You are becoming a raisin 🌵`;
  if (s.has("stress_eating"))      return `Feelings: consumed. Literally 🍴`;
  if (s.has("skipped_stretching")) return `Snap. Crackle. You 🦴`;

  return `Questionable choices, ${name} 💀`;
}

export default function CheatDaySection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [initialRoast, setInitialRoast] = useState(false);
  const { profile } = useProfile();
  const { cheatDays, logCheatDay } = useCheatDays();
  const prevOpen = useRef(open);

  const userName = profile?.name || "You";

  // Load today's selections if they exist
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayCheat = cheatDays.find(c => c.date === today);
    if (todayCheat) {
      setSelected(new Set(todayCheat.selections));
    }
  }, [cheatDays]);

  // Save when section collapses
  useEffect(() => {
    if (prevOpen.current && !open && selected.size > 0) {
      logCheatDay([...selected]);
    }
    prevOpen.current = open;
  }, [open]);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (!initialRoast && next.size > 0) setInitialRoast(true);
      return next;
    });
  };

  const roast = getRoastMessage([...selected], userName);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <DevilIcon size={14} className="calendar-cheat" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">CHEAT DAY</span>
          {selected.size > 0 && (
            <span className="text-[10px] tracking-widest calendar-cheat">
              {selected.size} SELECTED
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-2 pb-2">
          {CHEAT_OPTIONS.map(({ id, label, Icon }) => {
            const isActive = selected.has(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`w-full flex items-center justify-between py-3 px-3 border-b border-gray-100 transition-colors
                  ${isActive ? "bg-gray-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "calendar-cheat" : "text-gray-400"} />
                  <span className={`text-sm tracking-wide ${isActive ? "font-bold" : ""}`}>
                    {label}
                  </span>
                </div>
                <div className={`w-5 h-5 border-2 r-btn flex items-center justify-center transition-colors
                  ${isActive ? "bg-black border-black" : "border-gray-300"}`}>
                  {isActive && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-draw" style={{ strokeDasharray: 20 }}>
                      <polyline points="4 12 10 18 20 6" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}

          {/* Inline roast message */}
          {roast && (
            <div className={`mt-3 p-3 border border-gray-200 r-card ${initialRoast ? "roast-fade" : ""}`}>
              <p className="text-sm tracking-wide text-center leading-relaxed">{roast}</p>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}
