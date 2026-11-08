
function Card({ pokemon, handleCardClick }) {
  return (
    <div
      className="pokemon-card"
      onClick={() => handleCardClick(pokemon.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick(pokemon.id);
        }
      }}
    >
      <img
        src={pokemon.image}
        alt={pokemon.name}
        onError={(event) => {
          event.currentTarget.onerror = null;

          event.currentTarget.src =
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
        }}
      />

      <h3>{pokemon.name}</h3>
    </div>
  );
}

export default Card;
