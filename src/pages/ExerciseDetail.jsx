import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExercises, useExerciseHistory } from "../hooks/useExercises";
import { formatDate, randomFrom } from "../lib/utils";
import { FUNNY_MESSAGES } from "../lib/seedData";
import LineChart from "../components/LineChart";
import Collapse from "../components/Collapse";

function SetRow({ index, set, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
      <span className="text-[10px] text-gray-400 w-5 text-center">{index + 1}</span>
      <div className="flex-1">
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          value={set.weight}
          onChange={e => onChange(index, "weight", e.target.value)}
          placeholder="kg"
          className="w-full border-b border-gray-300 py-1.5 text-base focus:outline-none focus:border-black bg-transparent text-center"
        />
        <p className="text-[10px] text-center text-gray-300 tracking-widest mt-0.5">KG</p>
      </div>
      <div className="flex-1">
        <input
          type="number"
          inputMode="numeric"
          value={set.reps}
          onChange={e => onChange(index, "reps", e.target.value)}
          placeholder="reps"
          className="w-full border-b border-gray-300 py-1.5 text-base focus:outline-none focus:border-black bg-transparent text-center"
        />
        <p className="text-[10px] text-center text-gray-300 tracking-widest mt-0.5">REPS</p>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="text-gray-300 active:text-black text-base w-8 h-8 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exercises } = useExercises();
  const { history, logSets } = useExerciseHistory(id);

  const exercise = exercises.find(ex => ex.id === id);

  const [targetWeight, setTargetWeight] = useState("");
  const [targetReps, setTargetReps] = useState("");
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Last session data
  const lastSession = useMemo(() => {
    if (!history.length) return null;
    return history[0]; // Already sorted by date desc
  }, [history]);

  const suggestion = useMemo(() => {
    if (!lastSession) return null;
    const best = lastSession.sets.reduce((acc, s) =>
      s.weight > acc.weight ? s : acc, lastSession.sets[0]);
    return { weight: best.weight, reps: best.reps };
  }, [lastSession]);

  // Chart data: max weight per session over time
  const chartData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-12)
      .map(log => ({
        label: formatDate(log.date),
        value: log.sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
      }));
  }, [history]);

  const handleAddSet = () => setSets(s => [...s, { weight: sets[sets.length - 1]?.weight || "", reps: "" }]);
  const handleRemoveSet = (i) => setSets(s => s.length > 1 ? s.filter((_, idx) => idx !== i) : s);
  const handleSetChange = (i, field, value) => {
    setSets(s => s.map((set, idx) => idx === i ? { ...set, [field]: value } : set));
  };

  const handleUseSuggestion = () => {
    if (!lastSession) return;
    setTargetWeight(String(suggestion.weight));
    setTargetReps(String(suggestion.reps));
    setSets(lastSession.sets.map(s => ({ weight: String(s.weight), reps: String(s.reps) })));
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = logSets(sets, targetWeight, targetReps);
    setSaving(false);
    if (!error) {
      setMessage(randomFrom(FUNNY_MESSAGES));
      setSets([{ weight: "", reps: "" }]);
      setShowForm(false);
    }
  };

  if (!exercise) {
    return (
      <div className="text-center py-20 text-[10px] tracking-widest text-gray-400">
        EXERCISE NOT FOUND
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-[10px] tracking-widest text-gray-400 active:text-black mb-6 flex items-center gap-2 py-2"
      >
        ← BACK
      </button>

      {/* Title */}
      <div className="mb-6">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">{exercise.category.toUpperCase()}</p>
        <h2 className="text-xl font-bold tracking-wide">{exercise.name.toUpperCase()}</h2>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-6 p-4 border-2 border-black fade-in">
          <p className="text-xs tracking-wide leading-relaxed font-mono">{message}</p>
        </div>
      )}

      {/* Chart */}
      {chartData.length >= 2 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-2">VOLUME TREND</p>
          <div className="border border-gray-100 p-2">
            <LineChart data={chartData} />
          </div>
        </div>
      )}

      {/* Try section */}
      <div className="mb-6 border border-black p-4">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3">TRY TODAY</p>

        {suggestion && (
          <button
            onClick={handleUseSuggestion}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100 mb-3 active:bg-gray-50 transition-colors"
          >
            <span className="text-xs text-gray-500 tracking-wide">LAST SESSION</span>
            <span className="text-sm font-bold">{suggestion.weight}kg × {suggestion.reps}</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] tracking-widest text-gray-400 block mb-1">TARGET KG</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.5"
              value={targetWeight}
              onChange={e => setTargetWeight(e.target.value)}
              placeholder={suggestion?.weight || "0"}
              className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-widest text-gray-400 block mb-1">TARGET REPS</label>
            <input
              type="number"
              inputMode="numeric"
              value={targetReps}
              onChange={e => setTargetReps(e.target.value)}
              placeholder={suggestion?.reps || "0"}
              className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <button
          onClick={() => setShowForm(o => !o)}
          className="w-full py-3 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors"
        >
          {showForm ? "HIDE FORM" : "LOG SETS"}
        </button>
      </div>

      {/* Log form */}
      <Collapse open={showForm}>
        <form onSubmit={handleSubmit} className="mb-6 fade-in">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3">SETS COMPLETED</p>

          {sets.map((set, i) => (
            <SetRow
              key={i}
              index={i}
              set={set}
              onChange={handleSetChange}
              onRemove={handleRemoveSet}
            />
          ))}

          <button
            type="button"
            onClick={handleAddSet}
            className="w-full py-3 border border-dashed border-gray-300 text-xs tracking-widest text-gray-400 active:border-black active:text-black transition-colors mt-2 mb-4"
          >
            + ADD SET
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE SESSION"}
          </button>
        </form>
      </Collapse>

      {/* History */}
      <div>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3">HISTORY</p>
        {history.length === 0 ? (
          <p className="text-[10px] text-gray-300 tracking-widest text-center py-6">NO HISTORY YET</p>
        ) : (
          history.slice(0, 10).map(log => (
            <div key={log.id} className="mb-4 border-b border-gray-100 pb-3">
              <p className="text-[10px] text-gray-400 tracking-widest mb-2">{formatDate(log.date)}</p>
              <div className="flex flex-wrap gap-2">
                {log.sets.map((s, i) => (
                  <div key={i} className="border border-gray-200 px-2.5 py-1.5">
                    <span className="text-sm font-bold">{s.weight}</span>
                    <span className="text-[10px] text-gray-400"> kg × </span>
                    <span className="text-sm font-bold">{s.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
