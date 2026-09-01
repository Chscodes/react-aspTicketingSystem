import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { PageHeader, PageShell } from "../../../shared/components/layout/PageShell";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Card, CardHeader } from "../../../shared/components/ui/Card";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { Modal } from "../../../shared/components/ui/Modal";
import { Spinner } from "../../../shared/components/ui/Spinner";
import { AddTicketForm } from "../components/AddTicketForm";
import { StatusBadge } from "../components/StatusBadge";
import { isNewStatus } from "../constants/status";
import { useTickets } from "../hooks/useTickets";

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function TicketsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tickets, projectName, loading, addTicket, removeTicket } =
    useTickets(projectId);

  const handleCancel = async (ticketId) => {
    const result = await Swal.fire({
      title: "Cancel this ticket?",
      text: "You can no longer update a cancelled ticket.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      confirmButtonColor: "#e11d48",
    });

    if (result.isConfirmed) {
      await removeTicket(ticketId);
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Tickets"
        description="View and manage tickets for this project"
        badge={
          projectName ? (
            <Badge className="bg-zinc-100 text-zinc-600 ring-zinc-200">
              {projectName}
            </Badge>
          ) : null
        }
        back={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
            className="-ml-2"
          >
            ←
          </Button>
        }
        actions={
          <Button onClick={() => setIsModalOpen(true)}>+ Create ticket</Button>
        }
      />

      <Card>
        <CardHeader
          title="Ticket list"
          description="All open tickets for this project"
          action={
            !loading && (
              <Badge className="bg-zinc-50 text-zinc-600 ring-zinc-200">
                {tickets.length} tickets
              </Badge>
            )
          }
        />

        {loading ? (
          <div className="py-16">
            <Spinner />
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No tickets yet"
            description="Create the first ticket for this project."
            action={
              <Button onClick={() => setIsModalOpen(true)}>Create ticket</Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-6 py-3 font-medium">Reference</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-zinc-100"
              >
                {tickets.map((ticket) => (
                  <motion.tr
                    key={ticket.id}
                    variants={rowVariants}
                    className="transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">
                      {ticket.reference_no}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-700">
                      {ticket.contact_person}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500">
                      {ticket.contact_email || "—"}
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate text-zinc-600">
                        {ticket.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          View
                        </Button>
                        {isNewStatus(ticket.status) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCancel(ticket.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create ticket"
        size="lg"
      >
        <AddTicketForm
          projectId={projectId}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={addTicket}
        />
      </Modal>
    </PageShell>
  );
}
