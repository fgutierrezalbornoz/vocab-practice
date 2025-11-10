import { useEffect, useState } from "react";
import { unit5a } from "./5a";
import { unit6b } from "./6b";
import { unit7a } from "./7a";
import type { Question } from "./IQuestion";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";
import { unit8b } from "./8b";


// const units = [{ name: "5A", array: unit5a }, { name: "6B", array: unit6b }, { name: "7A", array: unit7a }]
export function QuestionComponent(){
  const [showClue, setShowClue] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [unit, setUnit] = useState<Question[]>(unit5a);
  const [unitSelected, setUnitSelected] = useState("5A");
  const [randomQuestion, setRandomQuestion] = useState(unit[Math.floor(Math.random() * unit.length)]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const { width, height } = useWindowSize();
  const resetAnswers = () => {
    const localStorageString = localStorage.getItem('answers');
    const lStorage = localStorageString ? JSON.parse(localStorageString) : "";
    delete lStorage[unitSelected];
    localStorage.setItem("answers", JSON.stringify(lStorage));
  }
  const saveInLS = (word: string) => {
    const localStorageString = localStorage.getItem('answers');
    const lStorage = localStorageString ? JSON.parse(localStorageString) : "";
    if (!lStorage[unitSelected]){
      const newJSON = {...lStorage};
      newJSON[unitSelected] = [word]
      localStorage.setItem('answers', JSON.stringify(newJSON));
    } else {
      const newAnswers = [...lStorage[unitSelected], word];
      const newJSON = {...lStorage };
      newJSON[unitSelected] = newAnswers;
      localStorage.setItem('answers', JSON.stringify(newJSON));
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
    if (e.target.value.toLowerCase()===randomQuestion.word.toLowerCase()){
      setIsCorrect(true);
      setResponse("Correct");
      saveInLS(randomQuestion.word.toLocaleLowerCase())
    }
      // setAnswer(e.target.value)
  }
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer.toLowerCase()===randomQuestion.word.toLowerCase()){
      setIsCorrect(true);
      setResponse("Correct");
      saveInLS(randomQuestion.word.toLocaleLowerCase())
    } else {
      setResponse("Wrong")
    }
  }
  const isInLS = (word: string) => {
    const localStorageString = localStorage.getItem('answers');
    const lStorage = localStorageString ? JSON.parse(localStorageString) : "";
    if (lStorage[unitSelected]){
      return lStorage[unitSelected].includes(word);
    }
    return false;
  }
  const chooseWord = () => {
    const newRandomQuestion = unit[Math.floor(Math.random() * unit.length)];
    if (newRandomQuestion.word!==randomQuestion.word && !isInLS(newRandomQuestion.word.toLowerCase())){
      setRandomQuestion(newRandomQuestion);
      setIsCorrect(false);
      setAnswer("");
      setShowClue(false);
      setResponse(null);
    } else {
      chooseWord();
    }
  }
  useEffect(()=>{
    if (!isCorrect) return

  }, [isCorrect]);

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUnitSelected(value);
    if (value === "5A") {
      setUnit(unit5a);
    } else if (value === "6B") {
      setUnit(unit6b);
    } else if (value === "7A") {
      setUnit(unit7a);
    } else if (value === "8B") {
      setUnit(unit8b);
    }
    setIsCorrect(false);
    setAnswer("");
    setShowClue(false);
    setResponse(null);
    setRandomQuestion(() => {
  const newUnit = value === "5A" ? unit5a : (value === "6B" ? unit6b : (value === "7A" ? unit7a : unit8b));
  return newUnit[Math.floor(Math.random() * newUnit.length)];
});
  }
  const localStorageString = localStorage.getItem('answers');
  const lStorage = localStorageString ? JSON.parse(localStorageString) : "";
  if ( lStorage[unitSelected]?.length === unit.length){
    return (
    <>
      <p>Corrects: {lStorage[unitSelected] ? lStorage[unitSelected].length : 0}/{unit.length}</p>
      <section>
        <select value={unitSelected} onChange={handleChangeSelect}>
          <option value="5A"> Unit 5A </option>
          <option value="6B"> Unit 6B </option>
          <option value="7A"> Unit 7A </option>
          <option value="8B"> Unit 8B </option>
        </select>
      </section>
      <p>All questions have been answered</p>
      <button onClick={resetAnswers}>Reset Answers</button>
    </>)    
  }
  return (
    <>
      {isCorrect && <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
      />}
      {/* <article className="main-container" style={{ background: isCorrect ? "green" : "transparent" }}> */}
      <article className="main-container">
        <p>Corrects: {lStorage[unitSelected] ? lStorage[unitSelected].length : 0}/{unit.length}</p>
        <section>
          <select value={unitSelected} onChange={handleChangeSelect}>
            <option value="5A"> Unit 5A </option>
            <option value="6B"> Unit 6B </option>
            <option value="7A"> Unit 7A </option>
            <option value="8B"> Unit 8B </option>
          </select>
        </section>
        {response && <header style={{color: isCorrect ? "green" : "red", fontSize: '24px' }}>{response}</header>}
        <section className="help-section">{!showClue ? "Show clue": "Hide clue"} <input type="checkbox" onChange={() => setShowClue(!showClue)} disabled={isCorrect}/></section>
        
        <section className="question-section">
          Definition: "{randomQuestion.definition}"
        </section>
        {showClue && <section className="clue">
          Has {randomQuestion.word.length} letters.
        </section>}
        { isCorrect && <p className="example">Example: "{randomQuestion.example}"</p>}
        <form className="form-container" onSubmit={handleSubmit}>
          <input value={answer} onChange={handleChange} type="text" disabled={isCorrect}></input>
        </form>
        <section className="md:flex gap-4 flex-col">
          <button onClick={resetAnswers}>Reset Answers</button>
          <button onClick={chooseWord} className="change-button">Change word</button>
        </section>
      </article>
    </>
  );
};