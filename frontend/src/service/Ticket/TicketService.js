import axiosClient from "../../api/axiosClient";

export const createTicket = async (formData) => {
  const response = await axiosClient.post("/Tickets/addNewTicket", formData);

  return response.data;
};

export const fetchTicketsData = async (projectID) => {
  const response = await axiosClient.get(
    `/tickets/getTicketsData/${projectID}`,
  );

  // console.log(response);
  return response;
};

export const updateToCancel = async (ticket_id) => {
  const response = await axiosClient.put(`/tickets/cancelTicket/${ticket_id}`);

  // console.log(response);
  return response;
};

export const fetchTicketDataById = async (ticketId) => {
  const response = await axiosClient.get(
    `/tickets/getTicketDataById/${ticketId}`,
  );

  return response;
};

export const getAttachmentById = async (attachment_id) => {
  const response = await axiosClient.get(
    `/tickets/attachments/${attachment_id}`,
    { responseType: "blob" },
  );
  return response;
};

export const fetchTicketStatuses = async () => {
  const res = await axiosClient.get("/tickets/ticket_statuses");
  return res.data; // [{ value: "New", label: "New" }, { value: "OnReview", label: "On Review" }, ...]
};

export const updateTicketStatus = async (status, ticketId) => {
  console.log(ticketId, status);
  const res = await axiosClient.put(`/tickets/updateTicketStatus/${ticketId}`, {
    status,
  });
  return res;
};
