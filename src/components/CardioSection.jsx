import React, { useState } from "react";
import { useCardio } from "../hooks/useExercises";
import { formatDate } from "../lib/utils";

export default function CardioSection() {
  const [open, setOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ duration_minutes: "", calories: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const { sessions, logCardio } = useCardio();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const { error } = await logCardio({
      date: today,
      duration_minutes: parseInt(form.duration_minutes),
      calories: parseInt(form.calories) || null,
    });
    setSaving(false);
    if (!error) {
      setDone(true);
      setForm({ duration_minutes: "", calories: "" });
      setTimeout(() => { setDone(false); setLogOpen(false); }, 1500);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 border-b border-black"
      >
        <span className="text-xs font-bold tracking-[0.3em] uppercase">Cardio</span>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-2">
          {/* Log button */}
          <button
            onClick={() => setLogOpen(o => !o)}
            className="w-full py-3 border border-black text-xs tracking-widest hover:bg-black hover:text-white transition-colors mb-3"
          >
            + LOG CARDIO
          </button>

          {/* Log form */}
          {logOpen && (
            <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xxs tracking-widest text-gray-400 block mb-1">MINUTES</label>
                  <input
                    type="number"
                    value={form.duration_minutes}
                    onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                    placeholder="30"
                    required
                    className="w-full border-b border-black py-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-xxs tracking-widest text-gray-400 block mb-1">CALORIES</label>
                  <input
                    type="number"
                    value={form.calories}
                    onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                    placeholder="300"
                    className="w-full border-b border-black py-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving || done}
                className="w-full py-2 bg-black text-white text-xs tracking-widest disabled:opacity-50"
              >
                {done ? "LOGGED ✓" : saving ? "SAVING..." : "SAVE"}
              </button>
            </form>
          )}

          {/* History */}
          {sessions.slice(0, 5).map(s => (
            <div key={s.id} className="flex justify-between py-2 border-b border-gray-100 text-sm">
              <span className="text-gray-400 text-xs">{formatDate(s.date)}</span>
              <span className="tracking-wide">{s.duration_minutes} min</span>
              {s.calories && <span className="text-gray-400 text-xs">{s.calories} kcal</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
