import swal from "sweetalert2";
function AddTicketForm({ onCancel, onSubmit, projectId }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      project_id: projectId,

      contact_person: formData.get("contact_person"),

      contact_email: formData.get("contact_email"),

      description: formData.get("description"),
    };

    if (onSubmit) {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "Do you want to create this ticket?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, create it",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        onSubmit(payload);
      }
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
