import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../icons";

export default function TypingMode() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [set, setSet] = useState(null);
  const [gameState, setGameState] = useState("notStarted");
  const [cardIndex, setCardIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [charStates, setCharStates] = useState([]);

  const timeoutRef = useRef(null);

  useEffect(() => {
    window.backend.getSetById(Number(setId)).then(setSet);
  }, [setId]);

  useEffect(() => {
    if (!set) return;
    const term = set.cards[cardIndex]?.term || "";
    setCharStates(Array.from(term).map(() => "pending"));
    setCharIndex(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [set, cardIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (gameState === "notStarted" || gameState === "paused") {
        e.preventDefault();
        if (gameState === "notStarted") {
          setGameState("playing");
        } else if (gameState === "paused") {
          setGameState("playing");
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing" || !set) return;

    const onKey = (e) => {
      if (e.key === " " || e.key.length === 1) {
        const term = set.cards[cardIndex].term;
        if (charIndex >= term.length) return;

        const typedChar = e.key.toLowerCase();
        const targetChar = term[charIndex].toLowerCase();

        if (typedChar === targetChar) {
          setCharStates((prev) => {
            const next = [...prev];
            next[charIndex] = "correct";
            for (let i = 0; i < charIndex; i++) {
              if (next[i] === "pending") {
                next[i] = "correct";
              }
            }
            return next;
          });

          if (charIndex + 1 === term.length) {
            if (cardIndex + 1 === set.cards.length) {
              setTimeout(() => {
                window.alert("This set is completed.");
                navigate(`/set/${setId}`);
              }, 300);
            } else {
              setTimeout(() => setCardIndex((i) => i + 1), 300);
            }
          } else {
            setCharIndex((i) => i + 1);
          }
        } else {
          setCharStates((prev) => {
            const next = [...prev];
            next[charIndex] = "wrong";
            return next;
          });

          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setCharStates((prev) => {
              const next = [...prev];
              for (let i = 0; i < charIndex; i++) {
                if (next[i] === "correct") {
                } else if (next[i] === "wrong" && i === charIndex) {
                  next[i] = "pending";
                }
              }
              next[charIndex] = "pending";
              return next;
            });
          }, 500);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, set, cardIndex, charIndex, navigate, setId]);

  const handlePauseContinue = () => {
    if (gameState === "playing") {
      setGameState("paused");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (gameState === "paused") {
      setGameState("playing");
    } else if (gameState === "notStarted") {
      setGameState("playing");
    }
  };

  const handleRestart = () => {
    setCardIndex(0);
    setGameState("notStarted");
    const term = set?.cards[0]?.term || "";
    setCharStates(Array.from(term).map(() => "pending"));
    setCharIndex(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Prevent spacebar from triggering button clicks
  const preventSpaceClick = (e) => {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
    }
  };

  if (!set) return null;

  const card = set.cards[cardIndex];
  const showOverlay = gameState === "notStarted" || gameState === "paused";

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <button
          onClick={() => navigate(`/set/${setId}`)}
          className="px-6 py-1 rounded-sm bg-[#7e7bf1] text-white focus:outline-none"
          onKeyDown={preventSpaceClick}
        >
          Back
        </button>

        <div className="flex flex-wrap items-center gap-4 border border-gray-300 rounded-lg px-4 py-1 bg-white ml-auto">
          <div className="font-medium">{set.title}</div>
          <button
            className="text-[#7e7bf1] focus:outline-none"
            onClick={handlePauseContinue}
            onKeyDown={preventSpaceClick}
          >
            {gameState === "paused"
              ? "Continue"
              : gameState === "notStarted"
                ? "Start"
                : "Pause"}
          </button>
          <button
            className="text-[#7e7bf1] focus:outline-none"
            onClick={handleRestart}
            onKeyDown={preventSpaceClick}
          >
            Restart
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative text-center">
          <div
            className={`space-y-4 transition ${
              showOverlay ? "opacity-40 blur-[2px]" : "opacity-100 blur-0"
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-5xl">
              {card.term.split("").map((ch, i) => (
                <span
                  key={i}
                  className={
                    gameState === "playing"
                      ? charStates[i] === "correct"
                        ? "text-green-500"
                        : charStates[i] === "wrong"
                          ? "text-red-500"
                          : "text-gray-300"
                      : "text-gray-300"
                  }
                >
                  {ch}
                </span>
              ))}
              <button
                className="ml-2 w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-200 focus:outline-none"
                onKeyDown={preventSpaceClick}
              >
                <Icons.Audio size={28} />
              </button>
            </div>

            <div className="text-lg text-gray-700">{card.definition}</div>
          </div>

          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-2xl font-medium text-gray-600 whitespace-nowrap">
                {gameState === "paused"
                  ? "Press any key to continue"
                  : "Press any key to start"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
