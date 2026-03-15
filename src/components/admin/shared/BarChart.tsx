const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

interface BarChartProps {
  values: number[];
}

export function BarChart({ values }: BarChartProps) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-2 h-48">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full rounded-t-sm bg-teal-500 transition-all" 
            style={{ height: `${(v / max) * 160}px` }} 
          />
          <span className="text-xs text-slate-400">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  );
}



