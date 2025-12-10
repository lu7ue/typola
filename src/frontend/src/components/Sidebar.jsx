import React from "react";
import Icon from "../assets/icons/fold.png";
import CreateIcon from "../assets/icons/create.png";
import CollectionIcon from "../assets/icons/collection.png";
import InsightsIcon from "../assets/icons/insights.png";
import SettingIcon from "../assets/icons/setting.png";
import ArrowToLeft from "../assets/icons/arrow-to-left.png";
import ArrowToRight from "../assets/icons/arrow-to-right.png";

// Menu items configuration
const menuItems = [
  { name: "Create", icon: CreateIcon },
  { name: "Collection", icon: CollectionIcon },
  { name: "Insights", icon: InsightsIcon },
  { name: "Setting", icon: SettingIcon },
];

export default function Sidebar({
  active,
  setActive,
  collapsed,
  setCollapsed,
}) {
  return (
    <div
      className={`
        h-screen bg-white text-black flex flex-col transition-all duration-300
        ${collapsed ? "w-14" : "w-64"} px-1 py-4`}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between px-2 mb-4">
        {/* put something else here if needed */}
        {!collapsed && <h1 className="text-xl font-bold italic"></h1>}{" "}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-black text-xl focus:outline-none"
        >
          <img
            src={collapsed ? ArrowToRight : ArrowToLeft}
            alt="Toggle"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`
                flex items-center gap-3 p-3 mb-2 cursor-pointer rounded-xl transition-all duration-200
                ${
                  active === item.name
                    ? "bg-[#706df0]"
                    : "hover:bg-[#f1f1fb] hover:text-black"
                }`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />

              {/* Menu text, hidden when collapsed */}
              {!collapsed && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`px-4 mt-auto ${
          collapsed ? "" : "border-t border-gray-500"
        }`}
      >
        {!collapsed && (
          <span className="text-sm text-gray-600">Footer Placeholder</span>
        )}
      </div>
    </div>
  );
}
