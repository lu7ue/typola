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
    setCharStates(Array.from(term).map(() => "idle"));
    setCharIndex(0);
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

      if (e.key === term[charIndex]) {
        setCharStates((prev) => {
          const next = [...prev];
          next[charIndex] = "correct";
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
            next[charIndex] = "idle";
            return next;
          });
        }, 500);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, set, cardIndex, charIndex, navigate, setId]);

  if (!set) return null;

  const card = set.cards[cardIndex];

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-wrap gap-4 items-start">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-1 rounded-sm bg-[#7e7bf1] text-white"
        >
          Back
        </button>

        <div className="flex flex-wrap items-center gap-4 border border-gray-300 rounded-lg px-4 py-1 bg-white">
          <div className="font-medium">{set.title}</div>
          <button className="text-[#7e7bf1]">Pause</button>
          <button
            className="text-[#7e7bf1]"
            onClick={() => {
              setCardIndex(0);
              setStarted(false);
            }}
          >
            Restart
          </button>
        </div>
      </div>

      {!started && (
        <div className="relative text-center">
          <div className="text-gray-500 mb-6">Press any key to start</div>
          <div className="blur-sm opacity-40">
            <div className="text-5xl mb-4">{card.term}</div>
            <div className="text-lg">{card.definition}</div>
          </div>
        </div>
      )}

      {started && (
        <div className="text-center space-y-6">
          <div className="text-5xl tracking-wide">
            {card.term.split("").map((ch, i) => (
              <span
                key={i}
                className={
                  charStates[i] === "correct"
                    ? "text-green-500"
                    : charStates[i] === "wrong"
                      ? "text-red-500"
                      : "text-gray-400"
                }
              >
                {ch}
              </span>
            ))}
          </div>

          <button className="mx-auto block">
            <Icons.Audio size={22} />
          </button>

          <div className="text-lg text-gray-700">{card.definition}</div>
        </div>
      )}
    </div>
  );
}
