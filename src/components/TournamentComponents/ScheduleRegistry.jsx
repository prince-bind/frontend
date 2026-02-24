import React, { useState } from 'react';

// --- Scorecard Modal ---
const ScorecardModal = ({ match, onClose }) => {
  if (!match) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/10 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Official Scorecard</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
              {match.teams[0]} <span className="text-slate-600 text-lg mx-2">vs</span> {match.teams[1]}
            </h3>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400">✕</button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Scores with Fallbacks */}
            {[0, 1].map((i) => (
              <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">{match.teams[i]}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black text-white">
                    {match.score?.[i]?.r || 0}/{match.score?.[i]?.w || 0}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">({match.score?.[i]?.o || 0} ov)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
              {match.status || (match.matchStarted ? "Match in Progress" : "Match Scheduled")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScheduleRegistry = ({ matches, onSync, isLoading }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (isLoading) return <div className="mt-8 p-20 text-center text-cyan-500 font-black uppercase tracking-widest border border-white/5 rounded-[40px]">Decoding Registry...</div>;
  if (!matches || matches.length === 0) return <div className="mt-8 p-20 text-center text-slate-500 font-black uppercase tracking-widest border border-white/5 rounded-[40px]">Satellite Feed Empty</div>;

  return (
    <>
      <ScorecardModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />

      <div className="mt-8 rounded-[40px] border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
          <div>
             <h3 className="text-xl font-black text-white uppercase tracking-tight">Match <span className="text-cyan-500">Schedule</span></h3>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">IPL 2026 Live Feed</p>
          </div>
          <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-3 py-1 rounded-full border border-green-500/20">
            {matches.length} MATCHES DETECTED
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <th className="p-6">Timeline</th>
                <th className="p-6">Tactical Matchup</th>
                <th className="p-6">Venue</th>
                <th className="p-6 text-right">Intel Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matches.map((match, index) => {
                const isLive = match.matchStarted && !match.matchEnded;
                const isCompleted = match.matchEnded || (match.status && match.status.includes("won"));
                
                return (
                  <tr 
                    key={match.id || index} 
                    onClick={() => setSelectedMatch(match)}
                    className="hover:bg-cyan-500/5 transition-all group cursor-pointer"
                  >
                    <td className="p-6">
                      <span className="text-xs font-bold text-slate-300 block">
                        {new Date(match.dateTimeGMT).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium lowercase">
                        {new Date(match.dateTimeGMT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-6">
                        <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                            {match.teams[0]} <span className="text-slate-700 mx-1">VS</span> {match.teams[1]}
                        </span>
                    </td>
                    <td className="p-6 text-xs text-slate-400 font-medium italic">{match.venue}</td>
                    <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                      {isLive ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSync(match);
                          }}
                          className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all animate-pulse uppercase"
                        >
                          Sync Live Score
                        </button>
                      ) : isCompleted ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono text-cyan-400 font-black px-2 py-1 bg-cyan-400/5 rounded">RESULT RECORDED</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-600 bg-slate-800/50 px-3 py-1 rounded-lg uppercase tracking-widest">Scheduled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};