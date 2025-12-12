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

export default function Card({ card, updateCard, deleteCard }) {
    return (
        <div className="relative bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            {/* Trash Button */}
            <button
                onClick={() => !card.isDefault && deleteCard(card.id)}
                className={`absolute top-2 right-2 p-1 rounded-full flex items-center justify-center
            ${card.isDefault ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"} transition`}
                title={card.isDefault ? "Cannot delete default card" : "Delete card"}
            >
                <TrashIcon size={16} color={card.isDefault ? "#ccc" : "#4b5563"} />
            </button>

            {/* Card ID */}
            <div className="text-lg font-medium mb-3">Card {card.id}</div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
                {/* Term */}
                <div>
                    <label className="block text-sm mb-1 text-gray-500">Term</label>
                    <input
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:border-[#4f5df5]"
                        placeholder="Enter term"
                        value={card.term}
                        onChange={(e) => updateCard(card.id, "term", e.target.value)}
                    />
                </div>

                {/* Definition */}
                <div>
                    <label className="block text-sm mb-1 text-gray-500">Definition</label>
                    <input
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:border-[#4f5df5]"
                        placeholder="Enter definition"
                        value={card.definition}
                        onChange={(e) => updateCard(card.id, "definition", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
