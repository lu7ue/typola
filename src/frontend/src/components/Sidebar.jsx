// SVG icon components
import { NavLink } from "react-router-dom";
const CreateIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const CollectionIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const InsightsIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M7 15v3" />
    <path d="M12 9v9" />
    <path d="M17 5v13" />
  </svg>
);

const SettingIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .7.4 1.34 1.02 1.64.31.15.65.23.98.23H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ArrowToLeft = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ArrowToRight = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);


// Menu items configuration
const menuItems = [
  { name: "Create", Icon: CreateIcon, path: "/create" },
  { name: "Collection", Icon: CollectionIcon, path: "/collection" },
  { name: "Insights", Icon: InsightsIcon, path: "/insights" },
  { name: "Setting", Icon: SettingIcon, path: "/setting" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className={`bg-white text-black flex flex-col transition-all duration-300 border-r-2 border-gray-200 ${
        collapsed ? "w-14" : "w-48"
      } px-1 py-4`}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between px-2 mb-4">
        {!collapsed && <h1 className="text-xl font-bold italic"></h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-black text-xl focus:outline-none"
        >
          {collapsed ? <ArrowToRight /> : <ArrowToLeft />}
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive ? "bg-[#7e7bf1] text-black" : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.Icon />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`mt-auto ${collapsed ? "" : "border-t border-gray-200"} h-5 flex items-center justify-center`}
      >
        {!collapsed && (
          <span className="text-sm text-gray-500 leading-none mt-3">Footer Placeholder</span>
        )}
      </div>
    </div>
  );
}