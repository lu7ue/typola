export default function Card({ card, updateCard }) {
    return (
        <div className="border p-4 rounded-lg shadow-sm bg-white">

            <div className="text-lg mb-3 font-medium">{card.id}</div>

            <div className="grid grid-cols-2 gap-4">

                {/* Term */}
                <div>
                    <label className="block text-sm mb-1 text-gray-600">Term</label>
                    <input
                        className="w-full border p-2 rounded bg-gray-50"
                        placeholder="Enter term"
                        value={card.term}
                        onChange={(e) => updateCard(card.id, "term", e.target.value)}
                    />
                </div>

                {/* Definition */}
                <div>
                    <label className="block text-sm mb-1 text-gray-600">Definition</label>
                    <input
                        className="w-full border p-2 rounded bg-gray-50"
                        placeholder="Enter definition"
                        value={card.definition}
                        onChange={(e) =>
                            updateCard(card.id, "definition", e.target.value)
                        }
                    />
                </div>

            </div>
        </div>
    );
}
