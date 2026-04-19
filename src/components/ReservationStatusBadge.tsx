import { RESERVATION_STATUS, STATUS_COLORS } from "@/lib/constants";

interface ReservationStatusBadgeProps {
  status: string;
}

export default function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const label = RESERVATION_STATUS[status as keyof typeof RESERVATION_STATUS] || status;
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
