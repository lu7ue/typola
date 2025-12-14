// SVG icon components
import { NavLink } from "react-router-dom";
import { Icons } from "../icons";

const menuItems = [
  { name: "Create", Icon: Icons.Create, path: "/create" },
  { name: "Collection", Icon: Icons.Collection, path: "/collection" },
  { name: "Insights", Icon: Icons.Insights, path: "/insights" },
  { name: "Setting", Icon: Icons.Setting, path: "/setting" },
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
          className="text-gray-700 hover:text-black focus:outline-none"
        >
          {collapsed ? (
            <Icons.ChevronRightBar/>
          ) : (
            <Icons.BarChevronLeft/>
          )}
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
                    isActive
                      ? "bg-[#7e7bf1] text-black"
                      : "text-gray-700 hover:bg-gray-100"
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
          <span className="text-sm text-gray-500 leading-none mt-3">
            Footer Placeholder
          </span>
        )}
      </div>
    </div>
  );
}
