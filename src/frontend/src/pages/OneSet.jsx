import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Icons } from "../icons";

export default function OneSet() {
  const { setId } = useParams();
  const [set, setSet] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    window.backend.getSetById(Number(setId)).then(setSet);
  }, [setId]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!openMenu) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpenMenu(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  if (!set) return null;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Title + description */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{set.title}</h2>
          {set.description && (
            <p className="text-sm text-gray-500">{set.description}</p>
          )}
        </div>

        {/* More menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Icons.MoreVertical />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                Edit Info
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                Export Set
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Typing Mode",
            hint: "Type exactly what you see on the screen.",
          },
          {
            label: "Practice Mode",
            hint: "Recall and type the hidden parts.",
          },
          {
            label: "Exam Mode",
            hint: "Pass the test to move your progress forward.",
          },
        ].map((mode) => (
          <div key={mode.label} className="relative group">
            <button className="w-full h-11 bg-gray-100 rounded-lg hover:bg-gray-200">
              {mode.label}
            </button>

            {/* Hover hint */}
            <div className="pointer-events-none absolute top-full mt-2 left-0 w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition z-40">
              {mode.hint}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      {/* Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Terms in this set{" "}
            <span className="text-gray-500 font-normal">({set.cardCount})</span>
          </h3>

          {/* Edit mode hint */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Icons.Edit />
            </button>

            {/* Hover hint */}
            <div className="pointer-events-none absolute top-full right-0 mt-2 w-36 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition z-40">
              Modify the terms in this set.
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          {set.cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition"
            >
              {/* Term */}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">TERM</div>
                <div className="text-gray-900 whitespace-pre-wrap break-words">
                  {card.term}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-200 self-stretch" />

              {/* Definition */}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">DEFINITION</div>
                <div className="text-gray-900 whitespace-pre-wrap break-words">
                  {card.definition}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-200 self-stretch" />

              {/* Audio */}
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200"
                title="Play audio"
              >
                <Icons.Audio />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
