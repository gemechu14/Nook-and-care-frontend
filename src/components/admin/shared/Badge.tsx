interface BadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  VERIFIED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  APPROVED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
  REVIEWED: "bg-blue-100 text-blue-700",
};

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}






