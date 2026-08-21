import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Projects from "./pages/Projects/Projects";
import Tickets from "./pages/Tickets/Tickets";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/projects/:projectId/tickets" element={<Tickets />} />
      </Routes>
    </>
  );
}

export default App;
