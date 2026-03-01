import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export const InningsProjectionPanel = ({ data }) => {
    if (!data) return null;

    const pressureIndex = Math.min(
        100,
        Math.max(20, data.projected_total_runs * 0.8)
    );

    return (
        <div className="mt-16 animate-slide-up">
            <div className="h-px bg-white/10 mb-12"></div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[40px] p-10 relative overflow-hidden">

                {/* Background watermark */}
                <div className="absolute top-0 right-0 opacity-5 text-[10rem] font-black pointer-events-none">
                    20
                </div>

                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-cyan-400 mb-12">
                    Projected Innings Outcome
                </h3>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT SIDE */}
                    <div className="lg:w-2/3">

                        {/* Scoreboard */}
                        <div className="flex flex-wrap items-end gap-12 mb-12">

                            <div>
                                <span className="text-xs text-slate-400 uppercase block mb-2">
                                    Projected Score
                                </span>
                                <span className="text-6xl font-black text-white tracking-tight">
                                    {data.projected_total_runs}
                                </span>
                            </div>

                            <div>
                                <span className="text-xs text-slate-400 uppercase block mb-2">
                                    Wickets
                                </span>
                                <span className="text-6xl font-black text-cyan-400 tracking-tight">
                                    {data.projected_wickets}
                                </span>
                            </div>

                            <div>
                                <span className="text-xs text-slate-400 uppercase block mb-2">
                                    Overs Simulated
                                </span>
                                <span className="text-3xl font-black text-slate-300">
                                    {data.overs_simulated}
                                </span>
                            </div>

                        </div>

                        {/* Over Breakdown Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {data.over_breakdown.map((over, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all"
                                >
                                    <span className="text-[10px] text-slate-500 uppercase block mb-2">
                                        Over {over.over}
                                    </span>

                                    <span className="text-sm font-bold text-white block truncate">
                                        {over.bowler}
                                    </span>

                                    <span className="text-xs text-cyan-400 block mt-2">
                                        {over.predicted_runs} runs
                                    </span>

                                    <span className="text-[10px] text-slate-500">
                                        {over.wicket_probability}% wk prob
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Advanced Summary Metrics */}
                        <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-6 font-bold">
                                Tactical Summary
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

                                {/* Avg Runs */}
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block mb-2">
                                        Avg Runs/Over
                                    </span>
                                    <span className="text-xl font-black text-white">
                                        {(data.projected_total_runs / data.overs_simulated).toFixed(2)}
                                    </span>
                                </div>

                                {/* Highest Scoring Over */}
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block mb-2">
                                        Peak Over
                                    </span>
                                    <span className="text-xl font-black text-cyan-400">
                                        Over{" "}
                                        {
                                            data.over_breakdown.reduce((max, o) =>
                                                o.predicted_runs > max.predicted_runs ? o : max
                                            ).over
                                        }
                                    </span>
                                </div>

                                {/* Lowest Wicket Risk */}
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block mb-2">
                                        Safest Over
                                    </span>
                                    <span className="text-xl font-black text-green-400">
                                        Over{" "}
                                        {
                                            data.over_breakdown.reduce((min, o) =>
                                                o.wicket_probability < min.wicket_probability ? o : min
                                            ).over
                                        }
                                    </span>
                                </div>

                                {/* Run Rate */}
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block mb-2">
                                        Projected RR
                                    </span>
                                    <span className="text-xl font-black text-cyan-400">
                                        {(data.projected_total_runs / 20).toFixed(2)}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:w-1/3 space-y-8">

                        {/* Run Projection Chart */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h4 className="text-xs uppercase text-slate-400 mb-6 tracking-widest font-bold">
                                Projected Run Curve
                            </h4>

                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={data.over_breakdown}>
                                    <XAxis
                                        dataKey="over"
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
                                    <Bar
                                        dataKey="predicted_runs"
                                        radius={[8, 8, 0, 0]}
                                        barSize={30}
                                    >
                                        {data.over_breakdown.map((_, index) => (
                                            <Cell key={index} fill="#06b6d4" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pressure Index */}
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
                            <h5 className="text-xs uppercase tracking-widest text-cyan-400 mb-4 font-bold">
                                Pressure Index
                            </h5>

                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Match Intensity</span>
                                <span className="font-black text-white">
                                    {pressureIndex.toFixed(0)}%
                                </span>
                            </div>

                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-700"
                                    style={{ width: `${pressureIndex}%` }}
                                ></div>
                            </div>

                            <p className="text-xs text-slate-500 mt-4">
                                Higher projected totals indicate increased match volatility
                                and pressure in final overs.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};