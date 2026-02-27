import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import Collapse from "./Collapse";
import { CATEGORY_ICONS, TrashIcon } from "./Icons";

export default function CategorySection({ title, exercises, doneIds }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();
  const { deleteExercise } = useExercises();
  const { removeExerciseFromAllDays } = useProfile();

  const doneCount = exercises.filter(ex => doneIds.has(ex.id)).length;
  const Icon = CATEGORY_ICONS[title];

  const handleDelete = async (id) => {
    await deleteExercise(id);
    removeExerciseFromAllDays(id);
    setConfirmId(null);
  };

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
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-1 pb-2">
          {exercises.length === 0 ? (
            <p className="text-[10px] text-gray-300 tracking-widest py-6 text-center">
              NO EXERCISES — USE + TO ADD
            </p>
          ) : (
            <>
              {exercises.map((ex, i) => {
                const done = doneIds.has(ex.id);
                const isConfirming = confirmId === ex.id;

                return (
                  <div
                    key={ex.id}
                    className="flex items-center border-b border-gray-100 stagger-item"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {isConfirming ? (
                      <div className="flex-1 flex items-center justify-between py-3 gap-3">
                        <span className="text-xs text-gray-500 tracking-wide truncate">DELETE {ex.name.toUpperCase()}?</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleDelete(ex.id)}
                            className="text-[10px] tracking-widest bg-black text-white px-3 py-1.5"
                          >
                            YES
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-[10px] tracking-widest border border-gray-300 px-3 py-1.5"
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate(`/exercise/${ex.id}`)}
                          className="flex-1 flex items-center justify-between py-3.5 active:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 border border-black transition-colors ${done ? "bg-black" : "bg-white"}`} />
                            <span className="text-sm tracking-wide">{ex.name}</span>
                          </div>
                          <span className="text-gray-300 text-xs mr-3">→</span>
                        </button>
                        {editing && (
                          <button
                            onClick={() => setConfirmId(ex.id)}
                            className="p-3 text-gray-300 active:text-black transition-colors shrink-0"
                          >
                            <TrashIcon size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => { setEditing(o => !o); setConfirmId(null); }}
                className="w-full py-2 mt-2 text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
              >
                {editing ? "DONE EDITING" : "EDIT"}
              </button>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
}
