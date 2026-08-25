import { useState } from "react";
import swal from "sweetalert2";

function AddTicketForm({ onCancel, onSubmit, projectId }) {
  const [attachments, setAttachments] = useState([]);

  const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB

  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files);

    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    // Only one video allowed
    if (videoFiles.length > 1) {
      swal.fire({
        icon: "warning",
        title: "Too many videos",
        text: "You can only upload one video.",
      });

      e.target.value = "";
      setAttachments([]);
      return;
    }

    // Total file size must not exceed 30 MB
    const totalSize = files.reduce((total, file) => total + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      swal.fire({
        icon: "warning",
        title: "File size exceeded",
        text: "The total size of all attachments must not exceed 30 MB.",
      });

      e.target.value = "";
      setAttachments([]);
      return;
    }

    setAttachments(files);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handlePreview = async () => {
    if (attachments.length === 0) {
      swal.fire({
        icon: "info",
        title: "No attachments",
        text: "Please select an attachment first.",
      });

      return;
    }

    const previewHtml = attachments
      .map((file, index) => {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith("video/");

        return `
          <div
            style="
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 12px;
              text-align: left;
            "
          >
            <div
              style="
                width: 100%;
                height: 250px;
                background: #f3f4f6;
                border-radius: 6px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              ${
                isVideo
                  ? `
                    <video
                      src="${url}"
                      controls
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                      "
                    ></video>
                  `
                  : `
                    <img
                      src="${url}"
                      alt="${file.name}"
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                      "
                    />
                  `
              }
            </div>

            <div style="margin-top: 8px;">
              <div
                style="
                  font-size: 14px;
                  font-weight: 500;
                  color: #374151;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                title="${file.name}"
              >
                ${index + 1}. ${file.name}
              </div>

              <div
                style="
                  font-size: 12px;
                  color: #6b7280;
                  margin-top: 2px;
                "
              >
                ${formatFileSize(file.size)}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    await swal.fire({
      title: "Attachment Preview",
      html: `
        <div
          style="
            max-height: 60vh;
            overflow-y: auto;
            padding: 4px;
          "
        >
          ${previewHtml}
        </div>
      `,
      width: 700,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
    });

    // Clean up object URLs
    attachments.forEach((file) => {
      const url = URL.createObjectURL(file);
      URL.revokeObjectURL(url);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    formData.append("project_id", projectId);

    const result = await swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this ticket?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* Reference Number */}
        {/* <div>
          <label
            htmlFor="reference_no"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Reference No.
          </label>

          <input
            id="reference_no"
            name="reference_no"
            type="text"
            placeholder="Enter reference number"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div> */}

        {/* Contact Person + Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Contact Person */}
          <div>
            <label
              htmlFor="contact_person"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contact Person <span className="text-red-500">*</span>
            </label>

            <input
              id="contact_person"
              required
              name="contact_person"
              type="text"
              placeholder="Enter contact person"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label
              htmlFor="contact_email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contact Email
            </label>

            <input
              id="contact_email"
              name="contact_email"
              type="email"
              placeholder="example@email.com"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>

          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Describe the issue or request..."
            className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Attachments */}
        <div>
          <label
            htmlFor="attachments"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Attachments
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="attachments"
              name="Attachments"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleAttachmentsChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                file:mr-4 file:rounded-md file:border-0 file:bg-blue-50
                file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700"
            />

            {attachments.length > 0 && (
              <button
                type="button"
                onClick={handlePreview}
                className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                Preview
              </button>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            You can upload multiple images or one video. Total attachments must
            not exceed 30 MB.
          </p>

          {attachments.length > 0 && (
            <p className="mt-1 text-xs text-gray-600">
              {attachments.length} attachment
              {attachments.length !== 1 ? "s" : ""} selected •{" "}
              {formatFileSize(
                attachments.reduce((total, file) => total + file.size, 0),
              )}{" "}
              total
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Ticket
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddTicketForm;
