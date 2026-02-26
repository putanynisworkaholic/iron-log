import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategorySection({ title, exercises, weekSets }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const doneCount = exercises.filter(ex =>
    weekSets.some(s => s.exercise_id === ex.id)
  ).length;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 border-b border-black"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-[0.3em] uppercase">{title}</span>
          {doneCount > 0 && (
            <span className="text-xxs text-gray-400 tracking-widest">
              {doneCount}/{exercises.length}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-2">
          {exercises.length === 0 ? (
            <p className="text-xxs text-gray-300 tracking-widest py-4 text-center">
              NO EXERCISES — ADD ONE
            </p>
          ) : (
            exercises.map(ex => {
              const done = weekSets.some(s => s.exercise_id === ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => navigate(`/exercise/${ex.id}`)}
                  className="w-full flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 border border-black ${done ? "bg-black" : "bg-white"}`} />
                    <span className="text-sm tracking-wide">{ex.name}</span>
                  </div>
                  {done && (
                    <span className="text-xxs tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      DONE
                    </span>
                  )}
                  <span className="text-gray-300 text-xs">→</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
