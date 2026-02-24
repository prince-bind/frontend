import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

export const ResultDisplay = ({ results, radarData, dynamicBio }) => {
  const topPick = results.top_recommendation;
  const topStats = results.predictions[0];

  return (
    <div className="mt-16 animate-slide-up">
      <div className="h-px bg-white/10 mb-16"></div>
      
      {/* 1. Main Best Bowler Card */}
      <div className="relative overflow-hidden bg-slate-900/50 rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-5"><span className="text-[12rem] font-black leading-none">{topPick.charAt(0)}</span></div>
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3 flex flex-col items-center">
            <div className="relative">
                <div className="absolute -inset-4 bg-cyan-500 rounded-[50px] blur-3xl opacity-10 animate-pulse"></div>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(topPick)}&background=0f172a&color=06b6d4&size=512&font-size=0.6&bold=true`} className="w-56 h-56 rounded-[45px] border-2 border-cyan-500/30 shadow-2xl relative z-10" alt="Avatar" />
            </div>
            <div className="mt-6 bg-cyan-500 text-black px-5 py-1.5 rounded-full font-black text-xs tracking-tighter uppercase">Primary Selection</div>
          </div>
          <div className="lg:w-2/3 space-y-6">
            <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase text-white mb-4 tracking-tighter">{topPick}</h2>
                <div className="flex gap-4">
                    <div className="bg-slate-800/80 border border-slate-700 px-6 py-3 rounded-2xl">
                        <span className="text-cyan-500 text-[9px] font-black uppercase tracking-widest block mb-1">Impact Score</span>
                        <span className="text-2xl font-black">{topStats.predicted_score.toFixed(3)}</span>
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700 px-6 py-3 rounded-2xl">
                        <span className="text-cyan-500 text-[9px] font-black uppercase tracking-widest block mb-1">AI Confidence</span>
                        <span className="text-2xl font-black">{results.confidence}%</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest border-b border-white/5 pb-1">AI Scout Report</h4>
                <p className="text-sm text-slate-400 leading-relaxed italic">"{dynamicBio}"</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3">🤖 Strategy Insights</h4>
                <ul className="space-y-2 text-xs">
                  {topStats.ai_insights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2"><span className="text-cyan-500 font-bold">›</span> {insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unit Comparison Section (Moved Above Graphs) */}
      <div className="mb-12">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400 flex items-center gap-3">
          <span className="w-8 h-px bg-slate-700"></span> Unit Comparison (Efficiency Rank)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.predictions.map((p, index) => (
            <div key={index} className={`p-6 rounded-3xl border transition-all ${index === 0 ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-slate-500">RANK #{index + 1}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${index === 0 ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                  {index === 0 ? 'Optimal' : 'Alternative'}
                </span>
              </div>
              <h4 className="text-lg font-black uppercase text-white truncate mb-4">{p.bowler}</h4>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block font-bold mb-1">Impact</span>
                  <span className={`text-xl font-black ${index === 0 ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {p.predicted_score.toFixed(3)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold mb-1">Efficiency</span>
                  <div className="h-1.5 w-20 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${index === 0 ? 'bg-cyan-500' : 'bg-slate-600'}`} 
                      style={{ width: `${Math.max(10, 100 - (p.predicted_score * 10))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ChartContainer title="Matchup Analysis">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name={results.predictions[0].bowler} dataKey={results.predictions[0].bowler} stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} strokeWidth={2} />
            <Radar name={results.predictions[1]?.bowler || "Alt"} dataKey={results.predictions[1]?.bowler || "Alt"} stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
            <Legend />
          </RadarChart>
        </ChartContainer>

        <ChartContainer title="Impact Ranking">
          <BarChart data={results.predictions}>
            <XAxis dataKey="bowler" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis stroke="#475569" fontSize={10} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
            <Bar dataKey="predicted_score" radius={[10, 10, 0, 0]} barSize={40}>
              {results.predictions.map((_, index) => (
                <Cell key={index} fill={index === 0 ? '#06b6d4' : '#1e293b'} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, children }) => (
  <div className="bg-slate-900/30 rounded-3xl p-8 h-125 border border-white/5">
    <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-400">{title}</h3>
    <ResponsiveContainer width="100%" height="85%">{children}</ResponsiveContainer>
  </div>
);