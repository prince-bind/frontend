import React from "react";

export const WinProbabilityPanel = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-16 animate-slide-up">
      <div className="h-px bg-white/10 mb-12"></div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[40px] p-10 relative overflow-hidden">

        {/* Background watermark */}
        <div className="absolute top-0 right-0 opacity-5 text-[10rem] font-black text-cyan-400 pointer-events-none">
          WIN
        </div>

        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-cyan-400 mb-12">
          Win Probability Simulation
        </h3>

        <div className="space-y-6">
          {data.simulations.map((sim, index) => (
            <div
              key={index}
              className={`p-6 rounded-3xl border transition-all ${
                index === 0
                  ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                  : "bg-white/5 border-white/10 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-black uppercase text-white">
                  {sim.bowler}
                </h4>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    index === 0
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {index === 0 ? "Top Impact" : "Alternative"}
                </span>
              </div>

              {/* Probability Value */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-400">
                  Win Probability
                </span>
                <span className="text-2xl font-black text-cyan-400">
                  {sim.win_probability}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${sim.win_probability}%` }}
                ></div>
              </div>

              {/* Footer Stats */}
              <div className="flex justify-between text-xs text-slate-500 mt-4">
                <span>Predicted Runs: {sim.predicted_runs}</span>
                <span>Wicket Probability: {sim.wicket_probability}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};