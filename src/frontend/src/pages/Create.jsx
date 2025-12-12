import { useState } from "react";
import Card from "../components/Card";

export default function Create({ onCreateDone }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [termLanguage, setTermLanguage] = useState("");
  const [definitionLanguage, setDefinitionLanguage] = useState("");
  const [cards, setCards] = useState([
    { id: 1, term: "", definition: "", image: null },
    { id: 2, term: "", definition: "", image: null },
  ]);

  const [errors, setErrors] = useState({
    title: "",
    termLanguage: "",
    definitionLanguage: "",
  });

  const addCard = () => {
    setCards([...cards, { id: cards.length + 1, term: "", definition: "", image: null }]);
  };

  const updateCard = (id, field, value) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)));
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

    setErrors(newErrors);
    if (hasError) return;

    // set
    const setId = await window.backend.createSet({ title, description });

    // card
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

    // clear form
    setTitle("");
    setDescription("");
    setCards([]);
    setTermLanguage("");
    setDefinitionLanguage("");
    setErrors({ title: "", termLanguage: "", definitionLanguage: "" });

    if (typeof onCreateDone === "function") {
      onCreateDone();
    }
  };

  const inputClass = (error) =>
    `w-full border p-2 rounded ${error ? "border-red-500" : "border-gray-300"}`;

  const selectClass = (error) =>
    `w-full border p-2 rounded bg-white ${error ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold">Create set</h2>

      {/* Title */}
      <div>
        <label className="block mb-1 text-lg font-medium">Title</label>
        {errors.title && <p className="text-red-500 text-sm mb-1">{errors.title}</p>}
        <input
          className={inputClass(errors.title)}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) {
              setErrors(prev => ({ ...prev, title: "" }));
            }
          }}
          placeholder="Enter title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-lg font-medium">Description</label>
        <textarea
          className="w-full border p-3 rounded bg-gray-50 border-gray-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Language selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Term Language</label>
          {errors.termLanguage && (
            <p className="text-red-500 text-sm mb-1">{errors.termLanguage}</p>
          )}
          <select
            className={selectClass(errors.termLanguage)}
            value={termLanguage}
            onChange={(e) => {
              setTermLanguage(e.target.value);
              if (e.target.value) {
                setErrors(prev => ({ ...prev, termLanguage: "" }));
              }
            }}
          >
            <option value="">-----</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Definition Language</label>
          {errors.definitionLanguage && (
            <p className="text-red-500 text-sm mb-1">{errors.definitionLanguage}</p>
          )}
          <select
            className={selectClass(errors.definitionLanguage)}
            value={definitionLanguage}
            onChange={(e) => {
              setDefinitionLanguage(e.target.value);
              if (e.target.value) {
                setErrors(prev => ({ ...prev, definitionLanguage: "" }));
              }
            }}
          >
            <option value="">-----</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
        </div>
      </div>

      {/* Card list */}
      <div className="space-y-6">
        {cards.map((card) => (
          <Card key={card.id} card={card} updateCard={updateCard} />
        ))}
      </div>

      {/* Buttons */}
      <button
        className="mx-auto block mt-4 px-6 py-3 bg-[#7e7bf1] text-white rounded"
        onClick={addCard}
      >
        Add a card
      </button>
      <button
        className="px-6 py-3 bg-[#7e7bf1] text-white rounded"
        onClick={handleCreateSet}
      >
        Create
      </button>
    </div>
  );
}
