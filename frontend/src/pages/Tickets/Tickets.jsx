import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddTicketForm from "../../components/forms/AddTicketForm";
import Modal from "../../components/Modal";
function Tickets() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  // UI ONLY - temporary ticket data
  const tickets = [
    {
      id: 1,
      reference_no: "TKT-0001",
      status: "NEW",
      contact_person: "John Doe",
      contact_email: "john@example.com",
      description: "Unable to access the accounting system.",
    },
    {
      id: 2,
      reference_no: "TKT-0002",
      status: "On Review",
      contact_person: "Jane Smith",
      contact_email: "jane@example.com",
      description: "Request for additional user account.",
    },
    {
      id: 3,
      reference_no: "TKT-0003",
      status: "In-progress",
      contact_person: "Michael Santos",
      contact_email: "michael@example.com",
      description: "System is experiencing slow response.",
    },
    {
      id: 4,
      reference_no: "TKT-0004",
      status: "Support Will Contact You",
      contact_person: "Robert Cruz",
      contact_email: "robert@example.com",
      description: "Request for technical support.",
    },
    {
      id: 5,
      reference_no: "TKT-0005",
      status: "Closed",
      contact_person: "Sarah Garcia",
      contact_email: "sarah@example.com",
      description: "Password reset request.",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700";

      case "On Review":
        return "bg-yellow-100 text-yellow-700";

      case "Support Will Contact You":
        return "bg-purple-100 text-purple-700";

      case "In-progress":
        return "bg-orange-100 text-orange-700";

      case "Closed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
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

            {/* UI only - showing the route parameter */}
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
              {tickets.length} Tickets
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
                {tickets.map((ticket) => (
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
                        {ticket.status}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddTicketModalOpen}
        onClose={() => setIsAddTicketModalOpen(false)}
        title="Add New Ticket"
        size="lg"
      >
        <AddTicketForm
          onCancel={() => setIsAddTicketModalOpen(false)}
          onSubmit={(data) => {
            console.log("New ticket:", data);

            // UI ONLY for now
            setIsAddTicketModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default Tickets;
