interface GaugeProps {
  value: number;   // 0-100
  label: string;
  unit: string;
  color?: string;
}

export default function WaterGauge({ value, label, unit, color = '#0ea5e9' }: GaugeProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75; // 270 degrees
  const offset = arc - (value / 100) * arc;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="var(--color-surface)"
          strokeWidth="10"
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(135 70 70)"
        />
        {/* Fill */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${arc - offset} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(135 70 70)"
          style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        {/* Value text */}
        <text x="70" y="66" textAnchor="middle" fill="var(--color-text)" fontSize="22" fontWeight="700" fontFamily="Outfit">
          {value}
        </text>
        <text x="70" y="84" textAnchor="middle" fill="var(--color-muted)" fontSize="11" fontFamily="Outfit">
          {unit}
        </text>
      </svg>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 500, textAlign: 'center' }}>{label}</div>
    </div>
  );
}
