import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../icons";
import CustomSelect from "../components/Select";
import EditableCards from "../components/EditableCards";

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

  const [isEditingCards, setIsEditingCards] = useState(false);
  const [draftCards, setDraftCards] = useState([]);

  useEffect(() => {
    window.backend.getSetById(Number(setId)).then(setSet);
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
      if (menuRef.current?.contains(e.target)) return;
      setOpenMenu(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  if (!set) return null;

  const cancelEditInfo = () => {
    if (!window.confirm("Leaving now will discard your changes. Continue?")) {
      return;
    }
    const firstCard = set.cards[0];
    setDraftTitle(set.title || "");
    setDraftDescription(set.description || "");
    setDraftTermLang(firstCard?.term_language || "");
    setDraftDefLang(firstCard?.definition_language || "");
    setIsEditing(false);
  };

  const saveEditInfo = async () => {
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
  };

  const inputClass =
    "w-full p-4 border-2 rounded-lg bg-white focus:outline-none focus:border-[#7e7bf1] border-gray-300";

  const modeDisabled = isEditing || isEditingCards;

  return (
    <div className="space-y-6 w-full">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-1 rounded-sm bg-[#7e7bf1] text-white hover:opacity-90"
        >
          Back
        </button>
      </div>

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
                  if (isEditingCards) return;
                  setOpenMenu(false);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Edit Info
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                Export Set
              </button>
              <button
                onClick={async () => {
                  const ok = window.confirm(
                    `Delete this set?\n\n"${set.title}"`
                  );
                  if (!ok) return;

                  await window.backend.deleteSet(set.id);
                  navigate(-1);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
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
                options={languageOptions}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-end gap-4">
            <button
              onClick={cancelEditInfo}
              className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={saveEditInfo}
              className="px-5 py-2 rounded-full bg-[#7e7bf1] text-white hover:opacity-90"
            >
              Save changes
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          disabled={modeDisabled}
          onClick={() => {
            if (modeDisabled) return;
            navigate(`/set/${set.id}/typing`);
          }}
          className={`h-11 rounded-lg ${
            modeDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Typing Mode
        </button>

        <button
          disabled={modeDisabled}
          onClick={() => {
            if (modeDisabled) return;
            window.alert("Practice mode is not implemented yet.");
          }}
          className={`h-11 rounded-lg ${
            modeDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Practice Mode
        </button>

        <button
          disabled={modeDisabled}
          onClick={() => {
            if (modeDisabled) return;
            window.alert("Exam mode is not implemented yet.");
          }}
          className={`h-11 rounded-lg ${
            modeDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Exam Mode
        </button>
      </div>

      <hr className="border-gray-200" />

      {!isEditingCards ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Terms in this set{" "}
              <span className="text-gray-500 font-normal">
                ({set.cardCount})
              </span>
            </h3>

            <button
              onClick={() => {
                if (isEditing) return;
                setOpenMenu(false);
                setDraftCards(
                  set.cards.map((c) => ({
                    id: c.id,
                    term: c.term,
                    definition: c.definition,
                  }))
                );
                setIsEditingCards(true);
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Icons.Edit />
            </button>
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
      ) : (
        <EditableCards
          cards={draftCards}
          setCards={setDraftCards}
          onCancel={() => {
            if (!window.confirm("Discard changes?")) return;
            setDraftCards([]);
            setIsEditingCards(false);
          }}
          onSave={async () => {
            const existingIds = set.cards.map((c) => c.id);
            const draftIds = draftCards
              .filter((c) => !c._isNew)
              .map((c) => c.id);

            const deletedIds = existingIds.filter(
              (id) => !draftIds.includes(id)
            );
            if (deletedIds.length) {
              await window.backend.deleteCards(deletedIds);
            }

            for (const card of draftCards) {
              if (card._isNew) {
                await window.backend.createCard({
                  set_id: set.id,
                  term: card.term,
                  definition: card.definition,
                  term_language: set.cards[0].term_language,
                  definition_language: set.cards[0].definition_language,
                });
              } else {
                await window.backend.updateCard(card);
              }
            }

            const updated = await window.backend.getSetById(set.id);
            setSet(updated);
            setDraftCards([]);
            setIsEditingCards(false);
          }}
        />
      )}
    </div>
  );
}
