import axiosClient from "../../api/axiosClient";

export const createTicket = async (ticketData) => {
  const response = await axiosClient.post("/tickets/addNewTicket", ticketData);

  return response.data;
};
