function AddTicketForm({ onCancel, onSubmit, projectId }) {
  const statusOptions = [
    {
      value: "New",
      label: "NEW",
    },
    {
      value: "OnReview",
      label: "On Review",
    },
    {
      value: "SupportWillContactYou",
      label: "Support Will Contact You",
    },
    {
      value: "InProgress",
      label: "In-progress",
    },
    {
      value: "Closed",
      label: "Closed",
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = {
      project_id: projectId,

      contact_person: formData.get("contact_person"),

      contact_email: formData.get("contact_email"),

      description: formData.get("description"),
    };

    console.log("Ticket form:", data);

    if (onSubmit) {
      onSubmit(data);
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
              Contact Person
            </label>

            <input
              id="contact_person"
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

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue="New"
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
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
