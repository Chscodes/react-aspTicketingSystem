import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Services
import {
  createTicket,
  fetchTicketsData,
} from "../../service/Ticket/TicketService";

// Components
import Modal from "../../components/Modal";
import AddTicketForm from "../../components/forms/AddTicketForm";

// utilss
import {
  getStatusStyle,
  getStatusLabel,
} from "../../utils/Tickets/ticketStatus";

function Tickets() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState([]);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetchTicketsData(projectId);

      setTicketData(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tickets.");
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      // fetchTickets intentionally updates state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTickets();
    }
  }, [projectId, fetchTickets]);

  const handleCreateTicket = async (payload) => {
    const promise = createTicket(payload);

    toast.promise(promise, {
      loading: "Creating ticket...",

      success: (res) => {
        return res.data?.message || "Ticket created successfully!";
      },

      error: (error) =>
        error.response?.data?.message || "Failed to create ticket.",
    });

    try {
      await promise;

      // Close modal after successful creation
      setIsAddTicketModalOpen(false);

      // Refresh ticket list
      await fetchTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          ← Back to Projects
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Project
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              View and manage tickets for this project
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Project ID: {projectId}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddTicketModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Create Ticket
          </button>
        </div>

        {/* Ticket Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ticket List
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                All tickets associated with this project
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {ticketData.length} Tickets
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Reference No.</th>

                  <th className="px-6 py-4 font-semibold">Contact Person</th>

                  <th className="px-6 py-4 font-semibold">Contact Email</th>

                  <th className="px-6 py-4 font-semibold">Description</th>

                  <th className="px-6 py-4 font-semibold">Status</th>

                  <th className="px-6 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {ticketData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No tickets found for this project.
                    </td>
                  </tr>
                ) : (
                  ticketData.map((ticket) => (
                    <tr key={ticket.id} className="transition hover:bg-gray-50">
                      {/* Reference */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {ticket.reference_no}
                        </span>
                      </td>

                      {/* Contact Person */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-medium text-gray-800">
                          {ticket.contact_person}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {ticket.contact_email}
                      </td>

                      {/* Description */}
                      <td className="max-w-sm px-6 py-4">
                        <p className="truncate">{ticket.description}</p>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            ticket.status,
                          )}`}
                        >
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Ticket Modal */}
      <Modal
        isOpen={isAddTicketModalOpen}
        onClose={() => setIsAddTicketModalOpen(false)}
        title="Add New Ticket"
        size="lg"
      >
        <AddTicketForm
          projectId={projectId}
          onCancel={() => setIsAddTicketModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      </Modal>
    </div>
  );
}

export default Tickets;
