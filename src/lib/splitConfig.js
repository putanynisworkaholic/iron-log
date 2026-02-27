export const SPLIT_TYPES = [
  {
    id: "PPL",
    label: "PPL",
    desc: "Push / Pull / Leg — 3 days",
    sections: ["Push", "Pull", "Leg"],
  },
  {
    id: "Upper/Lower",
    label: "UPPER / LOWER",
    desc: "Upper / Lower — 4 days",
    sections: ["Upper", "Lower"],
  },
  {
    id: "Full Body",
    label: "FULL BODY",
    desc: "3 days a week",
    sections: ["Full Body"],
  },
  {
    id: "Bro Split",
    label: "BRO SPLIT",
    desc: "Chest / Back / Shoulders / Arms / Legs",
    sections: ["Chest", "Back", "Shoulders", "Arms", "Legs"],
  },
  {
    id: "PPLUL",
    label: "PPLUL",
    desc: "Push / Pull / Leg / Upper / Lower — 5 days",
    sections: ["Push", "Pull", "Leg", "Upper", "Lower"],
  },
  {
    id: "Custom",
    label: "CUSTOM",
    desc: "Define your own split days",
    sections: null,
  },
  {
    id: "Day Split",
    label: "DAY SPLIT",
    desc: "Assign exercises to each day of the week",
    sections: null,
  },
];

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Map muscle group → suggested category for a given split
export function suggestCategory(splitId, muscleGroup) {
  if (splitId === "Full Body") return "Full Body";
  const MAP = {
    PPL: {
      Chest: "Push", Shoulders: "Push", Triceps: "Push", Arms: "Push",
      Back: "Pull", Biceps: "Pull",
      Legs: "Leg", Glutes: "Leg", Core: "Push",
    },
    "Upper/Lower": {
      Chest: "Upper", Back: "Upper", Shoulders: "Upper",
      Arms: "Upper", Biceps: "Upper", Triceps: "Upper", Core: "Upper",
      Legs: "Lower", Glutes: "Lower",
    },
    "Bro Split": {
      Chest: "Chest", Back: "Back", Shoulders: "Shoulders",
      Arms: "Arms", Biceps: "Arms", Triceps: "Arms",
      Legs: "Legs", Glutes: "Legs", Core: "Core",
    },
    PPLUL: {
      Chest: "Push", Shoulders: "Push", Triceps: "Push", Arms: "Push",
      Back: "Pull", Biceps: "Pull",
      Legs: "Leg", Glutes: "Leg", Core: "Upper",
    },
  };
  return MAP[splitId]?.[muscleGroup] || muscleGroup;
}
