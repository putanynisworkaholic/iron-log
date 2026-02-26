import React, { useState } from "react";
import { useBodyWeight } from "../hooks/useExercises";
import { formatDate } from "../lib/utils";
import LineChart from "./LineChart";
import Collapse from "./Collapse";

export default function BodyWeightSection() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const { logs, logWeight } = useBodyWeight();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    await logWeight(parseFloat(input));
    setInput("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const chartData = logs.slice(-14).map(l => ({
    label: formatDate(l.date),
    value: parseFloat(l.weight_kg),
  }));

  const latest = logs.length > 0 ? logs[logs.length - 1] : null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-[0.3em] uppercase">BODY WEIGHT</span>
          {latest && (
            <span className="text-[10px] text-gray-400 tracking-widest">{latest.weight_kg} KG</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-3 pb-2">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end mb-4">
            <div className="flex-1">
              <label className="text-[10px] tracking-widest text-gray-400 block mb-1">TODAY (KG)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={latest ? String(latest.weight_kg) : "70.0"}
                className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={saved || !input}
              className="px-6 py-2.5 bg-black text-white text-xs tracking-widest disabled:opacity-50 shrink-0"
            >
              {saved ? "SAVED" : "LOG"}
            </button>
          </form>

          {chartData.length >= 2 && (
            <div className="border border-gray-100 p-2 mb-3">
              <LineChart data={chartData} height={70} />
            </div>
          )}

          {logs.slice(-7).reverse().map(l => (
            <div key={l.id} className="flex justify-between py-2 border-b border-gray-100 text-sm">
              <span className="text-[10px] text-gray-400 tracking-widest">{formatDate(l.date)}</span>
              <span className="font-bold">{l.weight_kg} kg</span>
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
