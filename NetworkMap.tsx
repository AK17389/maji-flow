import { useAppStore } from '../lib/store';

export default function NetworkMap() {
  const { kiosks } = useAppStore();

  const statusColor = (status: string) => {
    if (status === 'online') return '#10b981';
    if (status === 'offline') return '#ef4444';
    return '#f59e0b';
  };

  // Normalize positions to fit in the map container
  const minLat = -15.48, maxLat = -15.34;
  const minLng = 28.24, maxLng = 28.37;

  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const toY = (lat: number) => ((lat - minLat) / (maxLat - minLat)) * 100;

  return (
    <div className="map-placeholder" style={{ height: '320px', padding: '16px' }}>
      {/* Grid lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
        {[0,25,50,75,100].map(p => (
          <line key={`h${p}`} x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#0ea5e9" strokeWidth="0.5" />
        ))}
        {[0,25,50,75,100].map(p => (
          <line key={`v${p}`} x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#0ea5e9" strokeWidth="0.5" />
        ))}
        {/* Pipe connections */}
        {kiosks.length > 1 && kiosks.slice(0, -1).map((k, i) => {
          const next = kiosks[i + 1];
          return (
            <line
              key={`pipe${i}`}
              x1={`${toX(k.lng)}%`} y1={`${100 - toY(k.lat)}%`}
              x2={`${toX(next.lng)}%`} y2={`${100 - toY(next.lat)}%`}
              stroke={k.status === 'online' ? '#0ea5e9' : '#1e3a5f'}
              strokeWidth="1.5"
              strokeDasharray={k.status === 'online' ? '6 3' : '4 4'}
              opacity="0.6"
            />
          );
        })}
      </svg>

      {/* Zone labels */}
      <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 10, color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Lusaka Distribution Network
      </div>

      {/* Kiosk markers */}
      {kiosks.map(k => (
        <div
          key={k.id}
          style={{
            position: 'absolute',
            left: `${toX(k.lng)}%`,
            top: `${100 - toY(k.lat)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Ripple for online */}
          {k.status === 'online' && (
            <div style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: `1px solid ${statusColor(k.status)}`,
              animation: 'ripple 2s ease-out infinite',
              opacity: 0.5,
            }} />
          )}
          {/* Dot */}
          <div
            title={`${k.name} - ${k.status}`}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: statusColor(k.status),
              border: '2px solid var(--color-bg)',
              cursor: 'pointer',
              boxShadow: `0 0 8px ${statusColor(k.status)}80`,
              position: 'relative',
              zIndex: 2,
            }}
          />
          {/* Label */}
          <div style={{
            position: 'absolute',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 9,
            color: 'var(--color-muted)',
            whiteSpace: 'nowrap',
            background: 'rgba(2,15,30,0.8)',
            padding: '2px 4px',
            borderRadius: 3,
          }}>
            {k.id}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        display: 'flex',
        gap: 12,
        fontSize: 11,
        background: 'rgba(2,15,30,0.8)',
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
      }}>
        {[['online','#10b981'],['offline','#ef4444'],['maintenance','#f59e0b']].map(([s,c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c as string }} />
            <span style={{ color: 'var(--color-muted)', textTransform: 'capitalize' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
