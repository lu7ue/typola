import { Icons } from "../icons";

export default function Card({ card, updateCard, deleteCard, disableDelete }) {
  return (
    <div className="relative pr-0 md:pr-10 pt-1">
      {/* Drag button */}
      <button
        className="absolute sm:top-0 sm:right-0 static sm:absolute p-1 rounded-full cursor-grab hover:bg-gray-200"
        title="Drag card"
      >
        <Icons.DragIcon color="#6b7280" />
      </button>
      {/* Trash Button */}
      <button
        onClick={() => !disableDelete && deleteCard(card.id)}
        className={`absolute sm:bottom-0 sm:right-0 static sm:absolute p-1 rounded-full flex items-center justify-center
                    ${disableDelete
            ? "bg-gray-100 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
          } transition`}
        title={disableDelete ? "Cannot delete the only card" : "Delete card"}
      >
        <Icons.TrashIcon color={disableDelete ? "#ccc" : "#4b5563"} />
      </button>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Term */}
        <div>
          <input
            className="w-full bg-gray-50 rounded-lg px-3 py-3 min-h-[52px]
            border border-gray-100
            focus:outline-none focus:ring-2 focus:ring-[#7e7bf1]"
            placeholder="Enter term"
            value={card.term}
            onChange={(e) => updateCard(card.id, "term", e.target.value)}
          />
          <div className="text-xs text-gray-400 mt-2">TERM</div>
        </div>

        {/* Definition */}
        <div>
          <input
            className="w-full bg-gray-50 rounded-lg px-3 py-3 min-h-[52px]
            border border-gray-100
            focus:outline-none focus:ring-2 focus:ring-[#7e7bf1]"
            placeholder="Enter definition"
            value={card.definition}
            onChange={(e) => updateCard(card.id, "definition", e.target.value)}
          />
          <div className="text-xs text-gray-400 mt-2">DEFINITION</div>
        </div>
      </div>
    </div>
  );
}
