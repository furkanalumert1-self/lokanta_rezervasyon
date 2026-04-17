import { cn } from "@/lib/utils";
import { RESERVATION_STATUS } from "@/lib/constants";

interface ReservationStatusBadgeProps {
  status: string;
  className?: string;
}

export default function ReservationStatusBadge({ status, className }: ReservationStatusBadgeProps) {
  const statusInfo = RESERVATION_STATUS[status as keyof typeof RESERVATION_STATUS] || {
    label: status,
    color: "gray",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        `status-${status}`,
        className
      )}
    >
      {statusInfo.label}
    </span>
  );
}
