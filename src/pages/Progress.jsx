import React, { useMemo } from "react";
import { useProgressData, useBodyWeight } from "../hooks/useExercises";
import { useCheatDays } from "../hooks/useCheatDays";
import { useProfile } from "../hooks/useProfile";
import { formatDate, formatFullDate, calcPercentChange } from "../lib/utils";
import LineChart from "../components/LineChart";
import { DumbbellIcon, HeartPulseIcon, ScaleIcon, FlameIcon, TrophyIcon, DevilIcon } from "../components/Icons";

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

const CHEAT_LABELS = {
  skipped_training: "Skip Training",
  skipped_cardio:   "Skip Cardio",
  junk_food:        "Junk Food",
  too_lazy:         "Too Lazy",
  alcohol:          "Alcohol",
  smoking:          "Smoking",
  late_night:       "Late Night",
  no_water:         "No Water",
};

function getStrengthPraise(workoutLogs, name) {
  if (workoutLogs.length === 0) return null;
  const now = new Date();
  const wa = new Date(now); wa.setDate(wa.getDate() - 7);
  const waStr = wa.toISOString().split("T")[0];
  const thisWeekDates = new Set(workoutLogs.filter(l => l.date >= waStr).map(l => l.date));
  const sessions = thisWeekDates.size;
  if (sessions >= 5) return `${sessions} sessions this week. ${name} is built different.`;
  if (sessions >= 3) return `Solid week — ${sessions} sessions logged and counting.`;
  if (sessions >= 1) return `${sessions === 1 ? "One session" : `${sessions} sessions`} in. Every rep counts.`;
  return `Numbers are waiting. Show up.`;
}

function getCardioPraise(cardioLogs, name) {
  if (cardioLogs.length === 0) return null;
  const now = new Date();
  const wa = new Date(now); wa.setDate(wa.getDate() - 7);
  const waStr = wa.toISOString().split("T")[0];
  const thisWeek = cardioLogs.filter(l => l.date >= waStr);
  const minutes = thisWeek.reduce((acc, l) => acc + l.duration_minutes, 0);
  if (minutes >= 150) return `${minutes} min this week. Cardio goals: crushed.`;
  if (minutes >= 90) return `${minutes} minutes this week. Heart is happy.`;
  if (minutes > 0) return `Movement is medicine. ${minutes} min this week — keep going.`;
  return `Cardio's calling. Your heart will thank you.`;
}

function getCheatRoast(breakdown, name) {
  const top = Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0];
  if (!top) return null;
  const [worst, count] = top;
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  if (total >= 20) return `${name}, you need an intervention. We're concerned 🚨`;
  if (total >= 10) return `${name} has been a menace this month 💀`;
  if (total >= 5)  return `${name}, we've noticed a pattern here 👀`;

  if (worst === "skipped_training") return `Skipped training ${count}x this month. The iron remembers 🏋️`;
  if (worst === "skipped_cardio")   return `${count}x no cardio. Heart rate? We have questions 📉`;
  if (worst === "junk_food")        return `Junk food ${count}x — you are what you eat 🍔`;
  if (worst === "too_lazy")         return `Lazy mode activated ${count}x this month 🛏️`;
  if (worst === "alcohol")          return `${count} alcohol entries. Your liver is filing paperwork 📋`;
  if (worst === "smoking")          return `${count}x smoking logged. Your lungs want a word 🚬`;
  return `${total} total cheats logged. At least you're honest 😏`;
}

