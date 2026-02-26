import React from "react";

export default function LineChart({ data, width = 300, height = 80 }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-20 text-[10px] text-gray-300 tracking-widest">
        NOT ENOUGH DATA
      </div>
    );
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const padX = 6;
  const padY = 10;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  // Smooth path using quadratic bezier
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    pathD += ` Q ${prev.x + (mx - prev.x) * 0.5} ${prev.y}, ${mx} ${(prev.y + curr.y) / 2}`;
    if (i === points.length - 1) {
      pathD += ` T ${curr.x} ${curr.y}`;
    }
  }

  const areaPath = pathD + ` L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Area fill */}
      <path d={areaPath} fill="rgba(0,0,0,0.03)" />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* End dots */}
      <circle cx={points[0].x} cy={points[0].y} r="2.5" fill="#000" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#000" />
      {/* Labels */}
      <text x={points[0].x} y={height - 1} textAnchor="start" fontSize="6.5" fill="#aaa">
        {points[0].label}
      </text>
      <text x={points[points.length - 1].x} y={height - 1} textAnchor="end" fontSize="6.5" fill="#aaa">
        {points[points.length - 1].label}
      </text>
      {/* Current value */}
      <text
        x={points[points.length - 1].x}
        y={points[points.length - 1].y - 6}
        textAnchor="end"
        fontSize="7"
        fontWeight="bold"
        fill="#000"
      >
        {points[points.length - 1].value.toLocaleString()}
      </text>
    </svg>
  );
}
