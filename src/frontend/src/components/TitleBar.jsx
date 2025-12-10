export default function TitleBar() {
  return (
    <div
      className="h-8 bg-white text-gray-800 flex items-center px-3 select-none shadow-2xl"
      style={{ WebkitAppRegion: "drag" }}
    >
      <span className="text-sm text-left flex-1 font-bold italic">Typola</span>

      <div
        className="ml-auto flex gap-3"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <button onClick={() => window.backend.minimize()}>-</button>
        <button onClick={() => window.backend.maximize()}>□</button>
        <button onClick={() => window.backend.close()}>x</button>
      </div>
    </div>
  );
}
