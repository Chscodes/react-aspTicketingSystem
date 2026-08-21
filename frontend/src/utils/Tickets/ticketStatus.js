export const getStatusStyle = (status) => {
  switch (status) {
    case 0:
      return "bg-blue-100 text-blue-700";

    case 1:
      return "bg-yellow-100 text-yellow-700";

    case 2:
      return "bg-purple-100 text-purple-700";

    case 3:
      return "bg-orange-100 text-orange-700";

    case 4:
      return "bg-green-100 text-green-700";

    case 5:
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "New";

    case 1:
      return "On Review";

    case 2:
      return "Support Will Contact You";

    case 3:
      return "In Progress";

    case 4:
      return "Closed";

    case 5:
      return "Cancelled";

    default:
      return "Unknown";
  }
};
