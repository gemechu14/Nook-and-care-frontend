interface StatCard {
  label: string;
  value: number;
  trend: string;
  trendDirection: "up" | "down" | "flat";
  icon: React.ReactNode;
}

interface DashboardStatsProps {
  stats: StatCard[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const trendColor = (direction: StatCard["trendDirection"]): string => {
    if (direction === "up") return "text-teal-600";
    if (direction === "down") return "text-amber-600";
    return "text-slate-500";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(({ label, value, trend, trendDirection, icon }) => (
        <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              {icon}
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold ${trendColor(trendDirection)}`}>
                {trend}
              </span>
              <p className="text-[11px] text-slate-400 leading-tight">vs previous week</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}






