import axiosClient from "../api/axiosClient";

export const getProjects = async () => {
  const response = await axiosClient.get("/projects");

  return response.data;
};
