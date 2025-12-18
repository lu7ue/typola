import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../icons";

export default function TypingMode() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [set, setSet] = useState(null);
  const [started, setStarted] = useState(false);
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
    if (started) return;
    const onKey = () => setStarted(true);
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  useEffect(() => {
    if (!started || !set) return;

    const onKey = (e) => {
      if (e.key.length !== 1) return;

      const term = set.cards[cardIndex].term;
      if (charIndex >= term.length) return;

      if (e.key.toLowerCase() === term[charIndex].toLowerCase()) {
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
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, set, cardIndex, charIndex, navigate, setId]);

  if (!set) return null;

  const handleRestart = () => {
    setCardIndex(0);
    setStarted(false);
    const term = set.cards[0]?.term || "";
    setCharStates(Array.from(term).map(() => "pending"));
    setCharIndex(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const card = set.cards[cardIndex];

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-1 rounded-sm bg-[#7e7bf1] text-white"
        >
          Back
        </button>

        <div className="flex flex-wrap items-center gap-4 border border-gray-300 rounded-lg px-4 py-1 bg-white ml-auto">
          <div className="font-medium">{set.title}</div>
          <button className="text-[#7e7bf1]">Pause</button>
          <button className="text-[#7e7bf1]" onClick={handleRestart}>
            Restart
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative text-center">
          <div
            className={`space-y-4 transition ${
              !started ? "opacity-40 blur-[2px]" : "opacity-100 blur-0"
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-5xl">
              {card.term.split("").map((ch, i) => (
                <span
                  key={i}
                  className={
                    started
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
              <button>
                <Icons.Audio size={20} />
              </button>
            </div>

            <div className="text-lg text-gray-700">{card.definition}</div>
          </div>

          {!started && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-2xl font-medium text-gray-600 whitespace-nowrap">
                Press any key to start
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
