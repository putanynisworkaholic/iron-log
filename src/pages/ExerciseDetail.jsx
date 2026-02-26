import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExercises, useExerciseHistory } from "../hooks/useExercises";
import { formatDate, randomFrom } from "../lib/utils";
import { FUNNY_MESSAGES } from "../lib/seedData";
import LineChart from "../components/LineChart";

function SetRow({ index, set, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
      <span className="text-xxs text-gray-400 w-4">{index + 1}</span>
      <div className="flex-1">
        <input
          type="number"
          step="0.5"
          value={set.weight}
          onChange={e => onChange(index, "weight", e.target.value)}
          placeholder="kg"
          className="w-full border-b border-gray-300 py-1 text-sm focus:outline-none focus:border-black bg-transparent text-center"
        />
        <p className="text-xxs text-center text-gray-300 tracking-widest">KG</p>
      </div>
      <div className="flex-1">
        <input
          type="number"
          value={set.reps}
          onChange={e => onChange(index, "reps", e.target.value)}
          placeholder="reps"
          className="w-full border-b border-gray-300 py-1 text-sm focus:outline-none focus:border-black bg-transparent text-center"
        />
        <p className="text-xxs text-center text-gray-300 tracking-widest">REPS</p>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="text-gray-300 hover:text-black text-xs w-6"
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
  const { history, loading, logSets } = useExerciseHistory(id);

  const exercise = exercises.find(ex => ex.id === id);

  const [targetWeight, setTargetWeight] = useState("");
  const [targetReps, setTargetReps] = useState("");
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Suggest target from last best set
  const lastSession = useMemo(() => {
    if (!history.length) return null;
    const grouped = {};
    history.forEach(s => {
      const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(s);
    });
    const dates = Object.keys(grouped).sort().reverse();
    return grouped[dates[0]] || null;
  }, [history]);

  const suggestion = useMemo(() => {
    if (!lastSession) return null;
    const best = lastSession.reduce((acc, s) => s.weight_kg > acc.weight_kg ? s : acc, lastSession[0]);
    return { weight: best.weight_kg, reps: best.reps };
  }, [lastSession]);

  // Chart data: volume per session
  const chartData = useMemo(() => {
    const grouped = {};
    history.forEach(s => {
      const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += s.weight_kg * s.reps;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([date, value]) => ({ label: formatDate(date), value }));
  }, [history]);

  const handleAddSet = () => setSets(s => [...s, { weight: sets[sets.length - 1]?.weight || "", reps: "" }]);
  const handleRemoveSet = (i) => setSets(s => s.filter((_, idx) => idx !== i));
  const handleSetChange = (i, field, value) => {
    setSets(s => s.map((set, idx) => idx === i ? { ...set, [field]: value } : set));
  };

  const handleUseSuggestion = () => {
    if (!suggestion) return;
    setTargetWeight(String(suggestion.weight));
    setTargetReps(String(suggestion.reps));
    setSets(lastSession.map(s => ({ weight: String(s.weight_kg), reps: String(s.reps) })));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validSets = sets.filter(s => s.weight && s.reps);
    if (!validSets.length) return;
    setSaving(true);
    const { error } = await logSets(validSets, targetWeight, targetReps);
    setSaving(false);
    if (!error) {
      setMessage(randomFrom(FUNNY_MESSAGES));
      setSets([{ weight: "", reps: "" }]);
      setShowForm(false);
    }
  };

  if (!exercise) {
    return (
      <div className="text-center py-20 text-xxs tracking-widest text-gray-400">
        EXERCISE NOT FOUND
      </div>
    );
  }

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-xxs tracking-widest text-gray-400 hover:text-black mb-6 flex items-center gap-2"
      >
        ← BACK
      </button>

      {/* Title */}
      <div className="mb-6">
        <p className="text-xxs tracking-[0.3em] text-gray-400 mb-1">{exercise.category.toUpperCase()}</p>
        <h2 className="text-xl font-bold tracking-wide">{exercise.name.toUpperCase()}</h2>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-6 p-4 border-2 border-black">
          <p className="text-xs tracking-wide leading-relaxed font-mono">{message}</p>
        </div>
      )}

      {/* Chart */}
      {chartData.length >= 2 && (
        <div className="mb-6">
          <p className="text-xxs tracking-[0.3em] text-gray-400 mb-2">VOLUME TREND</p>
          <div className="border border-gray-100 p-2">
            <LineChart data={chartData} />
          </div>
        </div>
      )}

      {/* Try section */}
      <div className="mb-6 border border-black p-4">
        <p className="text-xxs tracking-[0.3em] text-gray-400 mb-3">TRY TODAY</p>

        {suggestion && (
          <button
            onClick={handleUseSuggestion}
            className="w-full flex items-center justify-between py-2 border-b border-gray-100 mb-3 hover:bg-gray-50"
          >
            <span className="text-xs text-gray-500 tracking-wide">LAST SESSION</span>
            <span className="text-sm font-bold">
              {suggestion.weight}kg × {suggestion.reps}
            </span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xxs tracking-widest text-gray-400 block mb-1">TARGET KG</label>
            <input
              type="number"
              step="0.5"
              value={targetWeight}
              onChange={e => setTargetWeight(e.target.value)}
              placeholder={suggestion?.weight || "0"}
              className="w-full border-b border-black py-1 text-sm focus:outline-none bg-transparent"
            />
          </div>
          <div>
            <label className="text-xxs tracking-widest text-gray-400 block mb-1">TARGET REPS</label>
            <input
              type="number"
              value={targetReps}
              onChange={e => setTargetReps(e.target.value)}
              placeholder={suggestion?.reps || "0"}
              className="w-full border-b border-black py-1 text-sm focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <button
          onClick={() => setShowForm(o => !o)}
          className="w-full py-2 border border-black text-xs tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          {showForm ? "HIDE FORM" : "LOG SETS"}
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6">
          <p className="text-xxs tracking-[0.3em] text-gray-400 mb-3">SETS COMPLETED</p>

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
            className="w-full py-2 border border-dashed border-gray-300 text-xs tracking-widest text-gray-400 hover:border-black hover:text-black transition-colors mt-2 mb-4"
          >
            + ADD SET
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE SESSION"}
          </button>
        </form>
      )}

      {/* History */}
      <div>
        <p className="text-xxs tracking-[0.3em] text-gray-400 mb-3">HISTORY</p>
        {loading ? (
          <p className="text-xxs text-gray-300 tracking-widest text-center py-4">LOADING...</p>
        ) : history.length === 0 ? (
          <p className="text-xxs text-gray-300 tracking-widest text-center py-4">NO HISTORY YET</p>
        ) : (
          (() => {
            // Group by session date
            const grouped = {};
            history.forEach(s => {
              const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
              if (!grouped[date]) grouped[date] = [];
              grouped[date].push(s);
            });
            return Object.entries(grouped)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 8)
              .map(([date, sets]) => (
                <div key={date} className="mb-4 border-b border-gray-100 pb-3">
                  <p className="text-xxs text-gray-400 tracking-widest mb-2">{formatDate(date)}</p>
                  <div className="flex flex-wrap gap-2">
                    {sets.map(s => (
                      <div key={s.id} className="border border-gray-200 px-2 py-1">
                        <span className="text-sm font-bold">{s.weight_kg}</span>
                        <span className="text-xxs text-gray-400"> kg × </span>
                        <span className="text-sm font-bold">{s.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ));
          })()
        )}
      </div>
    </div>
  );
}
