import "./StartScreem.css";

const StartScreem = ( {startGame} ) => {
  return (
    <div className="start">
        <h1 >Secret World</h1>
        <p>Clique no botão abaixo para começar a jogar</p>
        <button onClick={startGame}>Start</button>
    </div>
  )
}

export default StartScreem