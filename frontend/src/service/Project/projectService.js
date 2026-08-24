import axiosClient from "../../api/axiosClient";

export const getProjects = async () => {
  const response = await axiosClient.get("/projects");

  return response.data;
};

export const getProjectname = async (projectID) => {
  const response = await axiosClient.get(
    `/projects/getProjectName/${projectID}`,
  );

  console.log(response);
  return response;
};
