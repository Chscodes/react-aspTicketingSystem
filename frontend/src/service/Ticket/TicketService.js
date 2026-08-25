import axiosClient from "../../api/axiosClient";

export const createTicket = async (formData) => {
  const response = await axiosClient.post("/Tickets/addNewTicket", formData);

  return response.data;
};

export const fetchTicketsData = async (projectID) => {
  const response = await axiosClient.get(
    `/tickets/getTicketsData/${projectID}`,
  );

  console.log(response);
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
