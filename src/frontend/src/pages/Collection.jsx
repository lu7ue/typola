import { useEffect, useRef, useState } from "react";
import { Icons } from "../icons";
import { useNavigate } from "react-router-dom";

export default function Collection() {
  const [sets, setSets] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.backend.getAllSets().then(setSets);
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!openMenuId) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpenMenuId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenuId]);

  const truncate = (text, max = 80) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-1">Collection</h2>
      </div>

      <div className="space-y-4">
        {sets.map((set) => (
          <div
            key={set.id}
            onClick={() => navigate(`/set/${set.id}`)}
            className="bg-gray-100 rounded-xl p-3 cursor-pointer transition-transform duration-200 hover:scale-[1.015]"
          >
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start justify-between gap-4">
              {/* Left */}
              <div className="flex items-start gap-4 min-w-0">
                {/* Progress */}
                <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center font-semibold text-black shrink-0 mt-1">
                  0%
                </div>

                {/* Text */}
                <div className="flex flex-col justify-between h-full min-w-0">
                  {/* Title + count */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 min-w-0">
                    <div className="font-semibold text-black truncate">
                      {set.title}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      {set.cardCount} cards
                    </div>
                  </div>

                  {/* Description */}
                  {set.description && (
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {set.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Right menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === set.id ? null : set.id);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Icons.MoreVertical />
                </button>

                {openMenuId === set.id && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Export this set
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {sets.length === 0 && (
          <p className="text-gray-400 text-sm">No sets yet.</p>
        )}
      </div>
    </div>
  );
}
