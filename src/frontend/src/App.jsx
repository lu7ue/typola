import { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import Create from "./pages/Create";
import Collection from "./pages/Collection";
import Insights from "./pages/Insights";
import Setting from "./pages/Setting";
import ImportData from "./pages/ImportData";
import OneSet from "./pages/OneSet";
import TypingMode from "./pages/TypingMode";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  const [isMac, setIsMac] = useState(() => {
    if (typeof window !== "undefined" && window.backend) {
      return window.backend.platform === "darwin";
    }
    return null;
  });

  useEffect(() => {
    if (!window.backend) return;

    const id = setTimeout(() => {
      setIsMac(window.backend.platform === "darwin");
    }, 0);

    return () => clearTimeout(id);
  }, []);

  if (isMac === null) return null;

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {!isMac && <TitleBar />}

        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div className="flex-1 overflow-y-auto bg-white">
            <div className="px-12 pt-8 pb-6">
              <Routes>
                <Route path="/" element={<Navigate to="/create" replace />} />
                <Route path="/create" element={<Create />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/importData" element={<ImportData />} />
                <Route path="/set/:setId" element={<OneSet />} />
                <Route path="/set/:setId/typingMode" element={<TypingMode />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
