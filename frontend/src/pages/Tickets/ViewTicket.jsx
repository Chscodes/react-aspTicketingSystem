import { useState, useCallback, useEffect, useRef } from "react";
// import swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchTicketDataById,
  getAttachmentById,
  fetchTicketStatuses,
  updateTicketStatus,
  updateToCancel,
} from "../../service/Ticket/TicketService";
import { getStatusStyle } from "../../utils/Tickets/ticketStatus";
function ViewTicket() {
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  const { ticketId } = useParams();

  const [showAttachment, setShowAttachment] = useState(null);
  const [ticket, setTicket] = useState({});
  const [statuses, setStatuses] = useState([]);

  //   const getStatusStyle = (status) => {
  //     switch (status?.toLowerCase()) {
  //       case "open":
  //         return "bg-blue-50 text-blue-700 border-blue-200";

  //       case "pending":
  //         return "bg-yellow-50 text-yellow-700 border-yellow-200";

  //       case "in progress":
  //         return "bg-purple-50 text-purple-700 border-purple-200";

  //       case "resolved":
  //         return "bg-green-50 text-green-700 border-green-200";

  //       case "closed":
  //         return "bg-gray-100 text-gray-700 border-gray-200";

  //       case "cancelled":
  //       case "canceled":
  //         return "bg-red-50 text-red-700 border-red-200";

  //       default:
  //         return "bg-gray-50 text-gray-700 border-gray-200";
  //     }
  //   };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // const handleDeleteAttachment = async (attachment) => {
  //   const result = await swal.fire({
  //     title: "Remove attachment?",
  //     text: `Do you want to remove ${attachment.file_name}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, remove it",
  //     cancelButtonText: "Cancel",
  //     confirmButtonColor: "#dc2626",
  //   });

  //   if (!result.isConfirmed) {
  //     return;
  //   }

  //   // TODO:
  //   // Call your API here to delete the attachment
  //   console.log("Delete attachment:", attachment);
  // };

  const fetchTicketData = useCallback(async () => {
    try {
      const res = await fetchTicketDataById(ticketId);

      const data = res.data;
      const attachmentsWithUrls = await Promise.all(
        (data.attachments || []).map(async (a) => {
          const fileRes = await getAttachmentById(a.id); // now returns a blob
          return {
            id: a.id,
            file_name: a.file_name,
            content_type: a.content_type,
            file_size: a.file_size,
            file_url: URL.createObjectURL(fileRes.data),
          };
        }),
      );
      setTicket({
        contact_email: data.contact_email,
        contact_person: data.contact_person,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        description: data.description,
        project_name: data.project_name,
        reference_no: data.reference_no,
        status: data.status,
        attachments: attachmentsWithUrls,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch ticket.");
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTicketData();
    }
  }, [ticketId, fetchTicketData]);

  useEffect(() => {
    fetchTicketStatuses()
      .then(setStatuses)
      .catch(() => toast.error("Failed to load ticket statuses."));
  }, []); // empty array = run once, on mount only

  const handleStatusChange = async (status) => {
    const promise = updateTicketStatus(status, ticketId);
    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      toast.promise(promise, {
        loading: "Updating ticket...",

        success: (res) => {
          return res.data?.message;
        },

        error: (error) => error.response?.data?.message,
      });
    }, 500);

    try {
      await promise;
      // Refresh ticket list
      await fetchTicketData();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleCancelTicket = async () => {
    const promise = updateToCancel(ticketId);
    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      toast.promise(promise, {
        loading: "Cancelling ticket...",

        success: (res) => {
          return res.data?.message;
        },

        error: (error) => error.response?.data?.message,
      });
    }, 500);

    try {
      await promise;
      // Refresh ticket list
      await fetchTicketData();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  if (!ticket) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Ticket not found.</p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50"
                title="Back"
              >
                ←
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Ticket #{ticket.ticket_no || ticket.id}
                  </h1>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                      ticket.status,
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Created {formatDate(ticket.created_at)}
                </p>
              </div>
            </div>

            {/* Actions */}
            {ticket.status === "New" && (
              <div className="flex items-center gap-2">
                {/* Cancel Ticket */}
                <button
                  type="button"
                  onClick={handleCancelTicket}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Cancel Ticket
                </button>
              </div>
            )}
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Left / Main Content */}
            <div className="space-y-5 lg:col-span-2">
              {/* Description */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Description
                  </h2>
                </div>

                <div className="px-5 py-5">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {ticket.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Attachments
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {ticket.attachments?.length || 0} attachment
                      {ticket.attachments?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  {!ticket.attachments || ticket.attachments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">No attachments.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {ticket.attachments.map((attachment, index) => {
                        const isVideo =
                          attachment.content_type?.startsWith("video/") ||
                          attachment.mime_type?.startsWith("video/");

                        const fileUrl =
                          attachment.file_url ||
                          attachment.url ||
                          attachment.path;

                        return (
                          <div
                            key={attachment.id || index}
                            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                          >
                            {/* Preview */}
                            <button
                              type="button"
                              onClick={() =>
                                setShowAttachment({
                                  ...attachment,
                                  url: fileUrl,
                                  isVideo,
                                })
                              }
                              className="group block w-full"
                            >
                              <div className="flex aspect-video items-center justify-center overflow-hidden bg-gray-100">
                                {isVideo ? (
                                  <div className="relative flex h-full w-full items-center justify-center">
                                    <video
                                      src={fileUrl}
                                      className="h-full w-full object-contain"
                                    />

                                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
                                      ▶
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={fileUrl}
                                    alt={attachment.file_name || "Attachment"}
                                    className="h-full w-full object-contain transition group-hover:scale-105"
                                  />
                                )}
                              </div>
                            </button>

                            {/* File Details */}
                            <div className="flex items-center justify-between gap-3 p-3">
                              <div className="min-w-0">
                                <p
                                  className="truncate text-sm font-medium text-gray-700"
                                  title={attachment.file_name}
                                >
                                  {attachment.file_name ||
                                    `Attachment ${index + 1}`}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-500">
                                  {formatFileSize(attachment.file_size)}
                                </p>
                              </div>

                              {/* <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAttachment(attachment)
                                }
                                className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Activity
                  </h2>
                </div>

                <div className="p-5">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-2 top-3 h-full w-px bg-gray-200" />

                    <div className="space-y-6">
                      <div className="relative flex gap-4">
                        <div className="relative z-10 h-4 w-4 rounded-full border-2 border-blue-600 bg-white" />

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Ticket created
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(ticket.created_at)}
                          </p>
                        </div>
                      </div>

                      {ticket.updated_at &&
                        ticket.updated_at !== ticket.created_at && (
                          <div className="relative flex gap-4">
                            <div className="relative z-10 h-4 w-4 rounded-full border-2 border-gray-400 bg-white" />

                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Ticket updated
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {formatDate(ticket.updated_at)}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Ticket Information */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Ticket Information
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Ticket ID
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-gray-800">
                      {ticketId || "-"}
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Reference No.
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {ticket.reference_no || "-"}
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Project
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {ticket.project?.name ||
                        ticket.project_name ||
                        ticket.project_id ||
                        "-"}
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Status
                    </p>
                    <div className="relative mt-2">
                      <select
                        value={ticket?.status || ""}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDate(ticket.created_at)}
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {formatDate(ticket.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Contact Person
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {ticket.contact_person || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    {ticket.contact_email ? (
                      <a
                        href={`mailto:${ticket.contact_email}`}
                        className="mt-1 block break-all text-sm text-blue-600 hover:underline"
                      >
                        {ticket.contact_email}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">-</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      {showAttachment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowAttachment(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowAttachment(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl text-white transition hover:bg-black/80"
            >
              ×
            </button>

            {/* Content */}
            <div className="flex max-h-[80vh] items-center justify-center">
              {showAttachment.isVideo ? (
                <video
                  src={showAttachment.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full object-contain"
                />
              ) : (
                <img
                  src={showAttachment.url}
                  alt={showAttachment.file_name || "Attachment"}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 bg-gray-950 px-4 py-3">
              <p className="truncate text-sm font-medium text-white">
                {showAttachment.file_name || "Attachment"}
              </p>

              {showAttachment.file_size && (
                <p className="mt-1 text-xs text-gray-400">
                  {formatFileSize(showAttachment.file_size)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewTicket;
