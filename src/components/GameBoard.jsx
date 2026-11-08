
import Card from "./Card";

function GameBoard({ pokemonList, handleCardClick }) {
  return (
    <div className="game-board">

      {pokemonList.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          handleCardClick={handleCardClick}
        />
      ))}

    </div>
  );
}

export default GameBoard;
