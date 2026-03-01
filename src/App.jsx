import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "./components/UIElements";
import { PredictorForm } from "./components/PredictorForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { WinProbabilityPanel } from "./components/WinProbabilityPanel";
import { InningsProjectionPanel } from "./components/InningsProjectionPanel";

export default function App() {
  // Metadata States
  const [venues, setVenues] = useState([]);
  const [batters, setBatters] = useState([]);
  const [bowlers, setBowlers] = useState([]);

  // Match Inputs
  const [venue, setVenue] = useState("");
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [over, setOver] = useState(10);
  const [inning, setInning] = useState(1);
  const [selectedBowlers, setSelectedBowlers] = useState([]);

  // App States
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dynamicBio, setDynamicBio] = useState("");
  const [error, setError] = useState("");
  const [healthStatus, setHealthStatus] = useState(null);
  const [winSimulation, setWinSimulation] = useState(null);
  const [inningsSimulation, setInningsSimulation] = useState(null);

  // NEW: Active View Controller
  const [activeView, setActiveView] = useState(null);

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
      } catch {
        setError("Backend connection failed.");
      }
    };

    const checkHealth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/health`);
        setHealthStatus(res.data.status);
      } catch {
        setHealthStatus("offline");
      }
    };

    fetchMetadata();
    checkHealth();
  }, []);

  // =========================
  // ANALYZE BEST MATCHUP
  // =========================
  const handlePredict = async () => {
    if (selectedBowlers.length === 0)
      return setError("No bowlers selected.");

    setError("");
    setIsLoading(true);

    // Activate Analyze View
    setActiveView("analyze");

    // Clear other panels
    setWinSimulation(null);
    setInningsSimulation(null);

    try {
      const res = await axios.post(`${apiUrl}/predict`, {
        venue,
        striker,
        non_striker: nonStriker,
        over,
        inning,
        bowler_list: selectedBowlers.map((b) => b.value),
      });

      const bio = await axios.get(
        `${apiUrl}/get_player_bio/${encodeURIComponent(
          res.data.top_recommendation
        )}`
      );

      setDynamicBio(bio.data.bio);
      setResults(res.data);
    } catch {
      setError("Analysis Failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // SIMULATE WIN PROBABILITY
  // =========================
  const handleWinSimulation = async () => {
    if (selectedBowlers.length === 0)
      return setError("No bowlers selected.");

    setError("");
    setIsLoading(true);

    // Activate Win View
    setActiveView("win");

    // Clear other panels
    setResults(null);
    setInningsSimulation(null);

    try {
      const res = await axios.post(
        `${apiUrl}/simulate_win_probability`,
        {
          venue,
          striker,
          non_striker: nonStriker,
          over,
          inning,
          bowler_list: selectedBowlers.map((b) => b.value),
        }
      );

      setWinSimulation(res.data);
    } catch {
      setError("Win simulation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // SIMULATE FULL INNINGS
  // =========================
  const handleInningsSimulation = async () => {
    if (selectedBowlers.length === 0)
      return setError("No bowlers selected.");

    setError("");
    setIsLoading(true);

    // Activate Innings View
    setActiveView("innings");

    // Clear other panels
    setResults(null);
    setWinSimulation(null);

    try {
      const res = await axios.post(`${apiUrl}/simulate_innings`, {
        venue,
        striker,
        non_striker: nonStriker,
        over,
        inning,
        bowler_list: selectedBowlers.map((b) => b.value),
      });

      setInningsSimulation(res.data);
    } catch {
      setError("Innings simulation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-purple-500/30">
      <Header healthStatus={healthStatus} />

      <main className="max-w-7xl mx-auto p-6 md:p-12 pb-20">

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-bold uppercase">
            {error}
          </div>
        )}

        <PredictorForm
          state={{
            inning,
            venue,
            striker,
            nonStriker,
            over,
            selectedBowlers,
          }}
          setters={{
            setInning,
            setVenue,
            setStriker,
            setNonStriker,
            setOver,
            setSelectedBowlers,
          }}
          options={{ venues, batters, bowlers }}
          handlePredict={handlePredict}
          handleWinSimulation={handleWinSimulation}
          handleInningsSimulation={handleInningsSimulation}
          isLoading={isLoading}
        />

        {/* ========================= */}
        {/* VIEW CONTROLLER RENDERING */}
        {/* ========================= */}

        {!isLoading && activeView === "analyze" && results && (
          <ResultDisplay
            results={results}
            dynamicBio={dynamicBio}
          />
        )}

        {!isLoading && activeView === "win" && winSimulation && (
          <WinProbabilityPanel data={winSimulation} />
        )}

        {!isLoading && activeView === "innings" && inningsSimulation && (
          <InningsProjectionPanel data={inningsSimulation} />
        )}
      </main>
    </div>
  );
}