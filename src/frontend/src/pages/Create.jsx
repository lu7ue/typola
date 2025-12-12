export default function Create({ onImport }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl mb-2">Create Page</h2>

        <button
          onClick={() => typeof onImport === "function" && onImport()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          {/* Import icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 3v10m0 0l4-4m-4 4l-4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Import
        </button>
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi pariatur
        aliquam reprehenderit repellat eius corrupti quisquam, itaque dicta odio
        temporibus? Id soluta doloribus perferendis quo voluptatem! Earum
        possimus fugit iusto a iste vero sit error alias, quos nesciunt velit,
        praesentium temporibus quasi blanditiis excepturi in pariatur
        doloremque. Ex expedita, debitis aspernatur accusantium laborum itaque
        inventore tenetur reprehenderit voluptates, totam aperiam provident
        numquam, sint a? Reprehenderit possimus repudiandae sed vero ea ratione!
        Dicta, blanditiis veniam sunt sed voluptas est sequi delectus facilis
        quod cum sint, at cupiditate maxime tempora alias ab neque suscipit
        ullam assumenda! Labore modi doloremque unde non!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi pariatur
        aliquam reprehenderit repellat eius corrupti quisquam, itaque dicta odio
        temporibus? Id soluta doloribus perferendis quo voluptatem! Earum
        possimus fugit iusto a iste vero sit error alias, quos nesciunt velit,
        praesentium temporibus quasi blanditiis excepturi in pariatur
        doloremque. Ex expedita, debitis aspernatur accusantium laborum itaque
        inventore tenetur reprehenderit voluptates, totam aperiam provident
        numquam, sint a? Reprehenderit possimus repudiandae sed vero ea ratione!
        Dicta, blanditiis veniam sunt sed voluptas est sequi delectus facilis
        quod cum sint, at cupiditate maxime tempora alias ab neque suscipit
        ullam assumenda! Labore modi doloremque unde non!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi pariatur
        aliquam reprehenderit repellat eius corrupti quisquam, itaque dicta odio
        temporibus? Id soluta doloribus perferendis quo voluptatem! Earum
        possimus fugit iusto a iste vero sit error alias, quos nesciunt velit,
        praesentium temporibus quasi blanditiis excepturi in pariatur
        doloremque. Ex expedita, debitis aspernatur accusantium laborum itaque
        inventore tenetur reprehenderit voluptates, totam aperiam provident
        numquam, sint a? Reprehenderit possimus repudiandae sed vero ea ratione!
        Dicta, blanditiis veniam sunt sed voluptas est sequi delectus facilis
        quod cum sint, at cupiditate maxime tempora alias ab neque suscipit
        ullam assumenda! Labore modi doloremque unde non!
      </p>
    </div>
  );
}
