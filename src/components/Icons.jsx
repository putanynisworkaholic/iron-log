import React from "react";

export function DumbbellIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6.5 6.5h11M6.5 17.5h11" />
      <rect x="2" y="4" width="4" height="16" rx="1" />
      <rect x="18" y="4" width="4" height="16" rx="1" />
      <line x1="12" y1="6.5" x2="12" y2="17.5" />
    </svg>
  );
}

export function BarbellIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="2" y1="12" x2="22" y2="12" />
      <rect x="4" y="7" width="3" height="10" rx="0.5" />
      <rect x="17" y="7" width="3" height="10" rx="0.5" />
      <rect x="1" y="9" width="2" height="6" rx="0.5" />
      <rect x="21" y="9" width="2" height="6" rx="0.5" />
    </svg>
  );
}

export function HeartPulseIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5.09C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z" />
      <polyline points="4,13 9,13 10,10 12,16 14,12 15,13 20,13" />
    </svg>
  );
}

export function ScaleIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 7v4" />
      <path d="M8 16a4 4 0 0 1 8 0" />
      <circle cx="12" cy="11" r="1" />
    </svg>
  );
}

export function FlameIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C8 7 4 10 4 14a8 8 0 0 0 16 0c0-4-4-7-8-12Z" />
      <path d="M12 22c-2.2 0-4-1.8-4-4 0-2 2-3.5 4-6 2 2.5 4 4 4 6 0 2.2-1.8 4-4 4Z" />
    </svg>
  );
}

export function TrophyIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2h12v6a6 6 0 0 1-12 0V2Z" />
      <path d="M6 4H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4" />
      <path d="M18 4h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <path d="M8 18h8a1 1 0 0 1 1 1v1H7v-1a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function LegIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3C12 3 10 8 10 12C10 15 9 18 7 21" />
      <path d="M12 3C12 3 14 8 14 12C14 15 15 18 17 21" />
      <path d="M5 21h4M15 21h4" />
    </svg>
  );
}

export function TimerIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="13" r="8" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="13" x2="15" y2="13" />
      <line x1="10" y1="2" x2="14" y2="2" />
      <line x1="12" y1="2" x2="12" y2="5" />
    </svg>
  );
}

export function CalendarIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function SettingsIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function TrashIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function UserIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Cardio Type Icons ───────────────────────────────────── */

export function RunningIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* head */}
      <circle cx="14" cy="3.5" r="1.5" />
      {/* torso + arms */}
      <path d="M12 7l-3 5M12 7l2 4" />
      {/* legs */}
      <path d="M9 12l-3 6M14 11l2 7" />
      {/* foot kick-back */}
      <path d="M6 18l2 2M16 18h3" />
    </svg>
  );
}

export function WalkingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* head */}
      <circle cx="12" cy="3.5" r="1.5" />
      {/* body */}
      <path d="M12 5.5l-1 6" />
      {/* arms */}
      <path d="M8 9l3-1M11 10l4-1" />
      {/* legs */}
      <path d="M11 11.5l-2 7M11 11.5l3 5" />
      {/* feet */}
      <path d="M7 20l2-1M14 16.5l3 2" />
    </svg>
  );
}

export function EllipticalIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <path d="M12 7v10M3 12h18" strokeDasharray="3 2" />
      <circle cx="12" cy="7" r="1.5" />
    </svg>
  );
}

export function SwimmingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* head */}
      <circle cx="4" cy="10" r="1.5" />
      {/* body + arms */}
      <path d="M5.5 10l5 2 5-3 4 1" />
      {/* legs */}
      <path d="M10.5 12l3 3M15.5 9l3 5" />
      {/* water waves */}
      <path d="M2 18c2-2 4 0 6-2s4 0 6-2 4 0 6-2" />
    </svg>
  );
}

export function PaletteIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M12 21a3 3 0 0 1 0-6h3a3 3 0 0 0 3-3" />
    </svg>
  );
}

export function PlusIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ─── Icon Maps ───────────────────────────────────────────── */

export const CATEGORY_ICONS = {
  Push:        DumbbellIcon,
  Pull:        BarbellIcon,
  Leg:         LegIcon,
  Legs:        LegIcon,
  Cardio:      HeartPulseIcon,
  Upper:       BarbellIcon,
  Lower:       LegIcon,
  "Full Body": DumbbellIcon,
  Chest:       DumbbellIcon,
  Back:        BarbellIcon,
  Shoulders:   DumbbellIcon,
  Arms:        DumbbellIcon,
  Core:        FlameIcon,
  Glutes:      LegIcon,
};

export const CARDIO_TYPE_ICONS = {
  Run:        RunningIcon,
  Walk:       WalkingIcon,
  Elliptical: EllipticalIcon,
  Swim:       SwimmingIcon,
  Other:      HeartPulseIcon,
};

export const CARDIO_TYPES = ["Run", "Walk", "Elliptical", "Swim", "Other"];

/* ─── Cheat Day Icons ─────────────────────────────────────── */

export function DevilIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="14" r="6" />
      <path d="M8 8L6 3M16 8L18 3" />
      <circle cx="10" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10 16.5c1 1 3 1 4 0" />
    </svg>
  );
}

export function HaloIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="15" r="6" />
      <ellipse cx="12" cy="5" rx="5" ry="2" />
      <circle cx="10" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10 17c1 1 3 1 4 0" />
    </svg>
  );
}

export function SkippedTrainingIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <rect x="6" y="9" width="3" height="6" rx="0.5" />
      <rect x="15" y="9" width="3" height="6" rx="0.5" />
      <line x1="5" y1="5" x2="19" y2="19" />
    </svg>
  );
}

export function SkippedCardioIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2L4 14h6l-2 8 9-12h-6z" />
      <line x1="5" y1="5" x2="19" y2="19" />
    </svg>
  );
}

export function BurgerIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 10a7 7 0 0 1 14 0" />
      <path d="M4 12h16" />
      <path d="M5 14l2-1 2 1 2-1 2 1 2-1 2 1" />
      <path d="M5 16h14v1c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1z" />
    </svg>
  );
}

export function BedIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18v-6a2 2 0 0 1 2-2h4v8" />
      <path d="M9 10h10a2 2 0 0 1 2 2v6" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <path d="M16 3l2 2-2 2" />
      <path d="M19 2l2 2-2 2" />
    </svg>
  );
}

export function BeerIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="8" width="10" height="13" rx="1" />
      <path d="M15 11h3a2 2 0 0 1 0 4h-3" />
      <path d="M5 8c1-2 3-3 5-3s4 1 5 3" />
    </svg>
  );
}

export function CigaretteIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="14" width="15" height="3" rx="0.5" />
      <line x1="15" y1="14" x2="15" y2="17" />
      <path d="M5 14c0-1 1-3 2-5s0-4 0-4" />
      <path d="M8 14c0-1 1-3 2-5s0-4 0-4" />
    </svg>
  );
}

export function EyeIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}
