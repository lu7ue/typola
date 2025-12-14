import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import Create from "./pages/Create";
import Collection from "./pages/Collection";
import Insights from "./pages/Insights";
import Setting from "./pages/Setting";
import ImportData from "./pages/ImportData";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const isMac = window.backend?.platform === "darwin";


  return (
    <Router>
  {/* mac */}
  {isMac && (
    <div
      style={{
        height: "36px", 
        WebkitAppRegion: "drag",
        backgroundColor: "#f9fafb", 
        zIndex: 50,
      }}
    />
  )}

  <div
    className="flex flex-col overflow-hidden"
    style={{
      height: isMac ? "calc(100vh - 28px)" : "100vh",
    }}
  >
    {/* windows */}
    {!isMac && <TitleBar />}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div className="flex-1 overflow-y-auto bg-white">
            <div className="px-12 pt-8 pb-6">
              <Routes>
                <Route path="/create" element={<Create />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/importData" element={<ImportData />} />
                <Route path="*" element={<Create />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
