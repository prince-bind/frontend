import React from 'react';

export const TournamentHub = ({ schedule, isLoading }) => {
  // 1. Data Processing: Calculate Team Wins
  const getTopTeams = () => {
    const wins = {};
    schedule.forEach(match => {
      // Check if match is finished and has a winner
      if (match.matchEnded && match.status?.includes("won")) {
        // Most APIs include the winner name in the status string
        const winner = match.teams.find(team => match.status.includes(team));
        if (winner) wins[winner] = (wins[winner] || 0) + 1;
      }
    });
    
    // Convert to array, sort by wins, and take top 3
    return Object.entries(wins)
      .map(([name, winCount]) => ({ name, winCount }))
      .sort((a, b) => b.winCount - a.winCount)
      .slice(0, 3);
  };

  const topTeams = getTopTeams();
  const totalMatches = 55;
  const completedMatches = schedule.filter(m => m.matchEnded).length;
  const progressPercent = Math.round((completedMatches / totalMatches) * 100);

  if (isLoading) return (
    <div className="mb-12 h-64 animate-pulse bg-white/5 rounded-4xl border border-white/5 flex items-center justify-center">
       <span className="text-cyan-500 font-black uppercase tracking-widest text-[10px]">Processing Tournament Data...</span>
    </div>
  );

  return (
    <div className="mb-12 animate-slide-up space-y-6">
      {/* Top Section: Hero Card & Progress */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-linear-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-4xl p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <span className="text-[12rem] font-black uppercase">T20</span>
          </div>
          <div className="relative z-10">
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Live Intelligence</span>
            <h2 className="text-4xl font-black text-white mt-2 uppercase tracking-tighter">IPL 2026 <span className="text-cyan-500">2026</span></h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-sm">Neural matching synchronized. Tracking {schedule.length} filtered elite matchups.</p>
          </div>
        </div>

        <div className="lg:w-1/3 bg-slate-900/40 border border-white/5 rounded-4xl p-8 flex flex-col justify-center">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Registry Completion</h4>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-black text-white">{progressPercent}%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{completedMatches} / {totalMatches} Units</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* NEW: Top Performing Teams Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topTeams.length > 0 ? topTeams.map((team, index) => (
          <div key={team.name} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-4">
              <span className={`text-xl font-black ${index === 0 ? 'text-cyan-500' : 'text-slate-600'}`}>0{index + 1}</span>
              <div>
                <h5 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{team.name}</h5>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Dominance Factor</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">{team.winCount}</span>
              <span className="text-[9px] text-cyan-500 font-black block uppercase leading-none">Wins</span>
            </div>
          </div>
        )) : (
          <div className="col-span-3 py-4 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Awaiting match completions for standings...</span>
          </div>
        )}
      </div>
    </div>
  );
};