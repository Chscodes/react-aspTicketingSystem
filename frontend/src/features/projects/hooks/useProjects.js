import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createProject, fetchProjects } from "../api/projectApi";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProject = async (payload) => {
    const promise = createProject(payload);

    toast.promise(promise, {
      loading: "Creating project…",
      success: (res) => res?.message || "Project created",
      error: (err) => err.message || "Failed to create project",
    });

    await promise;
    await load();
  };

  return { projects, loading, error, reload: load, addProject };
}
