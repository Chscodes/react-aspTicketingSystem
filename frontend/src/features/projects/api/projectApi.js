import api from "../../../shared/lib/axios";

export async function fetchProjects() {
  const { data } = await api.get("/projects");
  return data;
}

export async function fetchProjectName(projectId) {
  const { data } = await api.get(`/projects/getProjectName/${projectId}`);
  return data;
}
