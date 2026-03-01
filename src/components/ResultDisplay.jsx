import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const ResultDisplay = ({ results, dynamicBio }) => {
  const topPick = results.top_recommendation;
  const topStats = results.predictions[0];

  return (
    <div className="mt-16 animate-slide-up">
      <div className="h-px bg-white/10 mb-16"></div>

      {/* ========================= */}
      {/* 1. MAIN BEST BOWLER CARD */}
      {/* ========================= */}
      <div className="relative overflow-hidden bg-slate-900/50 rounded-[40px] p-8 md:p-12 border border-cyan-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] mb-12">

        {/* Background watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span className="text-[12rem] font-black leading-none text-cyan-400">
            {topPick.charAt(0)}
          </span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">

          {/* Avatar Section */}
          <div className="lg:w-1/3 flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-cyan-500 rounded-[50px] blur-3xl opacity-20 animate-pulse"></div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  topPick
                )}&background=0f172a&color=06b6d4&size=512&font-size=0.6&bold=true`}
                className="w-56 h-56 rounded-[45px] border-2 border-cyan-500/40 shadow-2xl relative z-10"
                alt="Avatar"
              />
            </div>

            <div className="mt-6 bg-cyan-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
              Optimal Selection
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-2/3 space-y-8">

            <div>
              <h2 className="text-5xl md:text-7xl font-black uppercase text-white mb-6 tracking-tight">
                {topPick}
              </h2>

              <div className="flex flex-wrap gap-6">
                <StatCard
                  title="Impact Score"
                  value={topStats.predicted_score.toFixed(3)}
                />
                <StatCard
                  title="AI Confidence"
                  value={`${results.confidence}%`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Scout Report */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-2">
                  AI Scout Report
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{dynamicBio}"
                </p>
              </div>

              {/* Strategy Insights */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">
                  Strategy Insights
                </h4>
                <ul className="space-y-2 text-xs">
                  {topStats.ai_insights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-cyan-400 font-bold">›</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* 2. UNIT COMPARISON */}
      {/* ========================= */}
      <div className="mb-16">
        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-400 flex items-center gap-3">
          <span className="w-8 h-px bg-cyan-500/40"></span>
          Unit Comparison (Efficiency Rank)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.predictions.map((p, index) => (
            <div
              key={index}
              className={`p-6 rounded-3xl border transition-all duration-300 ${index === 0
                ? "bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                : "bg-white/5 border-white/10 opacity-80 hover:opacity-100"
                }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-500">
                  RANK #{index + 1}
                </span>

                <span
                  className={`text-[9px] font-bold px-3 py-1 rounded uppercase ${index === 0
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-800 text-slate-400"
                    }`}
                >
                  {index === 0 ? "Optimal" : "Alternative"}
                </span>
              </div>

              <h4 className="text-lg font-black uppercase text-white truncate mb-4">
                {p.bowler}
              </h4>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block font-bold mb-1">
                    Impact
                  </span>
                  <span
                    className={`text-xl font-black ${index === 0 ? "text-cyan-400" : "text-slate-300"
                      }`}
                  >
                    {p.predicted_score.toFixed(3)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold mb-1">
                    Efficiency
                  </span>

                  <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${index === 0
                        ? "bg-cyan-500"
                        : "bg-slate-600"
                        }`}
                      style={{
                        width: `${Math.max(
                          15,
                          100 - p.predicted_score * 10
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* 3. VISUALIZATION */}
      {/* ========================= */}
      <div className="grid grid-cols-1 gap-8 mb-16">
        <ChartContainer title="Impact Ranking">
          <BarChart data={results.predictions}>
            <XAxis
              dataKey="bowler"
              stroke="#475569"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "12px",
              }}
            />
            <Bar dataKey="predicted_score" radius={[10, 10, 0, 0]} barSize={45}>
              {results.predictions.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === 0 ? "#06b6d4" : "#1e293b"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

/* Reusable Stat Card */
const StatCard = ({ title, value }) => (
  <div className="bg-slate-800/70 border border-cyan-500/20 px-6 py-4 rounded-2xl min-w-[150px]">
    <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest block mb-2">
      {title}
    </span>
    <span className="text-2xl font-black text-white">{value}</span>
  </div>
);

/* Chart Container */
const ChartContainer = ({ title, children }) => (
  <div className="bg-slate-900/40 rounded-3xl p-10 border border-cyan-500/20 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
    <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-cyan-400">
      {title}
    </h3>
    <ResponsiveContainer width="100%" height={350}>
      {children}
    </ResponsiveContainer>
  </div>
);