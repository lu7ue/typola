import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ImportData() {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState("");

  const [termSeparator, setTermSeparator] = useState("dot");
  const [cardSeparator, setCardSeparator] = useState("newline");

  const [customTerm, setCustomTerm] = useState("-");
  const [customCard, setCustomCard] = useState("\\");

  const termSep = useMemo(() => {
    if (termSeparator === "dot") return ".";
    if (termSeparator === "comma") return ",";
    return customTerm;
  }, [termSeparator, customTerm]);

  const cardSep = useMemo(() => {
    if (cardSeparator === "newline") return "\n";
    if (cardSeparator === "semicolon") return ";";
    return customCard;
  }, [cardSeparator, customCard]);

  // Simple parsing:
  // - Split cards by selected separator
  // - Split term/definition by selected separator
  const cards = useMemo(() => {
    const text = rawText || "";
    const trimmed = text.trim();
    if (!trimmed) return [];

    const chunks =
      cardSep === "\n" ? trimmed.split(/\r?\n/) : trimmed.split(cardSep);

    return chunks
      .map((c) => c.trim())
      .filter(Boolean)
      .map((line) => {
        const [term, ...rest] = line.split(termSep);
        const definition = rest.join(termSep);
        return {
          term: (term || "").trim(),
          definition: (definition || "").trim(),
        };
      });
  }, [rawText, cardSep, termSep]);

  const hasPreview = cards.length > 0;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-1">Import your data</h2>
        <p className="text-gray-500 text-sm">
          Copy and paste your data here (e.g., from Word, Excel, etc.).
        </p>
        <p className="text-gray-500 text-sm">
          Use the options below to set your separators, and check the preview
          cards to adjust your content before confirming the import.
        </p>
      </div>

      {/* Textarea */}
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7e7bf1]"
        placeholder={`Term 1\t\tDefinition 1\nTerm 2\t\tDefinition 2\nTerm 3\t\tDefinition 3`}
      />

      {/* Options */}
      <div className="grid grid-cols-2 gap-16">
        {/* Between Term and Definition */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Between Term and Definition</h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="term-separator"
              className="w-5 h-5 accent-black"
              checked={termSeparator === "dot"}
              onChange={() => setTermSeparator("dot")}
            />
            <span>Dot</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="term-separator"
              className="w-5 h-5 accent-black"
              checked={termSeparator === "comma"}
              onChange={() => setTermSeparator("comma")}
            />
            <span>Comma</span>
          </label>

          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="term-separator"
              className="w-5 h-5 accent-black mt-1"
              checked={termSeparator === "custom"}
              onChange={() => setTermSeparator("custom")}
            />
            <input
              type="text"
              value={customTerm}
              onChange={(e) => setCustomTerm(e.target.value)}
              onFocus={() => setTermSeparator("custom")}
              placeholder="Custom"
              className="w-full border-b border-gray-400 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Between rows */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Between Rows</h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="card-separator"
              className="w-5 h-5 accent-black"
              checked={cardSeparator === "newline"}
              onChange={() => setCardSeparator("newline")}
            />
            <span>New Line</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="card-separator"
              className="w-5 h-5 accent-black"
              checked={cardSeparator === "semicolon"}
              onChange={() => setCardSeparator("semicolon")}
            />
            <span>Semicolon</span>
          </label>

          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="card-separator"
              className="w-5 h-5 accent-black mt-1"
              checked={cardSeparator === "custom"}
              onChange={() => setCardSeparator("custom")}
            />
            <input
              type="text"
              value={customCard}
              onChange={(e) => setCustomCard(e.target.value)}
              onFocus={() => setCardSeparator("custom")}
              placeholder="Custom"
              className="w-full border-b border-gray-400 focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Preview</h3>
          <span className="text-gray-500 text-sm">
            {cards.length} card{cards.length === 1 ? "" : "s"}
          </span>
        </div>

        {!hasPreview && (
          <p className="text-gray-400 text-sm">Nothing to preview yet.</p>
        )}

        {hasPreview && (
          <>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-center bg-white rounded-xl p-4 border border-gray-200"
                >
                  {/* Index */}
                  <div className="w-6 text-gray-500 text-sm">{index + 1}</div>

                  {/* Card */}
                  <div className="flex-1 grid grid-cols-2 gap-6">
                    <div>
                      <div className="bg-gray-50 rounded-lg p-3 text-gray-700 min-h-[52px] flex items-center border border-gray-100">
                        {card.term}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">TERM</div>
                    </div>

                    <div>
                      <div className="bg-gray-50 rounded-lg p-3 text-gray-700 min-h-[52px] flex items-center border border-gray-100">
                        {card.definition}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        DEFINITION
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider + Buttons (only when there is preview) */}
            <div className="border-t border-gray-200 pt-6 flex justify-end gap-4">
              <button
                onClick={() => navigate("/create")}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => navigate("/create")}
                className="px-5 py-2 rounded-full bg-[#7e7bf1] text-white hover:opacity-90"
              >
                Ready to Import
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
