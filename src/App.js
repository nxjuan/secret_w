// CSS
import './App.css';
// Components
import StartScreem from './components/StartScreem';
import Game from './components/Game'
import GameOver from './components/GameOver';
//hooks
import {  useState, useCallback, useEffect } from "react";
//data
import { wordsList } from "./data/Words";

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQry = 5;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);


  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQry)
  const [score, setScore] = useState(0)


  const pickWorldAndCategories = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];      

    console.log(category);

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)

    return{word, category};
  }, [words])

  

  // Startando Secret World game
  const startGame = useCallback(() => {
    //limpando as letras,  ao vencer uma rodada
    clearLetterStates();

    //Picked word and picked category
    const { word, category } = pickWorldAndCategories();
    

    // criando um array com as letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(word, category);
    console.log(wordLetters);

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)
  }, [pickWorldAndCategories]);
  //Finalizando com Game Over
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()
    //verificando se a letra já está sendo ultilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    //removendo chance ao errar
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]) 

      setGuesses((actualGuesses) => actualGuesses - 1)

    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {

    if(guesses <= 0){
      //resetando os states ao fim de jogo
      clearLetterStates()


      setGameStage(stages[2].name);
    }

  }, [guesses, letters, startGame])

  // Check condição de vitória

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    //condição de vitória
    if(guessedLetters.length === uniqueLetters.length){
      //add score
      setScore((actualScore) => actualScore += 100)

      //restartando o jogo
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  //Retry game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQry)
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreem startGame={startGame}/>}
      {gameStage === 'game' && <Game 
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>

  );
};

export default App;
