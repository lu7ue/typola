import { useState } from "react";
import Card from "../components/Card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Create({ onCreateDone }) {
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
      newErrors.firstCard = "Please fill in at least the first card's term or definition";
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

    // Reset form
    setTitle("");
    setDescription("");
    setCards([{ id: 1, term: "", definition: "", image: null, isDefault: true }]);
    setTermLanguage("");
    setDefinitionLanguage("");
    setErrors({ title: "", termLanguage: "", definitionLanguage: "" });

    if (typeof onCreateDone === "function") onCreateDone();
  };

  const inputClass = (error) =>
    `w-full p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f5df5] ${error ? "ring-red-500" : ""
    }`;

  const selectClass = (error) =>
    `w-full p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f5df5] ${error ? "ring-red-500" : ""
    }`;

  // drag card
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
      <div>
        <h2 className="text-2xl font-semibold mb-1">Create Set</h2>
        <p className="text-gray-500 text-sm">
          Fill in the details below and add cards to your set.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        {errors.title && <p className="text-red-500 text-sm mb-1">{errors.title}</p>}
        <input
          className={inputClass(errors.title)}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="Enter title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f5df5]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Enter description"
        />
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium">Term Language</label>
          <select
            className={selectClass(errors.termLanguage)}
            value={termLanguage}
            onChange={(e) => {
              setTermLanguage(e.target.value);
              if (e.target.value) setErrors((prev) => ({ ...prev, termLanguage: "" }));
            }}
          >
            <option value="">-----</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
          {errors.termLanguage && (
            <p className="text-red-500 text-sm mt-1">{errors.termLanguage}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Definition Language</label>
          <select
            className={selectClass(errors.definitionLanguage)}
            value={definitionLanguage}
            onChange={(e) => {
              setDefinitionLanguage(e.target.value);
              if (e.target.value)
                setErrors((prev) => ({ ...prev, definitionLanguage: "" }));
            }}
          >
            <option value="">-----</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
          {errors.definitionLanguage && (
            <p className="text-red-500 text-sm mt-1">{errors.definitionLanguage}</p>
          )}
        </div>
      </div>

      {/* Cards with DragDrop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards-droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {errors.firstCard && (
                <p className="text-red-500 text-sm mb-2">{errors.firstCard}</p>
              )}
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-shadow ${snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                        }`}
                    >

                      <Card
                        card={card}
                        updateCard={updateCard}
                        deleteCard={deleteCard}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={addCard}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Add Card
        </button>
        <button
          onClick={handleCreateSet}
          className="px-6 py-2 bg-[#4f5df5] text-white rounded-lg hover:opacity-90 transition"
        >
          Create Set
        </button>
      </div>
    </div>
  );
}
