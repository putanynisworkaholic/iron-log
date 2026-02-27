import React, { useState, useMemo } from "react";
import { useCardio } from "../hooks/useExercises";
import { formatDate } from "../lib/utils";
import Collapse from "./Collapse";
import LineChart from "./LineChart";
import { HeartPulseIcon, CARDIO_TYPE_ICONS, CARDIO_TYPES } from "./Icons";

export default function CardioSection() {
  const [open, setOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Run",
    custom_type: "",
    duration_minutes: "",
    distance_km: "",
    calories: "",
  });
  const [done, setDone] = useState(false);
  const { sessions, logCardio } = useCardio();

  const chartData = useMemo(() => {
    return [...sessions]
      .reverse()
      .slice(-7)
      .map(s => ({ label: formatDate(s.date), value: s.duration_minutes }));
  }, [sessions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const resolvedType = form.type === "Other" ? (form.custom_type.trim() || "Other") : form.type;
    logCardio({
      type: resolvedType,
      duration_minutes: parseInt(form.duration_minutes),
      distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
      calories: form.calories ? parseInt(form.calories) : null,
    });
    setDone(true);
    setForm({ type: "Run", custom_type: "", duration_minutes: "", distance_km: "", calories: "" });
    setTimeout(() => { setDone(false); setLogOpen(false); }, 1200);
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HeartPulseIcon size={14} className="text-gray-500" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">CARDIO</span>
        </div>
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
            <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-200 fade-in space-y-4">
              {/* Type picker */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-2">TYPE</label>
                <div className="grid grid-cols-5 gap-1">
                  {CARDIO_TYPES.map(t => {
                    const Icon = CARDIO_TYPE_ICONS[t] || HeartPulseIcon;
                    const active = form.type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, type: t }))}
                        className={`flex flex-col items-center gap-1 py-2 border text-[9px] tracking-wide transition-colors
                          ${active ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
                      >
                        <Icon size={14} />
                        {t.toUpperCase()}
                      </button>
                    );
                  })}
                </div>

                {/* Custom type name when "Other" selected */}
                {form.type === "Other" && (
                  <input
                    type="text"
                    value={form.custom_type}
                    onChange={e => setForm(f => ({ ...f, custom_type: e.target.value }))}
                    placeholder="Activity name..."
                    className="w-full border-b border-black py-2 text-sm focus:outline-none bg-transparent mt-3"
                  />
                )}
              </div>

              {/* Duration + Distance */}
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-[10px] tracking-widest text-gray-400 block mb-1">KM (OPT.)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={form.distance_km}
                    onChange={e => setForm(f => ({ ...f, distance_km: e.target.value }))}
                    placeholder="5.0"
                    className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Calories */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-1">CALORIES (OPT.)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.calories}
                  onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                  placeholder="300"
                  className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={done || !form.duration_minutes}
                className={`w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50 ${done ? "pulse-glow" : ""}`}
              >
                {done ? "LOGGED ✓" : "SAVE"}
              </button>
            </form>
          </Collapse>

          {chartData.length >= 2 && (
            <div className="border border-gray-100 p-2 mb-3">
              <p className="text-[10px] tracking-widest text-gray-400 mb-1">DURATION TREND</p>
              <LineChart data={chartData} height={60} />
            </div>
          )}

          {sessions.slice(0, 6).map(s => {
            const TypeIcon = CARDIO_TYPE_ICONS[s.type] || HeartPulseIcon;
            return (
              <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TypeIcon size={12} className="text-gray-400 shrink-0" />
                  <div>
                    <span className="text-[10px] tracking-widest text-gray-400">
                      {s.type || "CARDIO"} · {formatDate(s.date)}
                    </span>
                    {s.distance_km && (
                      <span className="text-[10px] text-gray-300 ml-2">{s.distance_km} km</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold tracking-wide">{s.duration_minutes} min</span>
                  {s.calories && (
                    <span className="text-[10px] text-gray-400 block">{s.calories} kcal</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}
