import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Services
import {
  createTicket,
  fetchTicketsData,
  updateToCancel,
} from "../../service/Ticket/TicketService";

import { getProjectname } from "../../service/Project/projectService";

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
  const [project_name, setProject_name] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const resetDesigns = async () => {
    setOpenMenu(null);
    setMenuPosition(null);
    setIsAddTicketModalOpen(false);
  };
  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetchTicketsData(projectId);

      const res_project_name = await getProjectname(projectId);

      setProject_name(res_project_name.data);
      await resetDesigns();
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
        return res.data?.message;
      },

      error: (error) =>
        error.response?.data?.message || "Failed to create ticket.",
    });

    try {
      await promise;

      // Refresh ticket list
      await fetchTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleCancelButton = async (ticket_id) => {
    const promise = updateToCancel(ticket_id);

    toast.promise(promise, {
      loading: "Cancelling ticket...",

      success: (res) => {
        return res.data?.message;
      },

      error: (error) => error.response?.data?.message,
    });

    try {
      await promise;
      // Refresh ticket list
      await fetchTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleMenuClick = (event, id) => {
    if (openMenu === id) {
      setOpenMenu(null);
      setMenuPosition(null);
      return;
    }

    const buttonRect = event.currentTarget.getBoundingClientRect();

    const menuWidth = 160;
    const menuHeight = 140;
    const gap = 6;

    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    setMenuPosition({
      top: openUp ? buttonRect.top - menuHeight - gap : buttonRect.bottom + gap,

      left: buttonRect.right - menuWidth,
    });

    setOpenMenu(id);
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
          ← Back
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {project_name}
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
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => handleMenuClick(e, ticket.id)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            ...
                          </button>

                          {openMenu === ticket.id && (
                            <div
                              style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                              }}
                              className="fixed z-[9999] w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                            >
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                  // View action
                                  setOpenMenu(null);
                                }}
                              >
                                View
                              </button>

                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                  // Edit action
                                  setOpenMenu(null);
                                }}
                              >
                                Edit
                              </button>

                              {ticket.status === 0 && (
                                <button
                                  type="button"
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    // Cancel action
                                    handleCancelButton(ticket.id);
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          )}
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
