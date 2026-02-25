import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/UIElements';
import { PredictorForm } from './components/PredictorForm';
import { ResultDisplay } from './components/ResultDisplay';

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
  const [dynamicBio, setDynamicBio] = useState("");
  const [error, setError] = useState("");

  // --- Initial Metadata Fetch ---
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get_metadata`);
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

  const handlePredict = async () => {
    if (selectedBowlers.length === 0) return setError("No bowlers selected.");
    setError(""); setIsLoading(true); setResults(null);
    try {
      const res = await axios.post(`${apiUrl}/predict`, {
        venue, striker, non_striker: nonStriker, over, inning,
        bowler_list: selectedBowlers.map(b => b.value)
      });
      const bio = await axios.get(`${apiUrl}/get_player_bio/${encodeURIComponent(res.data.top_recommendation)}`);
      setDynamicBio(bio.data.bio);
      setResults(res.data);
    } catch (err) { setError("Analysis Failed."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30">
      <Header />

      <main className="max-w-7xl mx-auto p-6 md:p-12 pb-20">

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-bold uppercase">{error}</div>}

        <PredictorForm
          state={{ inning, venue, striker, nonStriker, over, selectedBowlers }}
          setters={{ setInning, setVenue, setStriker, setNonStriker, setOver, setSelectedBowlers }}
          options={{ venues, batters, bowlers }}
          handlePredict={handlePredict}
          isLoading={isLoading}
        />

        {results && !isLoading && (
          // <ResultDisplay results={results} radarData={radarData} dynamicBio={dynamicBio} />
          <ResultDisplay results={results} dynamicBio={dynamicBio} />
        )}
      </main>
    </div>
  );
}