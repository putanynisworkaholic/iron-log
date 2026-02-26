import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "../hooks/useExercises";
import { CATEGORIES } from "../lib/seedData";

export default function AddExercise() {
  const navigate = useNavigate();
  const { addExercise } = useExercises();
  const [form, setForm] = useState({ name: "", category: "Push" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    const { error } = await addExercise({
      name: form.name.trim(),
      category: form.category,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-xxs tracking-widest text-gray-400 hover:text-black mb-6 flex items-center gap-2"
      >
        ← BACK
      </button>

      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide">ADD EXERCISE</h2>
        <p className="text-xxs tracking-[0.3em] text-gray-400 mt-1">BUILD YOUR DATABASE</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xxs tracking-widest text-gray-400 block mb-2">EXERCISE NAME</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Incline Dumbbell Press"
            required
            autoFocus
            className="w-full border-b-2 border-black py-2 text-sm focus:outline-none bg-transparent"
          />
        </div>

        <div>
          <label className="text-xxs tracking-widest text-gray-400 block mb-3">CATEGORY</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm(f => ({ ...f, category: cat }))}
                className={`py-3 border text-xs tracking-[0.2em] uppercase transition-colors ${
                  form.category === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 border border-red-200 p-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || !form.name.trim()}
          className="w-full py-3 bg-black text-white text-xs tracking-[0.3em] uppercase disabled:opacity-40 hover:bg-gray-900 transition-colors"
        >
          {saving ? "ADDING..." : "ADD EXERCISE"}
        </button>
      </form>
    </div>
  );
}
