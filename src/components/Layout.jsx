import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { CalendarIcon, SettingsIcon } from "./Icons";

export default function Layout() {
  const { lock } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black w-[90vw] max-w-sm mx-auto">
      {/* Header */}
      <header className="border-b-2 border-black px-1 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="text-sm font-bold tracking-[0.35em]">
            FYT FYN FYN
          </NavLink>
          {profile?.name && (
            <span className="text-[9px] tracking-widest text-gray-400 border border-gray-200 px-1.5 py-0.5">
              {profile.name}
            </span>
          )}
        </div>
        <button
          onClick={() => { lock(); navigate("/login"); }}
          className="text-xs tracking-widest text-gray-400 active:text-black transition-colors"
        >
          LOCK
        </button>
      </header>

      {/* Main */}
      <main className="px-1 py-6 pb-28 page-transition">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm border-t-2 border-black bg-white px-1 py-2 flex justify-between items-center safe-bottom">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-[10px] tracking-[0.2em] py-2 px-1.5 ${isActive ? "font-bold" : "text-gray-400"}`
          }
        >
          TODAY
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `py-2 px-1.5 ${isActive ? "text-black" : "text-gray-400"}`
          }
        >
          <CalendarIcon size={18} />
        </NavLink>

        <NavLink
          to="/add-exercise"
          className="w-10 h-10 border-2 border-black flex items-center justify-center text-xl font-light active:bg-black active:text-white transition-colors"
        >
          +
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `text-[10px] tracking-[0.2em] py-2 px-1.5 ${isActive ? "font-bold" : "text-gray-400"}`
          }
        >
          STATS
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `py-2 px-1.5 ${isActive ? "text-black" : "text-gray-400"}`
          }
        >
          <SettingsIcon size={18} />
        </NavLink>
      </nav>
    </div>
  );
}
