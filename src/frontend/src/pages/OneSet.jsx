import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OneSet() {
  const { setId } = useParams();
  const [set, setSet] = useState(null);

  useEffect(() => {
    window.backend.getSetById(Number(setId)).then(setSet);
  }, [setId]);

  if (!set) return null;

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl font-semibold">{set.title}</h2>

      {set.description && <p className="text-gray-600">{set.description}</p>}

      <p className="text-sm text-gray-500">{set.cardCount} cards</p>

      {/* cards will be rendered here later */}
    </div>
  );
}
