import api from "../../../shared/lib/axios";

export async function createTicket(formData) {
  const { data } = await api.post("/Tickets/addNewTicket", formData);
  return data;
}

export async function fetchTicketsByProject(projectId) {
  const { data } = await api.get(`/tickets/getTicketsData/${projectId}`);
  return data;
}

export async function fetchTicketById(ticketId) {
  const { data } = await api.get(`/tickets/getTicketDataById/${ticketId}`);
  return data;
}

export async function cancelTicket(ticketId) {
  const { data } = await api.put(`/tickets/cancelTicket/${ticketId}`);
  return data;
}

export async function updateTicketStatus(ticketId, status) {
  const { data } = await api.put(`/tickets/updateTicketStatus/${ticketId}`, {
    status,
  });
  return data;
}

export async function fetchTicketStatuses() {
  const { data } = await api.get("/tickets/ticket_statuses");
  return data;
}

export async function fetchAttachmentBlob(attachmentId) {
  const { data } = await api.get(`/tickets/attachments/${attachmentId}`, {
    responseType: "blob",
  });
  return data;
}
