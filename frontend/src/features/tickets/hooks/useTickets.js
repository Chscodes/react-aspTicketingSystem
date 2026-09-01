import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchProjectName } from "../../projects/api/projectApi";
import {
  cancelTicket,
  createTicket,
  fetchTicketsByProject,
} from "../api/ticketApi";

export function useTickets(projectId) {
  const [tickets, setTickets] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const [ticketData, name] = await Promise.all([
        fetchTicketsByProject(projectId),
        fetchProjectName(projectId),
      ]);

      setTickets(Array.isArray(ticketData) ? ticketData : ticketData?.data ?? []);
      setProjectName(typeof name === "string" ? name : name?.data ?? "");
    } catch (err) {
      toast.error(err.message || "Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const addTicket = async (formData) => {
    const promise = createTicket(formData);

    toast.promise(promise, {
      loading: "Creating ticket…",
      success: (res) => res?.message || "Ticket created",
      error: (err) => err.message || "Failed to create ticket",
    });

    await promise;
    await load();
  };

  const removeTicket = async (ticketId) => {
    const promise = cancelTicket(ticketId);

    toast.promise(promise, {
      loading: "Cancelling ticket…",
      success: (res) => res?.message || "Ticket cancelled",
      error: (err) => err.message || "Failed to cancel ticket",
    });

    await promise;
    await load();
  };

  return {
    tickets,
    projectName,
    loading,
    reload: load,
    addTicket,
    removeTicket,
  };
}
