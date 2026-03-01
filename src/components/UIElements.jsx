import React from 'react';

export const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(15, 23, 42, 0.6)",
    borderColor: state.isFocused ? "#06b6d4" : "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "2px",
    boxShadow: state.isFocused ? "0 0 0 1px #06b6d4" : "none",
    "&:hover": { borderColor: "#06b6d4" }
  }),
  menu: (base) => ({ ...base, backgroundColor: "#0f172a", borderRadius: "12px", zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(6, 182, 212, 0.2)" : "transparent",
    color: state.isFocused ? "#22d3ee" : "#cbd5e1",
    cursor: "pointer"
  }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
  input: (base) => ({ ...base, color: "#fff" }),
  multiValue: (base) => ({ ...base, backgroundColor: "rgba(6, 182, 212, 0.2)" }),
  multiValueLabel: (base) => ({ ...base, color: "#22d3ee", fontWeight: "bold" }),
};

export const Header = ({ healthStatus }) => (
  <header className="w-full h-[18vh] flex flex-col justify-center px-8 md:px-16 border-b border-white/5 bg-linear-to-b from-slate-900 to-transparent sticky top-0 z-50 backdrop-blur-md">
    <div className="max-w-7xl mx-auto w-full flex items-center gap-6">
      <div className="h-14 w-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]">
        <span className="text-2xl">⚡</span>
      </div>
      <div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">CABRS <span className="text-cyan-500">AI</span></h1>
        <p className="text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase opacity-70 flex items-center gap-2">
          Context Aware Bowler Recommendation System
          <span className={`h-2 w-2 rounded-full ${healthStatus === "ok" ? "bg-green-500" : "bg-red-500"}`}></span>
        </p>
      </div>
    </div>
  </header>
);