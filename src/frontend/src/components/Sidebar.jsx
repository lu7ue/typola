import React from "react";
import Icon from "../assets/icons/fold.png";

// 菜单项数组，每项包含名字和图标
const menuItems = [
    { name: "Create", icon: Icon },
    { name: "Collection", icon: Icon },
    { name: "Insights", icon: Icon },
    { name: "Setting", icon: Icon },
];

export default function Sidebar({ active, setActive, collapsed, setCollapsed }) {
    return (
        <div
            className={`
        h-screen bg-white text-black flex flex-col transition-all duration-300
        ${collapsed ? "w-14" : "w-64"} px-1 py-4`}
        >
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between px-2 mb-4">
                {!collapsed && <h1 className="text-2xl font-bold">Typola</h1>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-black text-xl focus:outline-none"
                >
                    <img src={Icon} alt="Fold" className="w-6 h-6" />
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
                ${active === item.name ? "bg-[#706df0]" : "hover:bg-[#f1f1fb] hover:text-black"}`}
                        >
                            <img src={item.icon} alt={item.name} className="w-6 h-6" />
                            
                            {/* Menu text, hidden when collapsed */}
                            {!collapsed && <span>{item.name}</span>}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="px-4 border-t border-gray-700 mt-auto">
                {!collapsed && "Footer"}
            </div>
        </div>
    );
}
