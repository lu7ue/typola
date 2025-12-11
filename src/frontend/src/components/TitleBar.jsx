export default function TitleBar() {
  return (
    <div
      className="h-8 bg-white text-gray-800 flex items-center select-none border-b border-gray-300 relative"
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* title on the left, put something else here if needed */}
      {/* <span className="text-sm font-bold italic pl-3"></span> */}

      {/* right buttons, absolutely positioned */}
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
          ☐
        </button>

        <button
          onClick={() => window.backend.close()}
          className="w-10 h-full flex items-center justify-center hover:bg-red-500 hover:text-white rounded-tr-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
