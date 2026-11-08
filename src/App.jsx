
import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Scoreboard from "./components/Scoreboard";
import GameBoard from "./components/GameBoard";

import Instructions from "./components/Instructions";
import Footer from "./components/Footer";
function App() {

  // Store Pokémon data fetched from API
  const [pokemonList, setPokemonList] = useState([]);

  // Store IDs of Pokémon already clicked
  const [clickedPokemon, setClickedPokemon] = useState([]);

  // Current score
  const [score, setScore] = useState(0);

  // Highest score
 // Get previously saved best score from localStorage
const [bestScore, setBestScore] = useState(() => {
  const savedScore = localStorage.getItem("pokemonBestScore");

  return savedScore ? Number(savedScore) : 0;
});

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // Game status: "", "lost", or "won"
  const [gameStatus, setGameStatus] = useState("");

  // Fetch Pokémon data when component mounts
  useEffect(() => {

    const controller = new AbortController();

    async function fetchPokemon() {

      try {

        setLoading(true);
        setError("");

        // Generate IDs from 1 to 12
        const pokemonIds = Array.from(
          { length: 12 },
          (_, index) => index + 1
        );

        // Fetch all Pokémon data simultaneously
        const pokemonData = await Promise.all(

          pokemonIds.map(async (id) => {

            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${id}`,
              { signal: controller.signal }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch Pokémon");
            }

            const data = await response.json();

            // Return only required information
            return {
              id: data.id,
              name: data.name,
              image:
                data.sprites.other["official-artwork"].front_default ||
                data.sprites.front_default
            };

          })

        );

        // Save Pokémon data in state
        setPokemonList(pokemonData);

        // Shuffle cards initially
        setPokemonList(shuffleCards(pokemonData));

      } catch (err) {

        if (!controller.signal.aborted) {
          setError("Unable to load Pokémon. Please try again.");
        }

      } finally {

        if (!controller.signal.aborted) {
          setLoading(false);
        }

      }
    }

    fetchPokemon();

    // Cleanup function
    return () => {
      controller.abort();
    };

  }, []);

  // Shuffle Pokémon cards randomly
  function shuffleCards(cards) {

    const shuffledCards = [...cards];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledCards.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [shuffledCards[i], shuffledCards[j]] =
        [shuffledCards[j], shuffledCards[i]];

    }

    return shuffledCards;
  }

  // Handle Pokémon card click
  function handleCardClick(id) {

    // Don't allow clicks after winning or losing
    if (gameStatus !== "") {
      return;
    }

    // Check if Pokémon was already clicked
    if (clickedPokemon.includes(id)) {

      // Game over
      setScore(0);

      // Clear clicked Pokémon history
      setClickedPokemon([]);

      // Change game status
      setGameStatus("lost");

      // Shuffle cards
      setPokemonList((prevList) => shuffleCards(prevList));

      return;
    }

    // Store newly clicked Pokémon
    const newClickedPokemon = [...clickedPokemon, id];

    setClickedPokemon(newClickedPokemon);

    // Increase current score
    const newScore = score + 1;

    setScore(newScore);

    // Update best score
    setBestScore((prevBest) =>
      Math.max(prevBest, newScore)
    );

    // Check winning condition
    if (newClickedPokemon.length === pokemonList.length) {

      setGameStatus("won");

    }

    // Shuffle cards after every successful click
    setPokemonList((prevList) => shuffleCards(prevList));

  }

  // Restart game
  function restartGame() {

    setScore(0);

    setClickedPokemon([]);

    setGameStatus("");

    // Shuffle cards for a fresh game
    setPokemonList((prevList) => shuffleCards(prevList));

  }

  // Loading screen
  if (loading) {

    return (
      <div className="app">
        <h2>Loading Pokémon...</h2>
      </div>
    );

  }

  // Error screen
  if (error) {

    return (
      <div className="app">
        <h2>{error}</h2>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );

  }

  // Main application UI
  return (

    <div className="app">

      {/* Header component */}
      <Header />

      {/* Scoreboard component */}
      <Scoreboard
        score={score}
        bestScore={bestScore}
      />

      {/* Game status message */}
      {gameStatus === "lost" && (

        <div className="game-message">
          <h2>Game Over!</h2>

          <p>
            You clicked the same Pokémon twice.
          </p>

          <button onClick={restartGame}>
            Play Again
          </button>
        </div>

      )}

      {gameStatus === "won" && (

        <div className="game-message">
          <h2>You Won! 🎉</h2>

          <p>
            Congratulations! You clicked all 12 Pokémon.
          </p>

          <button onClick={restartGame}>
            Play Again
          </button>
        </div>

      )}

      {/* Pokémon cards */}
      <GameBoard
        pokemonList={pokemonList}
        handleCardClick={handleCardClick}
      />

      <Instructions />

      <Footer />

    </div>

  );

}

export default App;
