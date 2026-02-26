import React, { useMemo } from "react";
import { useProgressData } from "../hooks/useExercises";
import { formatDate, calcPercentChange } from "../lib/utils";
import LineChart from "../components/LineChart";

function CategoryCard({ category, sets }) {
  const totalVolume = sets.reduce((acc, s) => acc + s.weight_kg * s.reps, 0);

  // Group by session date for chart
  const chartData = useMemo(() => {
    const grouped = {};
    sets.forEach(s => {
      const date = s.workout_sessions?.date;
      if (!date) return;
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += s.weight_kg * s.reps;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([date, value]) => ({ label: formatDate(date), value }));
  }, [sets]);

  // Week over week
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeekVol = sets
    .filter(s => s.workout_sessions?.date && new Date(s.workout_sessions.date) >= weekAgo)
    .reduce((acc, s) => acc + s.weight_kg * s.reps, 0);

  const lastWeekVol = sets
    .filter(s => {
      const d = s.workout_sessions?.date && new Date(s.workout_sessions.date);
      return d && d >= twoWeeksAgo && d < weekAgo;
    })
    .reduce((acc, s) => acc + s.weight_kg * s.reps, 0);

  const change = calcPercentChange(thisWeekVol, lastWeekVol);

  // Most recent PR per exercise
  const byExercise = {};
  sets.forEach(s => {
    const name = s.exercises?.name;
    if (!name) return;
    if (!byExercise[name] || s.weight_kg > byExercise[name].weight_kg) {
      byExercise[name] = s;
    }
  });

  return (
    <div className="mb-8 border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-bold tracking-[0.3em] uppercase">{category}</h3>
        {change !== null && (
          <span className={`text-xs font-bold tracking-wide ${parseFloat(change) >= 0 ? "" : "text-gray-400"}`}>
            {parseFloat(change) >= 0 ? "+" : ""}{change}%
            <span className="text-xxs text-gray-400 font-normal ml-1 tracking-widest">WoW</span>
          </span>
        )}
      </div>

      {/* Volume stat */}
      <div className="mb-4">
        <p className="text-xxs tracking-widest text-gray-400 mb-1">TOTAL VOLUME (ALL TIME)</p>
        <p className="text-2xl font-bold">
          {totalVolume.toLocaleString()}
          <span className="text-xs font-normal text-gray-400 ml-1">kg</span>
        </p>
      </div>

      {/* Chart */}
      {chartData.length >= 2 && (
        <div className="mb-4 border-t border-gray-100 pt-3">
          <p className="text-xxs tracking-widest text-gray-400 mb-2">VOLUME PER SESSION</p>
          <LineChart data={chartData} height={70} />
        </div>
      )}

      {/* PRs */}
      {Object.keys(byExercise).length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xxs tracking-widest text-gray-400 mb-2">BEST LIFTS</p>
          <div className="space-y-1">
            {Object.entries(byExercise)
              .sort(([, a], [, b]) => b.weight_kg - a.weight_kg)
              .slice(0, 5)
              .map(([name, s]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 truncate flex-1">{name}</span>
                  <span className="text-xs font-bold ml-3">
                    {s.weight_kg}kg × {s.reps}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Progress() {
  const { data, loading } = useProgressData();

  const byCategory = useMemo(() => {
    const map = {};
    data.forEach(s => {
      const cat = s.exercises?.category;
      if (!cat) return;
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return map;
  }, [data]);

  // Overall stats
  const totalSessions = useMemo(() => {
    const sessions = new Set(data.map(s => s.session_id).filter(Boolean));
    return sessions.size;
  }, [data]);

  const totalVolume = useMemo(() => {
    return data.reduce((acc, s) => acc + s.weight_kg * s.reps, 0);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xxs tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide">PROGRESS</h2>
        <p className="text-xxs tracking-[0.3em] text-gray-400 mt-1">THE NUMBERS DON'T LIE</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="border border-black p-4">
          <p className="text-xxs tracking-widest text-gray-400 mb-1">SESSIONS</p>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </div>
        <div className="border border-black p-4">
          <p className="text-xxs tracking-widest text-gray-400 mb-1">TOTAL VOLUME</p>
          <p className="text-3xl font-bold">{(totalVolume / 1000).toFixed(1)}</p>
          <p className="text-xxs text-gray-400">TONNES</p>
        </div>
      </div>

      {/* By category */}
      {data.length === 0 ? (
        <div className="text-center py-12 border border-gray-200">
          <p className="text-xxs tracking-[0.3em] text-gray-300">NO DATA YET</p>
          <p className="text-xxs tracking-[0.3em] text-gray-300 mt-1">START LOGGING SESSIONS</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, sets]) => (
          <CategoryCard key={cat} category={cat} sets={sets} />
        ))
      )}
    </div>
  );
}
