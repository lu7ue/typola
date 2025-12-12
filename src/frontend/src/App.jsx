import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import Create from "./pages/Create";
import Collection from "./pages/Collection";
import Insights from "./pages/Insights";
import Setting from "./pages/Setting";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="h-screen flex flex-col">
        <TitleBar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <Routes>
              <Route path="/create" element={<Create />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="*" element={<Create />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
