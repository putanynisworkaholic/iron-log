import React from "react";

export default function LineChart({ data, width = 280, height = 80, label = "volume" }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-20 text-xxs text-gray-300 tracking-widest">
        NOT ENOUGH DATA
      </div>
    );
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const padX = 4;
  const padY = 8;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((d.value - min) / range) * chartH;
    return { x, y, ...d };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");

  // Area fill
  const areaPath = [
    `M ${points[0].x} ${padY + chartH}`,
    ...points.map(p => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${padY + chartH}`,
    "Z",
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      {/* Area */}
      <path d={areaPath} fill="rgba(0,0,0,0.04)" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#000" />
      ))}
      {/* Labels */}
      {points.map((p, i) => (
        i === 0 || i === points.length - 1 ? (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - 1}
            textAnchor={i === 0 ? "start" : "end"}
            fontSize="7"
            fill="#999"
          >
            {p.label}
          </text>
        ) : null
      ))}
    </svg>
  );
}
