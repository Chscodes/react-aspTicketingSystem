import api from "../../../shared/lib/axios";

export async function fetchProjects() {
  const { data } = await api.get("/api/projects");
  return data;
}

export async function fetchProjectName(projectId) {
  const { data } = await api.get(`/api/projects/${projectId}/name`);
  return data;
}
