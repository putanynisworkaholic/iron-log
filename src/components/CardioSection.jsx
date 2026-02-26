import React, { useState } from "react";
import { useCardio } from "../hooks/useExercises";
import { formatDate } from "../lib/utils";
import Collapse from "./Collapse";

export default function CardioSection() {
  const [open, setOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ duration_minutes: "", calories: "" });
  const [done, setDone] = useState(false);
  const { sessions, logCardio } = useCardio();

  const handleSubmit = (e) => {
    e.preventDefault();
    logCardio({
      duration_minutes: parseInt(form.duration_minutes),
      calories: parseInt(form.calories) || null,
    });
    setDone(true);
    setForm({ duration_minutes: "", calories: "" });
    setTimeout(() => { setDone(false); setLogOpen(false); }, 1200);
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-bold tracking-[0.3em] uppercase">CARDIO</span>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-2 pb-2">
          <button
            onClick={() => setLogOpen(o => !o)}
            className="w-full py-3.5 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors mb-3"
          >
            + LOG CARDIO
          </button>

          <Collapse open={logOpen}>
            <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-200 fade-in">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] tracking-widest text-gray-400 block mb-1">MINUTES</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.duration_minutes}
                    onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                    placeholder="30"
                    required
                    className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest text-gray-400 block mb-1">CALORIES</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.calories}
                    onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                    placeholder="300"
                    className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={done || !form.duration_minutes}
                className="w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
              >
                {done ? "LOGGED" : "SAVE"}
              </button>
            </form>
          </Collapse>

          {sessions.slice(0, 5).map(s => (
            <div key={s.id} className="flex justify-between items-center py-2.5 border-b border-gray-100 text-sm">
              <span className="text-gray-400 text-[10px] tracking-widest">{formatDate(s.date)}</span>
              <span className="tracking-wide font-bold">{s.duration_minutes} min</span>
              {s.calories && <span className="text-gray-400 text-[10px]">{s.calories} kcal</span>}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
