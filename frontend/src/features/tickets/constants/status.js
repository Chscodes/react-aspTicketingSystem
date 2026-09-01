/** Canonical status keys from the API (string enum). */
export const TICKET_STATUS = {
  New: "New",
  OnReview: "OnReview",
  SupportWillContactYou: "SupportWillContactYou",
  InProgress: "InProgress",
  Closed: "Closed",
  Cancelled: "Cancelled",
};

/** Numeric fallback for older API responses. */
const NUMERIC_STATUS = {
  0: TICKET_STATUS.New,
  1: TICKET_STATUS.OnReview,
  2: TICKET_STATUS.SupportWillContactYou,
  3: TICKET_STATUS.InProgress,
  4: TICKET_STATUS.Closed,
  5: TICKET_STATUS.Cancelled,
};

const LABELS = {
  [TICKET_STATUS.New]: "New",
  [TICKET_STATUS.OnReview]: "On Review",
  [TICKET_STATUS.SupportWillContactYou]: "Support Will Contact You",
  [TICKET_STATUS.InProgress]: "In Progress",
  [TICKET_STATUS.Closed]: "Closed",
  [TICKET_STATUS.Cancelled]: "Cancelled",
};

const STYLES = {
  [TICKET_STATUS.New]: "bg-sky-50 text-sky-700 ring-sky-200",
  [TICKET_STATUS.OnReview]: "bg-amber-50 text-amber-700 ring-amber-200",
  [TICKET_STATUS.SupportWillContactYou]:
    "bg-violet-50 text-violet-700 ring-violet-200",
  [TICKET_STATUS.InProgress]: "bg-orange-50 text-orange-700 ring-orange-200",
  [TICKET_STATUS.Closed]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [TICKET_STATUS.Cancelled]: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function normalizeStatus(status) {
  if (status == null) return null;
  if (typeof status === "number") return NUMERIC_STATUS[status] ?? null;
  return LABELS[status] ? status : (NUMERIC_STATUS[Number(status)] ?? status);
}

export function getStatusLabel(status) {
  const key = normalizeStatus(status);
  return LABELS[key] ?? "Unknown";
}

export function getStatusStyle(status) {
  const key = normalizeStatus(status);
  return STYLES[key] ?? "bg-zinc-50 text-zinc-600 ring-zinc-200";
}

export function isNewStatus(status) {
  return normalizeStatus(status) === TICKET_STATUS.New;
}
