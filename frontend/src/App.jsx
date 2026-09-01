import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import ProjectsPage from "./features/projects/pages/ProjectsPage";
import TicketDetailPage from "./features/tickets/pages/TicketDetailPage";
import TicketsPage from "./features/tickets/pages/TicketsPage";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm",
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId/tickets" element={<TicketsPage />} />
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />

        {/* Legacy path kept temporarily so old links still work */}
        <Route
          path="/projects/:ticketId/view-tickets"
          element={<TicketDetailPage />}
        />
      </Routes>
    </>
  );
}
