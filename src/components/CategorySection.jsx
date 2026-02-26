import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Collapse from "./Collapse";
import { CATEGORY_ICONS } from "./Icons";

export default function CategorySection({ title, exercises, doneIds }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const doneCount = exercises.filter(ex => doneIds.has(ex.id)).length;
  const Icon = CATEGORY_ICONS[title];

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={14} className="text-gray-500" />}
          <span className="text-xs font-bold tracking-[0.3em] uppercase">{title}</span>
          <span className="text-[10px] text-gray-400 tracking-widest">
            {doneCount}/{exercises.length}
          </span>
        </div>
        <span className={`text-xs text-gray-400 transition-transform duration-300 ${open ? "rotate-0" : ""}`}>
          {open ? "−" : "+"}
        </span>
      </button>

      <Collapse open={open}>
        <div className="pt-1 pb-2">
          {exercises.length === 0 ? (
            <p className="text-[10px] text-gray-300 tracking-widest py-6 text-center">
              NO EXERCISES — ADD ONE
            </p>
          ) : (
            exercises.map((ex, i) => {
              const done = doneIds.has(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => navigate(`/exercise/${ex.id}`)}
                  className="w-full flex items-center justify-between py-3.5 border-b border-gray-100 active:bg-gray-50 transition-colors stagger-item"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 border border-black transition-colors ${done ? "bg-black" : "bg-white"}`} />
                    <span className="text-sm tracking-wide">{ex.name}</span>
                  </div>
                  <span className="text-gray-300 text-xs">→</span>
                </button>
              );
            })
          )}
        </div>
      </Collapse>
    </div>
  );
}
