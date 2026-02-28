import React, { useState } from "react";
import {
  HaloIcon,
  SkippedTrainingIcon,
  SkippedCardioIcon,
  BurgerIcon,
  BedIcon,
  BeerIcon,
  CigaretteIcon,
} from "./Icons";

const CHEAT_OPTIONS = [
  { id: "skipped_training", label: "Skipped Training", Icon: SkippedTrainingIcon },
  { id: "skipped_cardio",  label: "Skipped Cardio",  Icon: SkippedCardioIcon },
  { id: "junk_food",       label: "Junk Food",       Icon: BurgerIcon },
  { id: "too_lazy",        label: "Too Lazy",        Icon: BedIcon },
  { id: "alcohol",         label: "Alcohol",         Icon: BeerIcon },
  { id: "smoking",         label: "Smoking",         Icon: CigaretteIcon },
];

function getRoastMessage(selections, name) {
  const s = new Set(selections);

  if (s.size === 6)
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
  if (s.has("skipped_training")) return `Rest day with extra steps, ${name} 😏`;
  if (s.has("skipped_cardio"))   return `The couch called, you answered 🛋️`;
  if (s.has("junk_food"))        return `Fueled by chaos, ${name} 🍔`;
  if (s.has("too_lazy"))         return `Horizontal excellence today, ${name} 💤`;
  if (s.has("alcohol"))          return `Hydrated differently, ${name} 🍺`;
  if (s.has("smoking"))          return `Lungs said what? 🚬`;

  return `Questionable choices, ${name} 💀`;
}

export default function CheatDayModal({ open, onClose, userName, onConfess }) {
  const [selected, setSelected] = useState(new Set());
  const [roast, setRoast] = useState(null);

  if (!open) return null;

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfess = () => {
    if (selected.size === 0) return;
    const msg = getRoastMessage([...selected], userName);
    onConfess([...selected]);
    setRoast(msg);
    setTimeout(() => {
      setRoast(null);
      setSelected(new Set());
      onClose();
    }, 2500);
  };

  const handleClose = () => {
    if (roast) return; // Don't close during roast display
    setSelected(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 modal-backdrop" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm p-6 z-10 modal-pop">
        {roast ? (
          <div className="text-center py-10 fade-in">
            <p className="text-sm tracking-wide leading-relaxed">{roast}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <HaloIcon size={28} className="mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold tracking-[0.3em]">CONFESSION BOOTH</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {CHEAT_OPTIONS.map(({ id, label, Icon }) => {
                const isActive = selected.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 border transition-colors
                      ${isActive
                        ? "bg-black text-white border-black"
                        : "border-gray-200 text-gray-500 active:border-black"}`}
                  >
                    <Icon size={20} />
                    <span className="text-[9px] tracking-widest text-center leading-tight">
                      {label.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfess}
              disabled={selected.size === 0}
              className="w-full py-3 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-30"
            >
              CONFESS
            </button>
          </>
        )}
      </div>
    </div>
  );
}
