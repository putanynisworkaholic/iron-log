import React, { useMemo } from "react";
import { useProgressData, useBodyWeight, useExercises } from "../hooks/useExercises";
import { formatDate, formatFullDate, calcPercentChange } from "../lib/utils";
import LineChart from "../components/LineChart";
import { DumbbellIcon, HeartPulseIcon, ScaleIcon, FlameIcon, TrophyIcon } from "../components/Icons";

function CountUp({ value, suffix = "" }) {
  return (
    <span className="count-up">{value}{suffix}</span>
  );
}

function StrengthCategoryCard({ category, logs }) {
  const totalVolume = logs.reduce((acc, l) =>
    acc + l.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);

  const chartData = useMemo(() => {
    const grouped = {};
    logs.forEach(l => {
      if (!grouped[l.date]) grouped[l.date] = 0;
      grouped[l.date] += l.sets.reduce((s, set) => s + set.weight * set.reps, 0);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([date, value]) => ({ label: formatDate(date), value }));
  }, [logs]);

  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const wa = weekAgo.toISOString().split("T")[0];
  const twa = twoWeeksAgo.toISOString().split("T")[0];

  const thisWeekVol = logs
    .filter(l => l.date >= wa)
    .reduce((acc, l) => acc + l.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
  const lastWeekVol = logs
    .filter(l => l.date >= twa && l.date < wa)
    .reduce((acc, l) => acc + l.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
  const change = calcPercentChange(thisWeekVol, lastWeekVol);

  const bestLifts = {};
  logs.forEach(l => {
    const name = l.exercise_name;
    if (!name) return;
    l.sets.forEach(s => {
      if (!bestLifts[name] || s.weight > bestLifts[name].weight) {
        bestLifts[name] = s;
      }
    });
  });

  return (
    <div className="mb-6 border border-gray-200 p-4 stagger-item">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-bold tracking-[0.3em] uppercase">{category}</h3>
        {change !== null && (
          <span className={`text-xs font-bold tracking-wide ${parseFloat(change) >= 0 ? "" : "text-gray-400"}`}>
            {parseFloat(change) >= 0 ? "+" : ""}{change}%
            <span className="text-[10px] text-gray-400 font-normal ml-1 tracking-widest">WoW</span>
          </span>
        )}
      </div>

      <div className="mb-4">
        <p className="text-[10px] tracking-widest text-gray-400 mb-1">TOTAL VOLUME</p>
        <p className="text-2xl font-bold">
          <CountUp value={totalVolume.toLocaleString()} />
          <span className="text-xs font-normal text-gray-400 ml-1">kg</span>
        </p>
      </div>

      {chartData.length >= 2 && (
        <div className="mb-4 border-t border-gray-100 pt-3">
          <p className="text-[10px] tracking-widest text-gray-400 mb-2">VOLUME PER SESSION</p>
          <LineChart data={chartData} height={70} />
        </div>
      )}

      {Object.keys(bestLifts).length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrophyIcon size={10} className="text-gray-400" />
            <p className="text-[10px] tracking-widest text-gray-400">BEST LIFTS</p>
          </div>
          <div className="space-y-1.5">
            {Object.entries(bestLifts)
              .sort(([, a], [, b]) => b.weight - a.weight)
              .slice(0, 5)
              .map(([name, s]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 truncate flex-1">{name}</span>
                  <span className="text-xs font-bold ml-3">{s.weight}kg × {s.reps}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Progress() {
  const { workoutLogs, cardioLogs, loading } = useProgressData();
  const { logs: bodyWeightLogs } = useBodyWeight();

  const today = formatFullDate();

  const byCategory = useMemo(() => {
    const map = {};
    workoutLogs.forEach(l => {
      const cat = l.category;
      if (!cat) return;
      if (!map[cat]) map[cat] = [];
      map[cat].push(l);
    });
    return map;
  }, [workoutLogs]);

  const totalSessions = useMemo(() => {
    const dates = new Set(workoutLogs.map(l => l.date));
    return dates.size;
  }, [workoutLogs]);

  const totalVolume = useMemo(() => {
    return workoutLogs.reduce((acc, l) =>
      acc + l.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
  }, [workoutLogs]);

  const totalCardioSessions = cardioLogs.length;
  const totalMinutes = cardioLogs.reduce((acc, l) => acc + l.duration_minutes, 0);
  const totalCalories = cardioLogs.reduce((acc, l) => acc + (l.calories || 0), 0);

  const cardioChartData = useMemo(() => {
    return [...cardioLogs]
      .reverse()
      .slice(-10)
      .map(l => ({ label: formatDate(l.date), value: l.duration_minutes }));
  }, [cardioLogs]);

  const bwChartData = useMemo(() => {
    return bodyWeightLogs.slice(-20).map(l => ({
      label: formatDate(l.date),
      value: parseFloat(l.weight_kg),
    }));
  }, [bodyWeightLogs]);

  const bfChartData = useMemo(() => {
    return bodyWeightLogs
      .filter(l => l.body_fat_percent != null)
      .slice(-20)
      .map(l => ({
        label: formatDate(l.date),
        value: parseFloat(l.body_fat_percent),
      }));
  }, [bodyWeightLogs]);

  const latestWeight = bodyWeightLogs.length > 0
    ? bodyWeightLogs[bodyWeightLogs.length - 1].weight_kg : null;
  const latestFat = bodyWeightLogs.length > 0
    ? bodyWeightLogs[bodyWeightLogs.length - 1].body_fat_percent : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[10px] tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide">PROGRESS</h2>
        <p className="text-[10px] tracking-[0.2em] text-gray-400 mt-1">{today}</p>
      </div>

      {/* Body Weight */}
      {bodyWeightLogs.length > 0 && (
        <div className="mb-8 border border-black p-4 stagger-item">
          <div className="flex items-center gap-2 mb-2">
            <ScaleIcon size={12} className="text-gray-400" />
            <p className="text-[10px] tracking-[0.3em] text-gray-400">BODY WEIGHT</p>
          </div>
          <div className="flex items-baseline gap-4 mb-3">
            <p className="text-3xl font-bold">
              <CountUp value={latestWeight} suffix="" />
              <span className="text-xs font-normal text-gray-400 ml-1">kg</span>
            </p>
            {latestFat != null && (
              <p className="text-lg font-bold text-gray-500">
                {latestFat}<span className="text-xs font-normal text-gray-400 ml-1">% bf</span>
              </p>
            )}
          </div>
          {bwChartData.length >= 2 && (
            <div className="mb-2">
              <p className="text-[10px] tracking-widest text-gray-400 mb-1">WEIGHT</p>
              <LineChart data={bwChartData} height={60} />
            </div>
          )}
          {bfChartData.length >= 2 && (
            <div>
              <p className="text-[10px] tracking-widest text-gray-400 mb-1 mt-3">BODY FAT %</p>
              <LineChart data={bfChartData} height={60} />
            </div>
          )}
        </div>
      )}

      {/* Strength */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4 border-b border-black pb-2">
          <DumbbellIcon size={12} className="text-black" />
          <p className="text-xs font-bold tracking-[0.3em]">STRENGTH</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-black p-4 stagger-item" style={{ animationDelay: "50ms" }}>
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">SESSIONS</p>
            <p className="text-3xl font-bold"><CountUp value={totalSessions} /></p>
          </div>
          <div className="border border-black p-4 stagger-item" style={{ animationDelay: "100ms" }}>
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">TOTAL VOLUME</p>
            <p className="text-3xl font-bold"><CountUp value={(totalVolume / 1000).toFixed(1)} /></p>
            <p className="text-[10px] text-gray-400">TONNES</p>
          </div>
        </div>

        {workoutLogs.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 mb-6">
            <p className="text-[10px] tracking-[0.3em] text-gray-300">NO STRENGTH DATA YET</p>
          </div>
        ) : (
          ["Push", "Pull", "Leg"].map(cat =>
            byCategory[cat] && byCategory[cat].length > 0 ? (
              <StrengthCategoryCard key={cat} category={cat} logs={byCategory[cat]} />
            ) : null
          )
        )}
      </div>

      {/* Cardio */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 border-b border-black pb-2">
          <HeartPulseIcon size={12} className="text-black" />
          <p className="text-xs font-bold tracking-[0.3em]">CARDIO</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="border border-black p-3 stagger-item">
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">SESSIONS</p>
            <p className="text-2xl font-bold"><CountUp value={totalCardioSessions} /></p>
          </div>
          <div className="border border-black p-3 stagger-item" style={{ animationDelay: "50ms" }}>
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">TOTAL MIN</p>
            <p className="text-2xl font-bold"><CountUp value={totalMinutes} /></p>
          </div>
          <div className="border border-black p-3 stagger-item" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-1 mb-1">
              <FlameIcon size={8} className="text-gray-400" />
              <p className="text-[10px] tracking-widest text-gray-400">KCAL</p>
            </div>
            <p className="text-2xl font-bold"><CountUp value={totalCalories} /></p>
          </div>
        </div>

        {cardioChartData.length >= 2 && (
          <div className="border border-gray-200 p-4 mb-4">
            <p className="text-[10px] tracking-widest text-gray-400 mb-2">DURATION TREND</p>
            <LineChart data={cardioChartData} height={70} />
          </div>
        )}

        {cardioLogs.length === 0 && (
          <div className="text-center py-8 border border-gray-200">
            <p className="text-[10px] tracking-[0.3em] text-gray-300">NO CARDIO DATA YET</p>
          </div>
        )}
      </div>
    </div>
  );
}
