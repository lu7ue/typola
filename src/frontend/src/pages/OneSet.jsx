import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../icons";
import CustomSelect from "../components/Select";

export default function OneSet() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [set, setSet] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftTermLang, setDraftTermLang] = useState("");
  const [draftDefLang, setDraftDefLang] = useState("");

  const languageOptions = useMemo(
    () => [
      { value: "en", label: "English" },
      { value: "nl", label: "Dutch" },
      { value: "kr", label: "Korean" },
    ],
    []
  );

  useEffect(() => {
    window.backend.getSetById(Number(setId)).then((data) => {
      setSet(data);
    });
  }, [setId]);

  useEffect(() => {
    if (!set) return;
    const firstCard = set.cards[0];
    setDraftTitle(set.title || "");
    setDraftDescription(set.description || "");
    setDraftTermLang(firstCard?.term_language || "");
    setDraftDefLang(firstCard?.definition_language || "");
  }, [set]);

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

  const cancelEdit = () => {
    const ok = window.confirm(
      "Leaving now will discard your changes. Continue?"
    );
    if (!ok) return;

    const firstCard = set.cards[0];
    setDraftTitle(set.title || "");
    setDraftDescription(set.description || "");
    setDraftTermLang(firstCard?.term_language || "");
    setDraftDefLang(firstCard?.definition_language || "");
    setIsEditing(false);
  };

  const saveChanges = async () => {
    try {
      await window.backend.updateSetInfo({
        id: set.id,
        title: draftTitle,
        description: draftDescription,
      });

      await window.backend.updateSetLanguages({
        setId: set.id,
        termLanguage: draftTermLang,
        definitionLanguage: draftDefLang,
      });

      const updated = await window.backend.getSetById(set.id);
      setSet(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save set changes:", err);
      alert("Failed to save changes. Check console.");
    }
  };

  const inputClass =
    "w-full p-4 border-2 rounded-lg bg-white focus:outline-none focus:border-[#7e7bf1] border-gray-300";

  return (
    <div className="space-y-6 w-full">
      {/* Back */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-full bg-[#7e7bf1] text-white hover:opacity-90"
        >
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {!isEditing ? (
            <>
              <h2 className="text-2xl font-semibold">{set.title}</h2>
              {set.description && (
                <p className="text-sm text-gray-500">{set.description}</p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <input
                className={inputClass}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
              />
              <textarea
                className={inputClass}
                rows={3}
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Icons.MoreVertical />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-30">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setOpenMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
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

      {isEditing && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Term Language
              </label>
              <CustomSelect
                value={draftTermLang}
                onChange={setDraftTermLang}
                placeholder="Select language"
                options={languageOptions}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Definition Language
              </label>
              <CustomSelect
                value={draftDefLang}
                onChange={setDraftDefLang}
                placeholder="Select language"
                options={languageOptions}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:justify-end gap-4">
            <button
              onClick={cancelEdit}
              className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="px-5 py-2 rounded-full bg-[#7e7bf1] text-white hover:opacity-90"
            >
              Save changes
            </button>
          </div>
        </div>
      )}

      {/* Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {["Typing Mode", "Practice Mode", "Exam Mode"].map((m) => (
          <button
            key={m}
            className="h-11 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            {m}
          </button>
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

          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Icons.Edit />
            </button>

            <div className="pointer-events-none absolute top-full right-0 mt-2 w-36 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition z-40">
              Modify the terms in this set.
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          {set.cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">TERM</div>
                <div className="text-gray-900 break-words">{card.term}</div>
              </div>

              <div className="w-px bg-gray-200 self-stretch" />

              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">DEFINITION</div>
                <div className="text-gray-900 break-words">
                  {card.definition}
                </div>
              </div>

              <div className="w-px bg-gray-200 self-stretch" />

              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200">
                <Icons.Audio />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
