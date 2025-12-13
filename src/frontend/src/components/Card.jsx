const TrashIcon = ({ size = 20, color = "gray" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const DragIcon = ({ size = 16, color = "gray" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="5" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);

export default function Card({ card, updateCard, deleteCard, disableDelete }) {
  return (
    <div className="relative pr-0 md:pr-10 pt-1">
      {/* Drag button */}
      <button
        className="absolute sm:top-0 sm:right-0 static sm:absolute p-1 rounded-full cursor-grab hover:bg-gray-200"
        title="Drag card"
      >
        <DragIcon size={16} color="#6b7280" />
      </button>
      {/* Trash Button */}
      <button
        onClick={() => !disableDelete && deleteCard(card.id)}
        className={`absolute sm:bottom-0 sm:right-0 static sm:absolute p-1 rounded-full flex items-center justify-center
                    ${
                      disableDelete
                        ? "bg-gray-100 cursor-not-allowed"
                        : "hover:bg-gray-200 cursor-pointer"
                    } transition`}
        title={disableDelete ? "Cannot delete the only card" : "Delete card"}
      >
        <TrashIcon size={16} color={disableDelete ? "#ccc" : "#4b5563"} />
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
