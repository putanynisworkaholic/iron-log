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

export const CATEGORY_ICONS = {
  Push: DumbbellIcon,
  Pull: BarbellIcon,
  Leg: LegIcon,
  Legs: LegIcon,
  Cardio: HeartPulseIcon,
  Upper: BarbellIcon,
  Lower: LegIcon,
  "Full Body": DumbbellIcon,
  Chest: DumbbellIcon,
  Back: BarbellIcon,
  Shoulders: DumbbellIcon,
  Arms: DumbbellIcon,
  Core: FlameIcon,
};