export default function Progress() {
  const { workoutLogs, cardioLogs, loading } = useProgressData();
  const { logs: bodyWeightLogs } = useBodyWeight();
  const { cheatDays } = useCheatDays();
  const { profile } = useProfile();

  const today = formatFullDate();
  const userName = profile?.name?.toUpperCase() || "You";

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

  // Cheat stats — this month
  const cheatStats = useMemo(() => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const thisMonth = cheatDays.filter(c => c.date.startsWith(monthStr));
    const breakdown = {};
    thisMonth.forEach(c => {
      c.selections.forEach(sel => {
        breakdown[sel] = (breakdown[sel] || 0) + 1;
      });
    });
    return { totalDays: thisMonth.length, breakdown };
  }, [cheatDays]);

  const cheatRoast = useMemo(
    () => cheatStats.totalDays > 0 ? getCheatRoast(cheatStats.breakdown, userName) : null,
    [cheatStats, userName]
  );

  const strengthPraise = useMemo(
    () => getStrengthPraise(workoutLogs, userName),
    [workoutLogs, userName]
  );

  const cardioPraise = useMemo(
    () => getCardioPraise(cardioLogs, userName),
    [cardioLogs, userName]
  );

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
      <div className="mb-6">
        <div className="border-b border-black pb-2 mb-4">
          <div className="flex items-center gap-2">
            <DumbbellIcon size={12} className="text-black" />
            <p className="text-xs font-bold tracking-[0.3em]">STRENGTH</p>
          </div>
          {strengthPraise && (
            <p className="text-[12px] text-gray-400 italic mt-1">{strengthPraise}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-black p-4 stagger-item" style={{ "--i": 1 }}>
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">SESSIONS</p>
            <p className="text-3xl font-bold"><CountUp value={totalSessions} /></p>
          </div>
          <div className="border border-black p-4 stagger-item" style={{ "--i": 2 }}>
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
        <div className="border-b border-black pb-2 mb-4">
          <div className="flex items-center gap-2">
            <HeartPulseIcon size={12} className="text-black" />
            <p className="text-xs font-bold tracking-[0.3em]">CARDIO</p>
          </div>
          {cardioPraise && (
            <p className="text-[12px] text-gray-400 italic mt-1">{cardioPraise}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="border border-black p-3 stagger-item">
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">SESSIONS</p>
            <p className="text-2xl font-bold"><CountUp value={totalCardioSessions} /></p>
          </div>
          <div className="border border-black p-3 stagger-item" style={{ "--i": 1 }}>
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">TOTAL MIN</p>
            <p className="text-2xl font-bold"><CountUp value={totalMinutes} /></p>
          </div>
          <div className="border border-black p-3 stagger-item" style={{ "--i": 2 }}>
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

      {/* Cheat Statistics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 border-b border-black pb-2">
          <DevilIcon size={12} className="calendar-cheat" />
          <p className="text-xs font-bold tracking-[0.3em]">CHEAT</p>
        </div>

        {cheatStats.totalDays === 0 ? (
          <div className="text-center py-8 border border-gray-200">
            <p className="text-[10px] tracking-[0.3em] text-gray-300">NO CHEATS THIS MONTH</p>
            <p className="text-[10px] text-gray-300 mt-1">Clean streak 💪</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-black p-4 stagger-item">
                <p className="text-[10px] tracking-widest text-gray-400 mb-1">CHEAT DAYS</p>
                <p className="text-3xl font-bold"><CountUp value={cheatStats.totalDays} /></p>
                <p className="text-[10px] text-gray-400">THIS MONTH</p>
              </div>
              <div className="border border-black p-4 stagger-item" style={{ "--i": 1 }}>
                <p className="text-[10px] tracking-widest text-gray-400 mb-1">MOST COMMON</p>
                {Object.keys(cheatStats.breakdown).length > 0 && (
                  <>
                    <p className="text-sm font-bold leading-tight mt-1">
                      {CHEAT_LABELS[Object.entries(cheatStats.breakdown).sort(([, a], [, b]) => b - a)[0][0]] || "—"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {Object.entries(cheatStats.breakdown).sort(([, a], [, b]) => b - a)[0][1]}× logged
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="border border-gray-200 p-4 mb-4">
              <p className="text-[10px] tracking-widest text-gray-400 mb-3">BREAKDOWN</p>
              <div className="space-y-2">
                {Object.entries(cheatStats.breakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{CHEAT_LABELS[type] || type}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-gray-200 overflow-hidden" style={{ width: "60px" }}>
                          <div
                            className="h-full calendar-cheat-bg"
                            style={{
                              width: `${Math.min(100, (count / cheatStats.totalDays) * 100)}%`,
                              backgroundColor: "var(--t-cheat)",
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold w-6 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Roast message */}
            {cheatRoast && (
              <div className="p-4 border border-gray-200 bg-gray-50">
                <p className="text-xs tracking-wide leading-relaxed text-center">{cheatRoast}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
