import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import Create from "./pages/Create";
import ImportData from "./pages/ImportData";
import Collection from "./pages/Collection";
import Insights from "./pages/Insights";
import Setting from "./pages/Setting";

export default function App() {
  const [active, setActive] = useState("Create");
  const [page, setPage] = useState("Create");
  const [collapsed, setCollapsed] = useState(false);

  const handleSidebarSelect = (tabName) => {
    // Sidebar navigation should change both highlighted tab and displayed page
    setActive(tabName);
    setPage(tabName);
  };

  const renderContent = () => {
    switch (page) {
      case "Create":
        return (
          <Create
            onImport={() => {
              // ImportData is a sub-page of Create, so keep Create tab active
              setPage("ImportData");
            }}
          />
        );
      case "ImportData":
        return <ImportData />;
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
    <div className="h-screen flex flex-col">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={active}
          setActive={handleSidebarSelect}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
