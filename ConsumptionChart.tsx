import { useAppStore } from '../lib/store';

export default function ConsumptionChart() {
  const { consumptionHistory } = useAppStore();
  const maxVol = Math.max(...consumptionHistory.map(d => d.volume));

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
        {consumptionHistory.map((day, i) => {
          const heightPct = (day.volume / maxVol) * 100;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, color: 'var(--color-muted)' }}>{day.volume}L</div>
              <div
                style={{
                  width: '100%',
                  height: `${heightPct}%`,
                  background: i === consumptionHistory.length - 1
                    ? 'linear-gradient(180deg, #0ea5e9, #06b6d4)'
                    : 'linear-gradient(180deg, rgba(14,165,233,0.6), rgba(6,182,212,0.3))',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.5s ease',
                  minHeight: 4,
                  position: 'relative',
                  cursor: 'pointer',
                }}
                title={`${day.date}: ${day.volume}L — ZMW ${day.cost.toFixed(2)}`}
              />
              <div style={{ fontSize: 10, color: 'var(--color-muted)' }}>{day.date}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--color-muted)' }}>
        <span>Total: {consumptionHistory.reduce((s,d) => s + d.volume, 0)}L this week</span>
        <span>Cost: ZMW {consumptionHistory.reduce((s,d) => s + d.cost, 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
