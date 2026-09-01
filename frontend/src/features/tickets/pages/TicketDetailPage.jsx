import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { PageHeader, PageShell } from "../../../shared/components/layout/PageShell";
import { Button } from "../../../shared/components/ui/Button";
import { Card, CardHeader } from "../../../shared/components/ui/Card";
import { Spinner } from "../../../shared/components/ui/Spinner";
import { formatDate, formatFileSize } from "../../../shared/utils/format";
import { StatusBadge } from "../components/StatusBadge";
import { isNewStatus } from "../constants/status";
import {
  cancelTicket,
  fetchAttachmentBlob,
  fetchTicketById,
  fetchTicketStatuses,
  updateTicketStatus,
} from "../api/ticketApi";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      const data = await fetchTicketById(ticketId);

      const attachments = await Promise.all(
        (data.attachments || []).map(async (item) => {
          const blob = await fetchAttachmentBlob(item.id);
          return {
            ...item,
            file_url: URL.createObjectURL(blob),
          };
        }),
      );

      setTicket({ ...data, attachments });
    } catch (err) {
      toast.error(err.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    load();
    return () => {
      // revoke object URLs on unmount when ticket changes
    };
  }, [load]);

  useEffect(() => {
    fetchTicketStatuses()
      .then(setStatuses)
      .catch(() => toast.error("Failed to load statuses"));
  }, []);

  useEffect(() => {
    return () => {
      ticket?.attachments?.forEach((a) => {
        if (a.file_url) URL.revokeObjectURL(a.file_url);
      });
    };
  }, [ticket]);

  const handleStatusChange = async (status) => {
    const promise = updateTicketStatus(ticketId, status);
    toast.promise(promise, {
      loading: "Updating status…",
      success: (res) => res?.message || "Status updated",
      error: (err) => err.message,
    });
    await promise;
    await load();
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Cancel this ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancel ticket",
      confirmButtonColor: "#e11d48",
    });

    if (!result.isConfirmed) return;

    const promise = cancelTicket(ticketId);
    toast.promise(promise, {
      loading: "Cancelling…",
      success: (res) => res?.message || "Ticket cancelled",
      error: (err) => err.message,
    });
    await promise;
    await load();
  };

  if (loading) {
    return (
      <PageShell>
        <div className="py-24">
          <Spinner label="Loading ticket…" />
        </div>
      </PageShell>
    );
  }

  if (!ticket) {
    return (
      <PageShell>
        <div className="py-24 text-center">
          <p className="text-sm text-zinc-500">Ticket not found.</p>
          <Button className="mt-4" variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="max-w-6xl">
      <PageHeader
        title={ticket.reference_no || `Ticket`}
        description={`Created ${formatDate(ticket.createdAt)}`}
        badge={<StatusBadge status={ticket.status} />}
        back={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
            ←
          </Button>
        }
        actions={
          isNewStatus(ticket.status) ? (
            <Button variant="danger" onClick={handleCancel}>
              Cancel ticket
            </Button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader title="Description" />
            <div className="px-6 py-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                {ticket.description || "No description provided."}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Attachments"
              description={`${ticket.attachments?.length || 0} file(s)`}
            />
            <div className="p-5">
              {!ticket.attachments?.length ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
                  No attachments
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ticket.attachments.map((file, index) => {
                    const isVideo = file.content_type?.startsWith("video/");
                    return (
                      <motion.button
                        key={file.id || index}
                        type="button"
                        whileHover={{ y: -2 }}
                        onClick={() =>
                          setPreview({ ...file, isVideo, url: file.file_url })
                        }
                        className="overflow-hidden rounded-xl bg-white text-left ring-1 ring-zinc-200 transition hover:ring-zinc-300"
                      >
                        <div className="flex aspect-video items-center justify-center bg-zinc-100">
                          {isVideo ? (
                            <video
                              src={file.file_url}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <img
                              src={file.file_url}
                              alt={file.file_name}
                              className="h-full w-full object-contain"
                            />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-sm font-medium text-zinc-800">
                            {file.file_name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {formatFileSize(file.file_size)}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Activity" />
            <div className="space-y-5 p-6">
              <TimelineItem
                label="Ticket created"
                date={ticket.createdAt}
                active
              />
              {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                <TimelineItem label="Ticket updated" date={ticket.updatedAt} />
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Details" />
            <dl className="divide-y divide-zinc-100 text-sm">
              <DetailRow label="Reference" value={ticket.reference_no} />
              <DetailRow label="Project" value={ticket.project_name} />
              <div className="px-6 py-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Status
                </dt>
                <dd className="mt-2">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-800 ring-1 ring-zinc-200 outline-none transition focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <DetailRow label="Created" value={formatDate(ticket.createdAt)} />
              <DetailRow label="Updated" value={formatDate(ticket.updatedAt)} />
            </dl>
          </Card>

          <Card>
            <CardHeader title="Contact" />
            <dl className="space-y-4 p-6 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Person
                </dt>
                <dd className="mt-1 font-medium text-zinc-800">
                  {ticket.contact_person || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Email
                </dt>
                <dd className="mt-1">
                  {ticket.contact_email ? (
                    <a
                      href={`mailto:${ticket.contact_email}`}
                      className="text-sky-600 hover:underline"
                    >
                      {ticket.contact_email}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      {preview && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setPreview(null)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              ×
            </button>
            <div className="flex max-h-[80vh] items-center justify-center">
              {preview.isVideo ? (
                <video
                  src={preview.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full object-contain"
                />
              ) : (
                <img
                  src={preview.url}
                  alt={preview.file_name}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              )}
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <p className="truncate text-sm text-white">{preview.file_name}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PageShell>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="px-6 py-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 break-all font-medium text-zinc-800">{value || "—"}</dd>
    </div>
  );
}

function TimelineItem({ label, date, active }) {
  return (
    <div className="relative flex gap-4">
      <div
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-zinc-900" : "bg-zinc-300"
        }`}
      />
      <div>
        <p className="text-sm font-medium text-zinc-800">{label}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{formatDate(date)}</p>
      </div>
    </div>
  );
}
