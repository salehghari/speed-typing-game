import { useEffect, useState, useRef } from 'react';
import { getRandomQuote } from '../lib/api';
import { IQuoteData } from '../types/api';
import WinningModal from './WinningModal';


export default function Quote() {
  const [quoteData, setQuoteData] = useState<IQuoteData | null>(null);
  const [textareaValue, setTextareaValue] = useState("");
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const percentageRemaining = (timer / 60) * 100;
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [error, setError] = useState("");
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextareaValue(value);
    const wordsInQuote = quoteData!.content.split(' ').length;
    const averageCharsPerWord = quoteData!.content.length / wordsInQuote
    const speedTypingCPM = value.length / ((60 - timer) / 60);
    

    setTypingSpeed(speedTypingCPM / averageCharsPerWord); // Words per minute (WPM)

    const arrayValue = value.split("");

    spanRefs.current.map((characterSpan, index) => {
      const character = arrayValue[index];

      if (character == null) {
        // If the character is not written yet
        characterSpan?.classList.remove('correct');
        characterSpan?.classList.remove('incorrect');
      } else if (character === characterSpan?.innerText) {
        // If the character is right
        characterSpan.classList.add('correct');
        characterSpan.classList.remove('incorrect');
      } else {
        // If the character is wrong
        characterSpan?.classList.remove('correct');
        characterSpan?.classList.add('incorrect');
      }
    });
    if (e.target.value === quoteData?.content) {
      // If all characters are right
      setShowModal(true);
      setIsGameOver(true);
    }
  }

  const resetSpansClass = () => {
    spanRefs.current.map(elem => {
      elem?.classList.remove('correct');
      elem?.classList.remove('incorrect');
    });
  }

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };
  
  const getNewRandomQuote = () => {
    getRandomQuote(minLength, maxLength)
      .then((data) => {
        setQuoteData(data);
        setTextareaValue("");
        setTimer(60);
        setIsGameOver(false);
        setTypingSpeed(0);
        setError("");
        resetSpansClass();
      })
      .catch((error) => setError(error));
  };

  const tryAgain = () => {
    setTimer(60);
    setTypingSpeed(0);
    setTextareaValue("");
    resetSpansClass();
  }
  

  useEffect(() => {
    let isMounted = true;

    getRandomQuote(minLength, maxLength)
      .then((data) => {
        if (isMounted) {
          setQuoteData(data);       
        }
      })
      .catch((error) => setError(error));
      

    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    if (timer === 0 || showModal || error) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const getWinMessage = (typingSpeedWPM: number): string => {
    switch (true) {
      case typingSpeedWPM < 30:
        return "You can do better! 😉";
      case typingSpeedWPM < 50:
        return "Not bad! Keep practicing. 😊";
      case typingSpeedWPM < 70:
        return "Good job! You're improving. 😃";
      case typingSpeedWPM < 90:
        return "Well done! You're getting faster. 🤩";
      default:
        return "Amazing! You're a typing master! 💀";
    }
  };


  if (!quoteData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="setting flex justify-between mb-3">
        <input
          type="number"
          min={30}
          max={350}
          className="border-b-2 border-b-zinc-300 w-5/12 transition-colors outline-none rounded-sm border-2 border-transparent focus-visible:border-b-slate-400"
          placeholder="Min length"
          value={minLength}
          onChange={(e) => setMinLength(e.target.value)}
        />
        <input
          type="number"
          min={30}
          max={400}
          className="border-b-2 border-b-zinc-300 w-5/12 transition-colors outline-none rounded-sm border-2 border-transparent focus-visible:border-b-slate-400"
          placeholder="Max length"
          value={maxLength}
          onChange={(e) => setMaxLength(e.target.value)}
        />
      </div>
      <div className="card flex flex-col justify-center py-4 px-4 rounded-lg">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex flex-col justify-center">
            <div className="timer-text -mt-2"><span className="numbers">{timer}</span> seconds</div>
            <div className="timer-bar-container relative bg-slate-300">
              <div
                className="timer-bar absolute bottom-0"
                style={{ width: `${percentageRemaining}%` }}
              />
            </div>
          </div>
        </div>
        <div>
          Typing Speed: <span className="numbers">{typingSpeed.toFixed(2)}</span> WPM
        </div>
        <div className="quote-display mt-2">
          {quoteData.content.split('').map((character: string, index) => (
            <span key={index} ref={(el) => (spanRefs.current[index] = el)} className="md:text-xl">{character}</span>
          ))}
          <p className="text-sm text-slate-500">&rdquo;{quoteData.author}&rdquo;</p>
        </div>
        <div className="flex justify-center">
          <textarea
            className="lg:w-3/5 w-full max-h-60 h-32 mt-2 transition-colors outline-none rounded-sm border-2 border-transparent indent-1 shadow-inner focus-visible:border-slate-400 bg-transparent"
            value={textareaValue}
            onChange={handleTextareaChange}
            autoFocus
            onDrop={(e) => e.preventDefault()}
            placeholder="Start typing..."
            disabled={timer === 0 || isGameOver}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          >
          </textarea>
        </div>
        <div className="flex justify-center">
          {timer === 0 && !error &&
            <div className="time-is-up-text bg-slate-200 p-1 rounded-sm w-full lg:w-72 sm:text-base text-xs text-center mt-2 ">
              Oops! Time&apos;s up.. 💔 <span onClick={tryAgain}>Try Again</span>
            </div>
          }
          {error &&
            <div className="error-text bg-slate-500 p-1 rounded-sm w-full lg:w-56 text-center mt-2 text-white">
                Failed to fetch data.. 🙁
            </div>
          }
        </div>
        <div>
          <button
            className="start-btn mt-3 px-3 py-1 rounded-sm text-white cursor-pointer hover:opacity-80 transition-opacity"
            onClick={getNewRandomQuote}>
              {isGameOver ? "Start Again" : "Start"}
          </button>
        </div>
      </div>
      {showModal && (
        <WinningModal
          typingSpeed={typingSpeed}
          timeLeft={timer}
          message={getWinMessage(typingSpeed)} // fix
          onClose={closeModal}
        />
      )}
    </div>
  );
};
