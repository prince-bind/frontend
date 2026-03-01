import React from 'react';
import Select from 'react-select';
import { customSelectStyles } from './UIElements';

export const PredictorForm = ({
  state,
  setters,
  options,
  handlePredict,
  handleWinSimulation,
  handleInningsSimulation,
  isLoading
}) => {
  const { inning, venue, striker, nonStriker, over, selectedBowlers } = state;
  const { setInning, setVenue, setStriker, setNonStriker, setOver, setSelectedBowlers } = setters;

  // Helper to determine match phase
  const getOverType = (num) => {
    if (num <= 6) return { label: 'Powerplay', color: 'text-green-400 bg-green-400/10' };
    if (num <= 15) return { label: 'Middle Overs', color: 'text-yellow-400 bg-yellow-400/10' };
    return { label: 'Death Overs', color: 'text-red-400 bg-red-400/10' };
  };

  const overType = getOverType(over);

  return (
    <div className="animate-fade-in">
      <div id="ai-inputs" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* ... Inning, Venue, Batter, Non-Striker selects stay the same ... */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Inning</label>
          <Select
            styles={customSelectStyles}
            options={[{ value: 1, label: "1st Inning" }, { value: 2, label: "2nd Inning" }]}
            value={{ value: inning, label: `${inning}${inning === 1 ? 'st' : 'nd'} Inning` }}
            onChange={(opt) => setInning(opt.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Venue</label>
          <Select
            styles={customSelectStyles}
            options={options.venues.map(v => ({ value: v, label: v }))}
            value={venue ? { value: venue, label: venue } : null}
            onChange={(opt) => setVenue(opt.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Batter</label>
          <Select
            styles={customSelectStyles}
            options={options.batters.map(b => ({ value: b, label: b }))}
            value={striker ? { value: striker, label: striker } : null}
            onChange={(opt) => setStriker(opt.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Non-Striker</label>
          <Select
            styles={customSelectStyles}
            options={options.batters.map(b => ({ value: b, label: b }))}
            value={nonStriker ? { value: nonStriker, label: nonStriker } : null}
            onChange={(opt) => setNonStriker(opt.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-black text-white uppercase tracking-widest">Over {over}</label>
            {/* Dynamic Over Type Badge */}
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${overType.color}`}>
              {overType.label}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={over}
            onChange={e => setOver(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Compare Bowlers</label>
          <Select
            isMulti styles={customSelectStyles}
            options={options.bowlers.map(b => ({ value: b, label: b }))}
            value={selectedBowlers}
            onChange={setSelectedBowlers}
            placeholder="Add bowlers..."
          />
        </div>
      </div>

      <button
        className={`group relative w-full h-16 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${isLoading ? 'bg-slate-800 cursor-not-allowed' : 'bg-white hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] active:scale-[0.98]'}`}
        onClick={handlePredict} disabled={isLoading}
      >
        <span className={isLoading ? 'text-slate-500' : 'text-black'}>
          {isLoading ? "Simulating Scenarios..." : "Analyze Best Matchup"}
        </span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

        {/* Win Probability Button */}
        <button
          className="
          relative h-14 rounded-xl 
          bg-cyan-500/20 
          border border-cyan-500 
          text-cyan-400 
          font-bold uppercase text-xs 
          transition-all duration-300 ease-out
          hover:bg-cyan-500/30
          hover:text-white
          hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]
          active:translate-y-0
          active:shadow-[0_0_15px_rgba(168,85,247,0.3)]
          disabled:opacity-40 disabled:cursor-not-allowed
        "
          onClick={handleWinSimulation}
          disabled={isLoading}
        >
          Simulate Win Probability
        </button>

        {/* Full Innings Button */}
        <button
          className="
          relative h-14 rounded-xl 
          bg-cyan-500/20 
          border border-cyan-500 
          text-cyan-400 
          font-bold uppercase text-xs 
          transition-all duration-300 ease-out
          hover:bg-cyan-500/30
          hover:text-white
          hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]
          active:translate-y-0
          active:shadow-[0_0_15px_rgba(168,85,247,0.3)]
          disabled:opacity-40 disabled:cursor-not-allowed
        "
          onClick={handleInningsSimulation}
          disabled={isLoading}
        >
          Simulate Full Innings
        </button>

      </div>
    </div>
  );
};