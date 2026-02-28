import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import { EXERCISE_LIBRARY } from "../lib/exerciseLibrary";
import { SPLIT_TYPES, DAY_NAMES, suggestCategory } from "../lib/splitConfig";
import Collapse from "../components/Collapse";

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

function CategoryPicker({ split, profile, muscleGroup, value, onChange }) {
  if (split === "Day Split") {
    return (
      <div>
        <label className="text-[10px] tracking-widest text-gray-400 block mb-2">ASSIGN TO DAY</label>
        <div className="grid grid-cols-4 gap-1.5">
          {DAY_NAMES.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => onChange(day)}
              className={`py-2 border text-[10px] tracking-wide transition-colors
                ${value === day ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
            >
              {day.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const splitDef = SPLIT_TYPES.find(s => s.id === split);
  let options = splitDef?.sections || [];

  if (split === "Custom") {
    options = profile?.customDays || [];
  }

  if (options.length === 0) {
    return (
      <div>
        <label className="text-[10px] tracking-widest text-gray-400 block mb-2">CATEGORY</label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. Push, Pull, Leg..."
          className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-[10px] tracking-widest text-gray-400 block mb-2">ASSIGN TO</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`py-2.5 border text-[10px] tracking-wide transition-colors
              ${value === opt ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AddExercise() {
  const navigate = useNavigate();
  const { addExercise } = useExercises();
  const { profile, assignExerciseToDay } = useProfile();

  const split = profile?.split || "PPL";

  const [tab, setTab] = useState("library"); // "library" | "custom"
  const [openGroup, setOpenGroup] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [category, setCategory] = useState(() => {
    const splitDef = SPLIT_TYPES.find(s => s.id === split);
    return splitDef?.sections?.[0] || "";
  });
  const [customName, setCustomName] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePickFromLibrary = (group, name) => {
    setSelectedName(name);
    setSelectedGroup(group);
    const suggested = suggestCategory(split, group);
    setCategory(suggested);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = tab === "library" ? selectedName : customName;
    if (!name.trim() || !category) return;

    setSaving(true);

    // For Day Split: category = muscle group, and we also assign to daySplit[day]
    const dbCategory = split === "Day Split" ? (selectedGroup || name) : category;

    const { data, error } = await addExercise({ name: name.trim(), category: dbCategory });

    if (!error && data) {
      if (split === "Day Split" && category) {
        assignExerciseToDay(category, data.id);
      }
      navigate("/");
    }
    setSaving(false);
  };

  const canSubmit = tab === "library" ? (selectedName && category) : (customName.trim() && category);

  return (
    <div className="fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-[10px] tracking-widest text-gray-400 active:text-black mb-6 flex items-center gap-2 py-2"
      >
        ← BACK
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-wide">ADD EXERCISE</h2>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">
          SPLIT: {split.toUpperCase()}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black mb-6">
        {["library", "custom"].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedName(""); setCustomName(""); }}
            className={`flex-1 py-2.5 text-xs tracking-widest transition-colors
              ${tab === t ? "border-b-2 border-black font-bold" : "text-gray-400"}`}
          >
            {t === "library" ? "FROM LIBRARY" : "CUSTOM NAME"}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="space-y-6">
        {/* Library picker */}
        {tab === "library" && (
          <div>
            {selectedName ? (
              <div className="flex items-center justify-between p-3 border border-black mb-2">
                <span className="text-sm font-bold tracking-wide">{selectedName}</span>
                <button
                  type="button"
                  onClick={() => setSelectedName("")}
                  className="text-gray-400 active:text-black text-base"
                >
                  ×
                </button>
              </div>
            ) : (
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-3">MUSCLE GROUP</label>
                {EXERCISE_LIBRARY.map(({ group, exercises }) => (
                  <div key={group} className="border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(openGroup === group ? null : group)}
                      className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs font-bold tracking-[0.2em]">{group.toUpperCase()}</span>
                      <span className="text-xs text-gray-400">{openGroup === group ? "−" : "+"}</span>
                    </button>
                    <Collapse open={openGroup === group}>
                      <div className="pb-2">
                        {exercises.map(name => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => handlePickFromLibrary(group, name)}
                            className="w-full text-left py-2.5 pl-3 text-sm tracking-wide border-b border-gray-50 active:bg-gray-50 transition-colors"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom name */}
        {tab === "custom" && (
          <div>
            <label className="text-[10px] tracking-widest text-gray-400 block mb-2">EXERCISE NAME</label>
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(toTitleCase(e.target.value))}
              placeholder="e.g. Incline Dumbbell Press"
              autoFocus
              className="w-full border-b-2 border-black py-2.5 text-base focus:outline-none bg-transparent"
            />
          </div>
        )}

        {/* Category / Day picker */}
        {(selectedName || customName.trim()) && (
          <CategoryPicker
            split={split}
            profile={profile}
            muscleGroup={selectedGroup}
            value={category}
            onChange={setCategory}
          />
        )}

        <button
          type="submit"
          disabled={saving || !canSubmit}
          className="w-full py-3.5 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-40"
        >
          {saving ? "ADDING..." : "ADD EXERCISE"}
        </button>
      </form>
    </div>
  );
}
