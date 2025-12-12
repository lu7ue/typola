import { useState } from "react";
import Card from "../components/Card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [termLanguage, setTermLanguage] = useState("");
  const [definitionLanguage, setDefinitionLanguage] = useState("");
  const [cards, setCards] = useState([
    { id: 1, term: "", definition: "", image: null, isDefault: true },
  ]);

  const [errors, setErrors] = useState({
    title: "",
    termLanguage: "",
    definitionLanguage: "",
    firstCard: "",
  });

  const addCard = () => {
    setCards([
      ...cards,
      { id: cards.length + 1, term: "", definition: "", image: null },
    ]);
  };

  const deleteCard = (id) => {
    const newCards = cards
      .filter((card) => card.id !== id)
      .map((card, index) => ({ ...card, id: index + 1 }));
    setCards(newCards);
  };

  const updateCard = (id, field, value) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );

    if (id === 1 && (field === "term" || field === "definition")) {
      setErrors((prev) => {
        const firstCardContent = field === "term" ? value : cards[0].term;
        const firstCardDef =
          field === "definition" ? value : cards[0].definition;

        if (firstCardContent || firstCardDef) {
          return { ...prev, firstCard: "" };
        }
        return prev;
      });
    }
  };

  const handleCreateSet = async () => {
    let newErrors = { title: "", termLanguage: "", definitionLanguage: "" };
    let hasError = false;

    if (!title) {
      newErrors.title = "Please enter a title";
      hasError = true;
    }
    if (!termLanguage) {
      newErrors.termLanguage = "Please select a term language";
      hasError = true;
    }
    if (!definitionLanguage) {
      newErrors.definitionLanguage = "Please select a definition language";
      hasError = true;
    }

    const firstCard = cards[0];
    if (!firstCard.term && !firstCard.definition) {
      newErrors.firstCard =
        "Please fill in at least the first card's term or definition";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const setId = await window.backend.createSet({ title, description });

    for (const card of cards) {
      if (card.term || card.definition) {
        await window.backend.createCard({
          set_id: setId,
          term: card.term,
          definition: card.definition,
          term_language: termLanguage,
          definition_language: definitionLanguage,
          image: card.image || null,
        });
      }
    }

    setTitle("");
    setDescription("");
    setCards([
      { id: 1, term: "", definition: "", image: null, isDefault: true },
    ]);
    setTermLanguage("");
    setDefinitionLanguage("");
    setErrors({ title: "", termLanguage: "", definitionLanguage: "" });

    navigate("/collection");
  };

  const inputClass = (error) =>
    `w-full p-4 border-2 rounded-lg bg-white focus:outline-none focus:border-[#7e7bf1] ${
      error ? "border-red-400" : "border-gray-300"
    }`;

  const selectClass = (error) =>
    `w-full p-4 border-2 rounded-lg bg-white focus:outline-none focus:border-[#7e7bf1] ${
      error ? "border-red-400" : "border-gray-300"
    }`;

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const renumbered = reordered.map((card, index) => ({
      ...card,
      id: index + 1,
    }));

    setCards(renumbered);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl mb-1">Create Set</h2>
          <p className="text-gray-500 text-sm">
            Fill in the details below and add cards to your set.
          </p>
        </div>

        <button
          onClick={() => navigate("/importData")}
          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Import Data
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-lg font-semibold mb-2">Title *</label>
        {errors.title && (
          <p className="text-red-500 text-sm mb-1">{errors.title}</p>
        )}
        <input
          className={inputClass(errors.title)}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim())
              setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="Enter title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          Description (optional)
        </label>
        <textarea
          className={inputClass(false)}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter description"
        />
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold mb-2">
            Term Language *
          </label>
          <select
            className={selectClass(errors.termLanguage)}
            value={termLanguage}
            onChange={(e) => {
              setTermLanguage(e.target.value);
              if (e.target.value)
                setErrors((prev) => ({ ...prev, termLanguage: "" }));
            }}
          >
            <option value=""> - </option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Definition Language *
          </label>
          <select
            className={selectClass(errors.definitionLanguage)}
            value={definitionLanguage}
            onChange={(e) => {
              setDefinitionLanguage(e.target.value);
              if (e.target.value)
                setErrors((prev) => ({ ...prev, definitionLanguage: "" }));
            }}
          >
            <option value=""> - </option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Cards</h3>
          <span className="text-gray-500 text-sm">
            {cards.length} card{cards.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="cards-droppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={String(card.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex gap-6 items-center bg-white rounded-xl p-4 border border-gray-200"
                        >
                          {/* Index */}
                          <div className="w-6 text-gray-500 text-sm">
                            {index + 1}
                          </div>

                          {/* Card */}
                          <div className="flex-1">
                            <Card
                              card={card}
                              updateCard={updateCard}
                              deleteCard={deleteCard}
                              disableDelete={cards.length === 1}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Buttons */}
      <div className="border-t border-gray-200 pt-6 flex justify-end gap-4">
        <button
          onClick={addCard}
          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Add Card
        </button>
        <button
          onClick={handleCreateSet}
          className="px-5 py-2 rounded-full bg-[#7e7bf1] text-white hover:opacity-90"
        >
          Create Set
        </button>
      </div>
    </div>
  );
}
