import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "../../../shared/components/ui/Button";
import { formatFileSize } from "../../../shared/utils/format";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

export function AddTicketForm({ projectId, onCancel, onSubmit }) {
  const [attachments, setAttachments] = useState([]);

  const handleAttachmentsChange = (event) => {
    const files = Array.from(event.target.files || []);
    const videos = files.filter((file) => file.type.startsWith("video/"));

    if (videos.length > 1) {
      Swal.fire({
        icon: "warning",
        title: "Too many videos",
        text: "You can only upload one video.",
      });
      event.target.value = "";
      setAttachments([]);
      return;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      Swal.fire({
        icon: "warning",
        title: "File size exceeded",
        text: "Total attachments must not exceed 30 MB.",
      });
      event.target.value = "";
      setAttachments([]);
      return;
    }

    setAttachments(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Capture the form before any await — React nulls event.currentTarget after yield
    const form = event.currentTarget;

    const confirmed = await Swal.fire({
      title: "Create ticket?",
      text: "This will submit a new support ticket.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#18181b",
    });

    if (!confirmed.isConfirmed) return;

    const formData = new FormData(form);
    formData.set("project_id", projectId);

    // File input has no name attribute; append from state
    formData.delete("Attachments");
    attachments.forEach((file) => {
      formData.append("Attachments", file);
    });

    await onSubmit?.(formData);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Contact person" required htmlFor="contact_person">
          <input
            id="contact_person"
            name="contact_person"
            required
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>

        <Field label="Contact email" htmlFor="contact_email">
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            placeholder="jane@company.com"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description" required htmlFor="description">
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Describe the issue or request…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="Attachments" htmlFor="attachments">
        <input
          id="attachments"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleAttachmentsChange}
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200"
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Images or one video · max 30 MB total
        </p>
        {attachments.length > 0 && (
          <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            {attachments.length} selected ·{" "}
            {formatFileSize(
              attachments.reduce((sum, file) => sum + file.size, 0),
            )}
          </p>
        )}
      </Field>

      <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create ticket</Button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, required, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "block w-full rounded-xl border-0 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 ring-1 ring-zinc-200 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900 dark:focus:ring-zinc-500/30";
