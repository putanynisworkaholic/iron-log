import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
const CODE_LENGTH = 4;

export default function Login() {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const { unlock } = useAuth();
  const navigate = useNavigate();

  const handleDigit = (d) => {
    if (d === "⌫") {
      setInput(v => v.slice(0, -1));
      return;
    }
    if (d === "" || input.length >= CODE_LENGTH) return;

    const next = input + d;
    setInput(next);

    if (next.length === CODE_LENGTH) {
      setTimeout(() => {
        const ok = unlock(next);
        if (ok) {
          navigate("/");
        } else {
          setShake(true);
          setInput("");
          setTimeout(() => setShake(false), 500);
        }
      }, 80);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 select-none">
      {/* Logo */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-[0.5em]">IRON LOG</h1>
        <p className="text-[10px] text-gray-400 tracking-[0.4em] mt-2">TRACK. LIFT. REPEAT.</p>
      </div>

      {/* Dots */}
      <div className={`flex gap-5 mb-14 ${shake ? "animate-shake" : ""}`}>
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-black transition-all duration-150 ${
              i < input.length ? "bg-black scale-110" : "bg-white"
            }`}
          />
        ))}
      </div>

      {/* PIN pad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {DIGITS.map((d, i) => (
          <button
            key={i}
            onClick={() => handleDigit(d)}
            disabled={d === ""}
            className={`h-16 text-xl font-light tracking-wide border border-black transition-all active:bg-black active:text-white
              ${d === "" ? "border-transparent cursor-default" : "hover:bg-gray-50"}
              ${d === "⌫" ? "text-base" : ""}
            `}
          >
            {d}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </div>
  );
}
