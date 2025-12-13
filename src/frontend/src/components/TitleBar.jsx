import { useEffect, useState } from "react";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let cleanup = null;

    (async () => {
      const initial = await window.backend.getIsMaximized();
      setIsMaximized(!!initial);
      cleanup = window.backend.onMaximizedChanged((v) => setIsMaximized(!!v));
    })();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      className="h-8 bg-white text-gray-800 flex items-center select-none border-b border-gray-300 relative"
      style={{ WebkitAppRegion: "drag" }}
    >
      <div
        className="absolute right-0 top-0 h-full flex"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <button
          onClick={() => window.backend.minimize()}
          className="w-10 h-full flex items-center justify-center hover:bg-gray-200"
        >
          −
        </button>

        <button
          onClick={() => window.backend.maximize()}
          className="w-10 h-full flex items-center justify-center hover:bg-gray-200"
        >
          {isMaximized ? "🗗" : "🗖"}
        </button>

        <button
          onClick={() => window.backend.close()}
          className="w-10 h-full flex items-center justify-center hover:bg-red-500 hover:text-white rounded-tr-lg"
        >
          🗙
        </button>
      </div>
    </div>
  );
}
