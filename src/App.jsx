import { useEffect } from "react";
import { useState } from "react";

const App = () => {
  const [isResultPageActive, setIsResultPageActive] = useState(false);

  const [score, setScore] = useState(200);
  const [colors, setColors] = useState([]);
  const [colorNum, setColorNum] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [color, setColor] = useState({});
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState("");
  const [time, setTime] = useState(0);
  const [isTimeActive, setIsTimeActive] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  const getColors = async () => {
    try {
      const res = await fetch("https://random-colors-lovat.vercel.app/", {
        method: "GET",
      });

      const data = await res.json();

      if (data) setColors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getColors();
  }, []);

  useEffect(() => {
    if (colors) {
      setColor(colors[colorNum]);
    }
  }, [colors, colorNum]);

  useEffect(() => {
    let interval;
    if (isTimeActive) {
      interval = setInterval(() => {
        if (pageNum > 10) {
          setFinalTime(time);
          setTime(0);
          setIsTimeActive(false);
        } else {
          setTime(time + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimeActive, time, pageNum]);

  const handleChooseAnswer = (answer) => {
    setChosenAnswer(answer);
    if (color?.color !== answer) {
      setWrongAnswer(wrongAnswer + 1);
    }
  };

  const handleBtn = () => {
    setColorNum(colorNum + 1);
    setPageNum(pageNum + 1);

    setIsTimeActive(true);

    if (pageNum >= 10) {
      setIsResultPageActive(true);
    }
  };

  const finalScore = score / (wrongAnswer * 10);

  const handletryAgainBtn = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      {isResultPageActive ? (
        <>
          <div className="page2-quiz-wrapper">
            <div className="score">
              <span>{finalScore.toFixed(1)}</span>
            </div>
            <div className="result">
              <h3 className="title">Color Quiz</h3>
              <div className="result-text">
                <h1>your score is: {finalScore.toFixed(1)}</h1>
                <h1>Time: {finalTime}</h1>
              </div>
            </div>
          </div>
          <button
            className="page2-btn"
            onClick={handletryAgainBtn}
            disabled={!chosenAnswer}
          >
            try Again
          </button>
        </>
      ) : (
        <div className="quiz-wrapper">
          <div className="col1">
            <div className="score">
              <span>{score}</span>
            </div>
          </div>
          <div className="col2">
            <h3 className="title">Color Quiz</h3>
            <div className="color-wrapper">
              <span>color":</span>
              <div
                className="color"
                style={{ backgroundColor: color?.color }}
              ></div>
            </div>
            <div className="answers">
              {color?.answers?.map((answer, i) => (
                <div
                  className={
                    chosenAnswer === answer ? "answer-active" : "answer"
                  }
                  key={answer}
                  onClick={() => handleChooseAnswer(answer)}
                >
                  <div className="num">
                    <span>
                      {i === 0
                        ? "A"
                        : i === 1
                        ? "B"
                        : i === 2
                        ? "C"
                        : undefined}
                    </span>
                  </div>
                  <p className="value">{answer}</p>
                </div>
              ))}
            </div>
            <button
              className="btn"
              onClick={handleBtn}
              disabled={!chosenAnswer}
            >
              continue
            </button>
          </div>
          <div className="col3">
            <div className="page-count">
              <span>{pageNum}/10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
