import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/UIElements';
import { PredictorForm } from './components/PredictorForm';
import { ResultDisplay } from './components/ResultDisplay';
// Import the new components
import { TournamentHub } from './components/TournamentComponents/TournamentHub';
import { ScheduleRegistry } from './components/TournamentComponents/ScheduleRegistry';

export default function App() {
  // --- Existing States ---
  const [venues, setVenues] = useState([]);
  const [batters, setBatters] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [venue, setVenue] = useState("");
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [over, setOver] = useState(10);
  const [inning, setInning] = useState(1);
  const [selectedBowlers, setSelectedBowlers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [radarData, setRadarData] = useState([]);
  const [dynamicBio, setDynamicBio] = useState("");
  const [error, setError] = useState("");

  // --- New Tournament States ---
  const [viewMode, setViewMode] = useState("predictor"); // "predictor" or "schedule"
  const [schedule, setSchedule] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // --- Initial Metadata Fetch ---
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_metadata');
        setVenues(response.data.venues); 
        setBatters(response.data.batters); 
        setBowlers(response.data.bowlers);
        setVenue(response.data.venues[0]); 
        setStriker(response.data.batters[0]); 
        setNonStriker(response.data.batters[1]);
      } catch (err) { setError("Backend connection failed."); }
    };
    fetchMetadata();
  }, []);

  // --- Fetch World Cup Schedule ---
  const handleToggleView = async (mode) => {
    setViewMode(mode);
    if (mode === "schedule" && schedule.length === 0) {
      setIsDataLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/get_world_cup_schedule');
        setSchedule(res.data || []);
      } catch (e) {
        console.error("Schedule link offline");
      } finally {
        setIsDataLoading(false);
      }
    }
  };

  // --- Sync Match Data to AI Form ---
  const syncMatchToAI = (match) => {
    // 1. Attempt to match venue string to our metadata list
    const matchedVenue = venues.find(v => 
      v.toLowerCase().includes(match.venue?.split(',')[0].toLowerCase())
    );
    if (matchedVenue) setVenue(matchedVenue);

    // 2. Set Inning and Over based on live data
    const activeInning = (match.score && match.score.length > 1) ? 2 : 1;
    const currentOver = match.score?.[activeInning - 1]?.o || 10;
    
    setInning(activeInning);
    setOver(Math.floor(Number(currentOver)));

    // 3. Switch view and scroll
    setViewMode("predictor");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredict = async () => {
    if (selectedBowlers.length === 0) return setError("No bowlers selected.");
    setError(""); setIsLoading(true); setResults(null);
    try {
      const res = await axios.post('http://127.0.0.1:8000/predict', {
        venue, striker, non_striker: nonStriker, over, inning,
        bowler_list: selectedBowlers.map(b => b.value)
      });
      const bio = await axios.get(`http://127.0.0.1:8000/get_player_bio/${encodeURIComponent(res.data.top_recommendation)}`);
      setDynamicBio(bio.data.bio);
      setRadarData(generateRadarData(res.data.predictions));
      setResults(res.data);
    } catch (err) { setError("Analysis Failed."); }
    finally { setIsLoading(false); }
  };

  const generateRadarData = (predictions) => {
    if (predictions.length < 2) return [];
    const p1 = predictions[0]; const p2 = predictions[1];
    return [
      { metric: 'AI WEIGHT', [p1.bowler]: Math.max(10, 100 - (p1.predicted_score * 10)), [p2.bowler]: Math.max(10, 100 - (p2.predicted_score * 10)) },
      { metric: 'ECONOMY', [p1.bowler]: p1.metrics.econ, [p2.bowler]: p2.metrics.econ },
      { metric: 'STRIKE RATE', [p1.bowler]: p1.metrics.sr, [p2.bowler]: p2.metrics.sr },
      { metric: 'DOT BALL %', [p1.bowler]: p1.metrics.dot, [p2.bowler]: p2.metrics.dot },
      { metric: 'PRESSURE', [p1.bowler]: p1.metrics.pressure, [p2.bowler]: p2.metrics.pressure },
    ];
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Pass view controls to Header if you want buttons there, 
          or add a local sub-nav below */}
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 pb-20">
        
        {/* Navigation Toggles */}
        <div className="flex gap-4 mb-10 border-b border-white/5 pb-6">
          <button 
            onClick={() => handleToggleView("predictor")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'predictor' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
            Matchup Predictor
          </button>
          <button 
            onClick={() => handleToggleView("schedule")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'schedule' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-slate-500 hover:text-white'}`}
          >
            IPL 2026
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-bold uppercase">{error}</div>}
        
        {viewMode === "predictor" ? (
          <>
            <PredictorForm 
              state={{ inning, venue, striker, nonStriker, over, selectedBowlers }}
              setters={{ setInning, setVenue, setStriker, setNonStriker, setOver, setSelectedBowlers }}
              options={{ venues, batters, bowlers }}
              handlePredict={handlePredict}
              isLoading={isLoading}
            />

            {results && !isLoading && (
              <ResultDisplay results={results} radarData={radarData} dynamicBio={dynamicBio} />
            )}
          </>
        ) : (
          <>
            {/* <TournamentHub schedule={schedule} /> */}
            <TournamentHub schedule={schedule} isLoading={isDataLoading} />
            <ScheduleRegistry matches={schedule} onSync={syncMatchToAI} isLoading={isDataLoading} />
          </>
        )}
      </main>
    </div>
  );
}