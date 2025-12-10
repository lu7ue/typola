import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Create from "./pages/Create";
import Collection from "./pages/Collection";
import Insights from "./pages/Insights";
import Setting from "./pages/Setting";

export default function App() {
  const [active, setActive] = useState("Create");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "Create":
        return <Create />;
      case "Collection":
        return <Collection />;
      case "Insights":
        return <Insights />;
      case "Setting":
        return <Setting />;
      default:
        return <div>Choose Menu</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="flex-1 p-6 bg-gray-200">{renderContent()}</div>
    </div>
  );
}
