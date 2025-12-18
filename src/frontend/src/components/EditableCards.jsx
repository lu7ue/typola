import Card from "./Card";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function EditableCards({ cards, setCards, onCancel, onSave }) {
  const updateCard = (id, field, value) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addCard = () => {
    setCards((prev) => [
      ...prev,
      {
        id: Date.now(),
        term: "",
        definition: "",
        _isNew: true,
      },
    ]);
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setCards(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Cards</h3>
        <span className="text-gray-500 text-sm">
          {cards.length} card{cards.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cards">
            {(dropProvided) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className="space-y-4"
              >
                {cards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={String(card.id)}
                    index={index}
                  >
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={dragProvided.draggableProps.style}
                        className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-4 border border-gray-200"
                      >
                        <div className="w-6 text-gray-500 text-sm">
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <Card
                            card={card}
                            updateCard={updateCard}
                            deleteCard={deleteCard}
                            disableDelete={cards.length === 1}
                            dragHandleProps={dragProvided.dragHandleProps}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <div className="flex gap-4 sm:justify-end">
          <button
            onClick={addCard}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Add Card
          </button>

          <button
            onClick={onSave}
            className="px-5 py-2 rounded-full bg-[#7e7bf1] text-white hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
