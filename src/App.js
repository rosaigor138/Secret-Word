//css
import './App.css';

//react
import{useCallback,useEffect, useState} from 'react';

//data
import{wordsList} from './data/words';

//components
import StartScreen from './Component/StartScreen';
import Game from './Component/Game';
import GameOver from './Component/GameOver';


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name:"end"},
]
const guessesQtd = 3;



function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] =useState([]);
  const [guesses, setGuesses] = useState(guessesQtd);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick a random word
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category};
  },[words])

  //starts the secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterState()
    console.log(score)
    //pick word and pick category
    const { word, category } = pickWordAndCategory();

    //create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l)=>l.toLowerCase())

    //fill states
    setPickedWord(word);
    setLetters(wordLetters);
    setPickedCategory(category);

    setGameStage(stages[1].name);

    console.log(wordLetters,category,word)
  },[pickWordAndCategory])

  //process the letter input
  const verifyLetter =(letter) =>{
    const normalizedLetter = letter.toLowerCase();

    //check if letter is already been utilized
    if(guessedLetters.includes(normalizedLetter)|| wrongLetters.includes(normalizedLetter)){
      return;
    }

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters)=>[
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      
      
      setGuesses((actualGuesses) => actualGuesses -1);
    }
    
  }
  const clearLetterState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);

  };

  //check if guesses ended



  useEffect(() =>{
    if(guesses<=0){
      //reset all states
      clearLetterState()

      setGameStage(stages[2].name)
    }
  },[guesses]);

  //check win condition
  useEffect(() =>{
    
    const uniqueLetters = [... new Set(letters)];

    //win condition
    if(guessedLetters.length === uniqueLetters.length && uniqueLetters.length !=0){
      // add score
      setScore((actualScore) => (actualScore += 10));
      console.log('passou aq')
      //restart game with new word
      setGameStage(stages[0].name)
      startGame();

    }
    
  }, [guessedLetters, letters, startGame])

  //restarts the game
  const retry=() =>{
    setScore(0);
    setGuesses(guessesQtd);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game 
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord}
        pickedCategory = {pickedCategory}
        letters = {letters}
        guessedLetters = {guessedLetters}
        wrongLetters = {wrongLetters}
        guesses = {guesses}
        score = {score}
        />
      }
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
