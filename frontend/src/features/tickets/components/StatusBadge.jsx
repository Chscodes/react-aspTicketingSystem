import { Badge } from "../../../shared/components/ui/Badge";
import { getStatusLabel, getStatusStyle } from "../constants/status";

export function StatusBadge({ status }) {
  return (
    <Badge className={getStatusStyle(status)}>{getStatusLabel(status)}</Badge>
  );
}
