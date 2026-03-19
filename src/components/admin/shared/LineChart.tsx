interface LineChartProps {
  values: number[];
  labels: string[];
}

interface Point {
  x: number;
  y: number;
}

function buildPoints(values: number[], left: number, right: number, top: number, bottom: number): Point[] {
  const max = Math.max(...values, 1);
  const stepX = (right - left) / Math.max(values.length - 1, 1);
  return values.map((value, index) => ({
    x: left + index * stepX,
    y: bottom - (value / max) * (bottom - top),
  }));
}

function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

export function LineChart({ values, labels }: LineChartProps) {
  const width = 1000;
  const height = 340;
  const left = 34;
  const right = 984;
  const top = 8;
  const bottom = 304;
  const points = buildPoints(values, left, right, top, bottom);
  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? right} ${bottom} L ${points[0]?.x ?? left} ${bottom} Z`;
  const max = Math.max(...values, 1);

  const yTicks = [0, 1, 2, 3, 4].map((step) => {
    const value = Math.round((max / 4) * step);
    const y = bottom - (value / max) * (bottom - top);
    return { value, y };
  });

  return (
    <div className="w-full h-64">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block w-full h-full">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yTicks.map((tick, index) => (
          <g key={`y-tick-${index}`}>
            <line x1={left} y1={tick.y} x2={right} y2={tick.y} stroke="#e2e8f0" strokeDasharray="3 6" />
            <text x={left + 2} y={tick.y - 4} textAnchor="start" className="fill-slate-400 text-[11px]">
              {tick.value}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#line-fill)" />
        <path d={linePath} fill="none" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point, i) => (
          <g key={labels[i] ?? i}>
            <circle cx={point.x} cy={point.y} r="6" fill="#0d9488" />
            <circle cx={point.x} cy={point.y} r="3.2" fill="#ffffff" />
            <text x={point.x} y={334} textAnchor="middle" className="fill-slate-400 text-[12px]">
              {labels[i] ?? ""}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
