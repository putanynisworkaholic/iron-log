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
} from "./Icons";

// Per-option roast message pools
const OPTION_ROASTS = {
  skipped_training: [
    "Skipped training? We saw that 😏",
    "The iron misses you 🏋️",
    "Rest day... again? 🤔",
    "Your muscles filed a complaint 💪",
    "The gym called. No answer 📵",
    "Rest day? More like cheat day 🤷",
    "We don't judge... ok we do 👀",
  ],
  skipped_cardio: [
    "The couch called. You answered 🛋️",
    "Cardio skipped. Regret loading... ⏳",
    "Heart rate stayed horizontal today 📉",
    "Skipped cardio? Brave move 🏃",
    "Lungs had a day off too 🫁",
    "Zero km logged. Max chill achieved 😌",
  ],
  junk_food: [
    "Junk food champion 🍔",
    "Fueled by chaos today 🍟",
    "Diet starts Monday... again 🍕",
    "Covered the abs for winter 🍔",
    "Caloric chaos achieved 🌮",
    "The body is now 40% burger 🫠",
    "Nutritional disaster. Chef's kiss 👨‍🍳",
  ],
  too_lazy: [
    "Lazy mode activated 🛏️",
    "Horizontal excellence 💤",
    "The bed called. You answered 😴",
    "Cheating like a pro 🎭",
    "Strategic recovery. Sure 🛌",
    "Gravity won today 🌍",
    "Motion? Never heard of her 🦥",
  ],
  alcohol: [
    "Alcohol fueled decisions 🍺",
    "Living dangerously tonight 🥂",
    "Hydrated... differently 💧",
    "Liquid courage, zero gains 🍻",
    "Your liver filed a complaint 📋",
    "Cheers to skipping the gains 🥃",
    "Recovery drink: redefined 🍺",
  ],
  smoking: [
    "Living dangerously 🚬",
    "Lungs said what? 😶‍🌫️",
    "We don't judge... ok we do 👀",
    "Carbon monoxide cardio 💨",
    "Your VO2 max is crying 📉",
    "Puffing away the gains 🚬",
  ],
};

const CHEAT_OPTIONS = [
  { id: "skipped_training", label: "Skip Weight Training", Icon: SkippedTrainingIcon },
  { id: "skipped_cardio",   label: "Skip Cardio",          Icon: SkippedCardioIcon },
  { id: "junk_food",        label: "Eat Junk Food",        Icon: BurgerIcon },
  { id: "too_lazy",         label: "Too Lazy To Get Up",   Icon: LazyIcon },
  { id: "alcohol",          label: "Alcohol",              Icon: BeerIcon },
  { id: "smoking",          label: "Smoking",              Icon: CigaretteIcon },
];

function pickRoast(optionId) {
  const pool = OPTION_ROASTS[optionId] || ["Questionable choice 💀"];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function CheatDaySection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [roastMap, setRoastMap] = useState({});
  const { profile } = useProfile();
  const { cheatDays, logCheatDay } = useCheatDays();
  const prevOpen = useRef(open);

  // Load today's existing selections
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayCheat = cheatDays.find(c => c.date === today);
    if (todayCheat && todayCheat.selections.length > 0) {
      const s = new Set(todayCheat.selections);
      setSelected(s);
      const rm = {};
      todayCheat.selections.forEach(id => { rm[id] = pickRoast(id); });
      setRoastMap(rm);
    }
  }, [cheatDays]);

  // Auto-save when section collapses
  useEffect(() => {
    if (prevOpen.current && !open && selected.size > 0) {
      logCheatDay([...selected]);
    }
    prevOpen.current = open;
  }, [open]);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setRoastMap(rm => { const n = { ...rm }; delete n[id]; return n; });
      } else {
        next.add(id);
        setRoastMap(rm => ({ ...rm, [id]: pickRoast(id) }));
      }
      return next;
    });
  };

  return (
    <div className="mb-4">
      {/* Section header — same pattern as Cardio */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <DevilIcon size={14} className="calendar-cheat" />
          <span className="text-xs font-bold tracking-[0.3em]">CHEAT</span>
          {selected.size > 0 && (
            <span className="text-[10px] tracking-widest calendar-cheat">
              {selected.size}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-1 pb-3">
          {CHEAT_OPTIONS.map(({ id, label, Icon }) => {
            const isActive = selected.has(id);
            return (
              <div key={id}>
                <button
                  onClick={() => toggle(id)}
                  className={`w-full flex items-center justify-between py-3.5 border-b border-gray-100 active:bg-gray-50 transition-colors
                    ${isActive ? "border-l-2 border-l-black pl-3" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className={isActive ? "calendar-cheat" : "text-gray-400"}
                    />
                    <span className={`text-sm tracking-wide ${isActive ? "font-semibold" : ""}`}>
                      {label}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors
                      ${isActive ? "bg-black border-black" : "border-gray-300"}`}
                    style={{ borderRadius: "4px" }}
                  >
                    {isActive && (
                      <svg
                        width="11" height="11" viewBox="0 0 24 24"
                        fill="none" stroke="white" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="check-draw"
                        style={{ strokeDasharray: 20 }}
                      >
                        <polyline points="4 12 10 18 20 6" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Per-option roast */}
                {isActive && roastMap[id] && (
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 roast-fade">
                    <p className="text-[11px] text-gray-500 tracking-wide">{roastMap[id]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}
