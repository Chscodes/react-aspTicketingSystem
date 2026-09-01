import api from "../../../shared/lib/axios";

export async function createTicket(formData) {
  const { data } = await api.post("/api/tickets", formData);
  return data;
}

export async function fetchTicketsByProject(projectId) {
  const { data } = await api.get("/api/tickets", {
    params: { projectId },
  });
  return data;
}

export async function fetchTicketById(ticketId) {
  const { data } = await api.get(`/api/tickets/${ticketId}`);
  return data;
}

export async function cancelTicket(ticketId) {
  const { data } = await api.post(`/api/tickets/${ticketId}/cancel`);
  return data;
}

export async function updateTicketStatus(ticketId, status) {
  const { data } = await api.patch(`/api/tickets/${ticketId}/status`, {
    status,
  });
  return data;
}

export async function fetchTicketStatuses() {
  const { data } = await api.get("/api/tickets/statuses");
  return data;
}

export async function fetchAttachmentBlob(attachmentId) {
  const { data } = await api.get(`/api/tickets/attachments/${attachmentId}`, {
    responseType: "blob",
  });
  return data;
}
