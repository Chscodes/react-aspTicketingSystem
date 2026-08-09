import { Routes, Route, Navigate } from "react-router-dom";

import Projects from "./pages/Projects/Projects";
import Tickets from "./pages/Tickets/Tickets";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" replace />} />

      <Route path="/projects" element={<Projects />} />

      <Route path="/projects/:projectId/tickets" element={<Tickets />} />
    </Routes>
  );
}

export default App;
