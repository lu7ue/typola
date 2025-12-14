import { useState } from "react";
import Card from "../components/Card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/Select";

export default function Create() {
  const navigate = useNavigate();

  // manage form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    termLanguage: "",
    definitionLanguage: "",
    cards: [{ id: 1, term: "", definition: "", image: null }],
  });

  const [errors, setErrors] = useState({});

  // update
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // update cards
  const updateCard = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      ),
    }));

    if (
      errors.firstCard &&
      id === 1 &&
      (field === "term" || field === "definition")
    ) {
      setErrors((prev) => ({ ...prev, firstCard: "" }));
    }
  };

  // add/delete cards
  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        { id: prev.cards.length + 1, term: "", definition: "", image: null },
      ],
    }));
  };

  const deleteCard = (id) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards
        .filter((card) => card.id !== id)
        .map((card, index) => ({ ...card, id: index + 1 })),
    }));
  };

  // drag
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(formData.cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const renumbered = reordered.map((card, index) => ({
      ...card,
      id: index + 1,
    }));

    setFormData((prev) => ({ ...prev, cards: renumbered }));
  };

  // error message
  const validateForm = () => {
  const errors = {};

  if (!formData.title) {
    errors.title = "Please enter a title";
  }

  if (!formData.termLanguage) {
    errors.termLanguage = "Please select a term language";
  }

  if (!formData.definitionLanguage) {
    errors.definitionLanguage = "Please select a definition language";
  }

  const firstCard = formData.cards[0];
  if (!firstCard.term && !firstCard.definition) {
    errors.firstCard = "First card cannot be empty";
  }

  return errors;
};

  // create set
  const handleCreateSet = async () => {
  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const setId = await window.backend.createSet({
    title: formData.title,
    description: formData.description,
  });

  for (const card of formData.cards) {
    if (card.term || card.definition) {
      await window.backend.createCard({
        set_id: setId,
        term: card.term,
        definition: card.definition,
        term_language: formData.termLanguage,
        definition_language: formData.definitionLanguage,
        image: card.image || null,
      });
    }
  }

  setFormData({
    title: "",
    description: "",
    termLanguage: "",
    definitionLanguage: "",
    cards: [{ id: 1, term: "", definition: "", image: null }],
  });

  setErrors({});
  navigate("/collection");
};


  const inputClass = (error) =>
    `w-full p-4 border-2 rounded-lg bg-white focus:outline-none focus:border-[#7e7bf1] ${
      error ? "border-red-400" : "border-gray-300"
    }`;


  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
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
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
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
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
          placeholder="Enter description"
        />
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold mb-2">
            Term Language *
          </label>
          <CustomSelect
            value={formData.termLanguage}
            onChange={(v) => updateField("termLanguage", v)}
            placeholder="Select a language"
            error={errors.termLanguage}
            options={[
              { value: "en", label: "English" },
              { value: "nl", label: "Dutch" },
              { value: "kr", label: "Korean" },
            ]}
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Definition Language *
          </label>
          <CustomSelect
            value={formData.definitionLanguage}
            onChange={(v) => updateField("definitionLanguage", v)}
            placeholder="Select a language"
            error={errors.definitionLanguage}
            options={[
              { value: "en", label: "English" },
              { value: "nl", label: "Dutch" },
              { value: "kr", label: "Korean" },
            ]}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Cards</h3>
          <span className="text-gray-500 text-sm">
            {formData.cards.length} card{formData.cards.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="cards-droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                  {formData.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-4 border border-gray-200"
                        >
                          {/* Index */}
                          <div className="w-6 text-gray-500 text-sm">{index + 1}</div>

                          {/* Card */}
                          <div className="flex-1">
                            <Card
                              card={card}
                              updateCard={updateCard}
                              deleteCard={deleteCard}
                              disableDelete={formData.cards.length === 1}
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
      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:justify-end gap-4">
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
