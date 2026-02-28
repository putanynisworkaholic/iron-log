import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useCheatDays() {
  const { userId } = useAuth();
  const [cheatDays, setCheatDays] = useState([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("cheat_days")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(200);
      setCheatDays(data || []);
    })();
  }, [userId]);

  const logCheatDay = useCallback(async (selections) => {
    if (!userId || !selections.length) return;
    const today = new Date().toISOString().split("T")[0];

    // Upsert: update if already confessed today
    const { data: existing } = await supabase
      .from("cheat_days")
      .select("id, selections")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      // Merge new selections with existing (append-only, deduped)
      const merged = [...new Set([...existing.selections, ...selections])];
      await supabase.from("cheat_days")
        .update({ selections: merged })
        .eq("id", existing.id);
    } else {
      await supabase.from("cheat_days")
        .insert({ user_id: userId, date: today, selections });
    }

    // Refetch
    const { data } = await supabase
      .from("cheat_days")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(200);
    setCheatDays(data || []);
  }, [userId]);

  return { cheatDays, logCheatDay };
}
