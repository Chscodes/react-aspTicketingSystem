import { useState } from "react";
import { Button } from "../../../shared/components/ui/Button";

const inputClass =
  "block w-full rounded-xl border-0 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 ring-1 ring-zinc-200 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900 dark:focus:ring-zinc-500/30";

export function AddProjectForm({ onCancel, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      project_name: String(formData.get("project_name") || "").trim(),
      remarks: String(formData.get("remarks") || "").trim(),
    };

    if (!payload.project_name) return;

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
      onCancel?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="project_name"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Project name <span className="text-rose-500">*</span>
        </label>
        <input
          id="project_name"
          name="project_name"
          required
          maxLength={200}
          placeholder="e.g. Customer Portal"
          className={inputClass}
          autoFocus
        />
      </div>

      <div>
        <label
          htmlFor="remarks"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Remarks
        </label>
        <textarea
          id="remarks"
          name="remarks"
          rows={4}
          maxLength={1000}
          placeholder="Optional notes about this project…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
