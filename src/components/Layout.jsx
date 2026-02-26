import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const { lock } = useAuth();
  const navigate = useNavigate();

  const handleLock = () => {
    lock();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-black w-full max-w-sm mx-auto">
      {/* Header */}
      <header className="border-b-2 border-black px-5 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <NavLink to="/" className="text-sm font-bold tracking-[0.35em]">
          IRON LOG
        </NavLink>
        <div className="flex items-center gap-5">
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `text-xs tracking-widest ${isActive ? "font-bold border-b border-black pb-px" : "text-gray-400"}`
            }
          >
            STATS
          </NavLink>
          <button
            onClick={handleLock}
            className="text-xs tracking-widest text-gray-400 active:text-black transition-colors"
          >
            LOCK
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-5 py-6 pb-28">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm border-t-2 border-black bg-white px-5 py-3 flex justify-between items-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-xs tracking-[0.25em] py-2 px-1 ${isActive ? "font-bold" : "text-gray-400"}`
          }
        >
          TODAY
        </NavLink>
        <NavLink
          to="/add-exercise"
          className="w-10 h-10 border-2 border-black flex items-center justify-center text-xl font-light hover:bg-black hover:text-white active:bg-black active:text-white transition-colors"
        >
          +
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `text-xs tracking-[0.25em] py-2 px-1 ${isActive ? "font-bold" : "text-gray-400"}`
          }
        >
          PROGRESS
        </NavLink>
      </nav>
    </div>
  );
}
