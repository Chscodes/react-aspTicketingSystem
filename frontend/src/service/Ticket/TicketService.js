import axiosClient from "../../api/axiosClient";

export const createTicket = async (ticketData) => {
  const response = await axiosClient.post("/tickets/addNewTicket", ticketData);

  console.log(response);
  return response;
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

  console.log(response);
  return response;
};
