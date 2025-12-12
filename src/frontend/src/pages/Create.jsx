import { useState } from "react";
import Card from "../components/Card";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [termLanguage, setTermLanguage] = useState("");
  const [definitionLanguage, setDefinitionLanguage] = useState("");


  const [cards, setCards] = useState([
    { id: 1, term: "", definition: "", image: null },
    { id: 2, term: "", definition: "", image: null },
  ]);

  const addCard = () => {
    setCards([
      ...cards,
      {
        id: cards.length + 1,
        term: "",
        definition: "",
        image: null,
      },
    ]);
  };

  const updateCard = (id, field, value) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold">Create set</h2>

      {/* Title */}
      <div>
        <label className="block mb-1 text-lg font-medium">Title</label>
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-lg font-medium">Description</label>
        <textarea
          className="w-full border p-3 rounded bg-gray-50"
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded bg-gray-200">+ Import</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Term drop down */}
        <div>
          <label className="block mb-1 font-medium">Term Language</label>
          <select
            className="w-full border p-2 rounded bg-white"
            value={termLanguage}
            onChange={(e) => setTermLanguage(e.target.value)}
          >
            <option value="">-----</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
        </div>

        {/* Definition drop down */}
        <div>
          <label className="block mb-1 font-medium">Definition Language</label>
          <select
            className="w-full border p-2 rounded bg-white"
            value={definitionLanguage}
            onChange={(e) => setDefinitionLanguage(e.target.value)}
          >
            <option value="">-----</option>
            <option value="en">English</option>
            <option value="nl">Dutch</option>
            <option value="kr">Korean</option>
          </select>
        </div>
      </div>

      {/* Card */}
      <div className="space-y-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            updateCard={updateCard}
          />
        ))}
      </div>

      {/* Add card */}
      <button
        className="mx-auto block mt-4 px-6 py-3 bg-[#7e7bf1] text-white rounded"
        onClick={addCard}
      >
        Add a card
      </button>
    </div>
  );
}
