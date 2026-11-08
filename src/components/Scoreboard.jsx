
function Scoreboard({ score, bestScore }) {
  return (
    <div className="scoreboard">

      <div className="score-box">
        <h3>Current Score</h3>
        <p>{score}</p>
      </div>

      <div className="score-box">
        <h3>Best Score</h3>
        <p>{bestScore}</p>
      </div>

    </div>
  );
}

export default Scoreboard;
