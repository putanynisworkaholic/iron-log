import React, { useState, useEffect } from "react";
import { useCheatDays } from "../hooks/useCheatDays";
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
} from "./Icons";

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
  late_night: [
    "Sleep is free recovery. You declined 😴",
    "3am and counting... 🌙",
    "Melatonin said come home 🌛",
    "Tomorrow's workout is already suffering 💤",
    "The gains happen while you sleep. Just saying 🛏️",
    "Night owl mode: gains bird mode: off 🦉",
  ],
  no_water: [
    "Your muscles are 70% water. Where is it? 💧",
    "Hydration? Never heard of her 🏜️",
    "Dry run. Literally 🚰",
    "The human body is disappointed in you 🫗",
    "Caffeine doesn't count 🫙",
    "Dehydrated gains are not gains 🧪",
  ],
};

const CHEAT_OPTIONS = [
  { id: "skipped_training", label: "SKIP TRAIN",  Icon: SkippedTrainingIcon },
  { id: "skipped_cardio",   label: "SKIP CARDIO", Icon: SkippedCardioIcon },
  { id: "junk_food",        label: "JUNK FOOD",   Icon: BurgerIcon },
  { id: "too_lazy",         label: "TOO LAZY",    Icon: LazyIcon },
  { id: "alcohol",          label: "ALCOHOL",     Icon: BeerIcon },
  { id: "smoking",          label: "SMOKING",     Icon: CigaretteIcon },
  { id: "late_night",       label: "LATE NIGHT",  Icon: StayedUpLateIcon },
  { id: "no_water",         label: "NO WATER",    Icon: ZeroWaterIcon },
];

function pickRoastForSelection(selected) {
  const allRoasts = [];
  selected.forEach(id => {
    const pool = OPTION_ROASTS[id] || [];
    allRoasts.push(...pool);
  });
  if (!allRoasts.length) return "Questionable choices today 💀";
  return allRoasts[Math.floor(Math.random() * allRoasts.length)];
}

export default function CheatDaySection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [confessingMsg, setConfessingMsg] = useState(null);
  const { cheatDays, logCheatDay } = useCheatDays();

  // Load today's existing selections
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayCheat = cheatDays.find(c => c.date === today);
    if (todayCheat && todayCheat.selections.length > 0) {
      setSelected(new Set(todayCheat.selections));
    }
  }, [cheatDays]);

  const toggle = (id) => {
    if (confessingMsg) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfess = async () => {
    if (!selected.size || confessingMsg) return;
    const roast = pickRoastForSelection([...selected]);
    setConfessingMsg(roast);
    await logCheatDay([...selected]);
    setTimeout(() => {
      setConfessingMsg(null);
      setSelected(new Set());
    }, 3000);
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <DevilIcon size={14} className="calendar-cheat" />
          <span className="text-xs font-bold tracking-[0.3em]">CHEAT</span>
          {selected.size > 0 && (
            <span className="text-[10px] tracking-widest calendar-cheat">{selected.size}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-3 pb-3">
          <div className="grid grid-cols-4 gap-1 mb-3">
            {CHEAT_OPTIONS.map(({ id, label, Icon }) => {
              const active = selected.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  className={`flex flex-col items-center gap-1 py-2 border text-[9px] tracking-wide transition-colors
                    ${active ? "text-white" : "border-gray-200 text-gray-600 active:border-black"}`}
                  style={active ? { backgroundColor: "var(--t-cheat)", borderColor: "var(--t-cheat)" } : {}}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleConfess}
            disabled={!selected.size}
            className={`w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-30 transition-all
              ${confessingMsg ? "pulse-glow" : ""}`}
          >
            {confessingMsg || "CONFESS"}
          </button>
        </div>
      </Collapse>
    </div>
  );
}
