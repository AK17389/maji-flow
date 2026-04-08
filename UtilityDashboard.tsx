import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Bell, LogOut, Menu, X,
  TrendingUp, Droplets, Settings, Home, RefreshCw,
  AlertTriangle, CheckCircle, Clock, Users,
  BarChart3, Shield, Database
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import Logo from '../components/Logo';
import NetworkMap from '../components/NetworkMap';
import WaterGauge from '../components/WaterGauge';
import Toast from '../components/Toast';

interface Props {
  onNavigate: (page: string) => void;
}

export default function UtilityDashboard({ onNavigate }: Props) {
  const {
    currentUser, logout, fetchKiosks, fetchNetworkStats,
    kiosks, networkStats, showToast, activeSection, setActiveSection,
    sidebarOpen, setSidebarOpen,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filterZone, setFilterZone] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch data on mount (simulates GET /api/network-stats and /api/kiosks)
  useEffect(() => {
    fetchKiosks();
    fetchNetworkStats();
    const interval = setInterval(() => {
      fetchKiosks();
      fetchNetworkStats();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Protected route: utility only
  useEffect(() => {
    if (!currentUser) onNavigate('login');
    else if (currentUser.role !== 'utility') onNavigate('resident_dashboard');
  }, [currentUser]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    fetchKiosks();
    fetchNetworkStats();
    setRefreshing(false);
    showToast('Network data refreshed', 'success');
  };

  const zones = ['All', ...Array.from(new Set(kiosks.map(k => k.zone)))];
  const filteredKiosks = kiosks.filter(k => {
    const zoneMatch = filterZone === 'All' || k.zone === filterZone;
    const statusMatch = filterStatus === 'All' || k.status === filterStatus;
    return zoneMatch && statusMatch;
  });

  const navItems = [
    { id: 'dashboard', icon: <Home size={18} />, label: 'Overview' },
    { id: 'network', icon: <MapPin size={18} />, label: 'Network Map' },
    { id: 'kiosks', icon: <Database size={18} />, label: 'Kiosk Management' },
    { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    { id: 'alerts', icon: <Bell size={18} />, label: 'Alerts' },
    { id: 'users', icon: <Users size={18} />, label: 'Users' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  if (!currentUser || !networkStats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ color: 'var(--color-muted)' }}>Loading network data...</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <Toast />

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
      }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <Logo size="sm" />
        </div>

        {/* Utility badge */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{currentUser.name}</div>
              <span className="badge badge-info" style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.3)' }}>
                <Shield size={10} /> Utility Operator
              </span>
            </div>
          </div>
          {/* Network status */}
          <div style={{ marginTop: 12, background: 'var(--color-surface)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>Network Health</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>{networkStats.network_efficiency}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${networkStats.network_efficiency}%` }} />
            </div>
          </div>
        </div>

        <nav style={{ padding: '12px 12px', flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 12px', borderTop: '1px solid var(--color-border)' }}>
          <button className="nav-link" style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', color: 'var(--color-danger)' }}
            onClick={() => { logout(); onNavigate('landing'); }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: 'var(--color-bg-card)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 24px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}>
              <Menu size={20} />
            </button>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>LWSC Operations Center</div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Lusaka Water & Sewerage Company</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={handleRefresh} className="btn-outline" style={{ padding: '6px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={14} className={refreshing ? 'animate-spin-slow' : ''} /> Refresh
            </button>
            <div className="badge badge-success"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Live Feed</div>
          </div>
        </header>

        <div style={{ padding: 24, flex: 1 }}>

          {/* ─── OVERVIEW ─── */}
          {activeSection === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Network Overview</h2>
                <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Real-time status of Lusaka's water distribution network</p>
              </div>

              {/* KPI cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Total Kiosks', value: networkStats.total_kiosks, icon: <Database size={20} />, color: '#0ea5e9' },
                  { label: 'Active / Online', value: networkStats.active_kiosks, icon: <CheckCircle size={20} />, color: '#10b981' },
                  { label: 'Offline', value: networkStats.offline_kiosks, icon: <X size={20} />, color: '#ef4444' },
                  { label: 'Maintenance', value: networkStats.maintenance_kiosks, icon: <Settings size={20} />, color: '#f59e0b' },
                  { label: 'Daily Volume', value: `${(networkStats.total_daily_volume / 1000).toFixed(1)}K L`, icon: <Droplets size={20} />, color: '#06b6d4' },
                  { label: 'Active Alerts', value: networkStats.alerts.filter(a => !a.resolved).length, icon: <Bell size={20} />, color: '#8b5cf6' },
                ].map((s, i) => (
                  <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}20`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Gauges + Map */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Network Gauges</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                    <WaterGauge value={networkStats.water_quality_index} label="Water Quality" unit="/ 100" color="#10b981" />
                    <WaterGauge value={Math.round(networkStats.network_efficiency)} label="Efficiency" unit="%" color="#0ea5e9" />
                  </div>
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>Distribution Map</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Lusaka Metro Area</span>
                  </div>
                  <NetworkMap />
                </div>
              </div>

              {/* Alerts */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Active Alerts</h3>
                  <button onClick={() => setActiveSection('alerts')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: 13 }}>View all</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {networkStats.alerts.filter(a => !a.resolved).map(alert => (
                    <div key={alert.id} style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      background: 'var(--color-surface)', borderRadius: 10, padding: '12px 14px',
                      borderLeft: `3px solid ${alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#0ea5e9'}`,
                    }}>
                      <div style={{ color: alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#0ea5e9' }}>
                        {alert.type === 'error' ? <AlertTriangle size={16} /> : alert.type === 'warning' ? <AlertTriangle size={16} /> : <Bell size={16} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{alert.message}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{alert.location} · {alert.timestamp}</div>
                      </div>
                      <span className={`badge badge-${alert.type === 'error' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}`} style={{ fontSize: 10 }}>
                        {alert.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── NETWORK MAP ─── */}
          {activeSection === 'network' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Network Map</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>Lusaka Distribution Network</span>
                  <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                    <span style={{ color: '#10b981' }}>● {networkStats.active_kiosks} Online</span>
                    <span style={{ color: '#ef4444' }}>● {networkStats.offline_kiosks} Offline</span>
                    <span style={{ color: '#f59e0b' }}>● {networkStats.maintenance_kiosks} Maintenance</span>
                  </div>
                </div>
                <div style={{ height: 460 }}>
                  <NetworkMap />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Avg Flow Rate', value: `${networkStats.avg_flow_rate} L/min`, color: '#0ea5e9' },
                  { label: 'Avg Pressure', value: `${networkStats.avg_pressure} bar`, color: '#06b6d4' },
                  { label: 'Total Volume Today', value: `${(networkStats.total_daily_volume / 1000).toFixed(1)}K L`, color: '#10b981' },
                  { label: 'Quality Index', value: `${networkStats.water_quality_index} / 100`, color: '#8b5cf6' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── KIOSK MANAGEMENT ─── */}
          {activeSection === 'kiosks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Kiosk Management</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Zone filter */}
                  <select value={filterZone} onChange={e => setFilterZone(e.target.value)}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>
                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                  {/* Status filter */}
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-sans)', fontSize: 13 }}>
                    {['All', 'online', 'offline', 'maintenance'].map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kiosk Name</th>
                      <th>Zone</th>
                      <th>Status</th>
                      <th>Flow Rate</th>
                      <th>Pressure</th>
                      <th>Daily Volume</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKiosks.map(k => (
                      <tr key={k.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)' }}>{k.id}</td>
                        <td style={{ fontWeight: 500 }}>{k.name}</td>
                        <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{k.zone}</td>
                        <td>
                          <span className={`badge badge-${k.status === 'online' ? 'success' : k.status === 'offline' ? 'danger' : 'warning'}`}>
                            {k.status === 'online' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />}
                            {k.status}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{k.flow_rate > 0 ? `${k.flow_rate} L/m` : '—'}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{k.pressure > 0 ? `${k.pressure} bar` : '—'}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{k.daily_volume > 0 ? `${k.daily_volume.toLocaleString()} L` : '—'}</td>
                        <td style={{ fontSize: 12, color: 'var(--color-muted)' }}><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />{k.last_updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── ANALYTICS ─── */}
          {activeSection === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Network Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Distribution by Zone</h3>
                  {['Lusaka East', 'Lusaka West', 'Lusaka South', 'Lusaka North'].map((zone, i) => {
                    const vol = [35, 28, 22, 15][i];
                    return (
                      <div key={zone} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span>{zone}</span>
                          <span style={{ color: 'var(--color-primary)' }}>{vol}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${vol}%`, background: ['#0ea5e9','#06b6d4','#10b981','#8b5cf6'][i] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Kiosk Uptime (7 days)</h3>
                  {kiosks.slice(0, 5).map((k) => {
                    const uptime = k.status === 'online' ? 95 + Math.random() * 5 : k.status === 'maintenance' ? 60 : 20;
                    return (
                      <div key={k.id} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span style={{ color: 'var(--color-muted)' }}>{k.id}</span>
                          <span style={{ color: uptime > 90 ? '#10b981' : uptime > 60 ? '#f59e0b' : '#ef4444' }}>{uptime.toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${uptime}%`, background: uptime > 90 ? '#10b981' : uptime > 60 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Peak Hour', value: '06:00 - 08:00', sub: 'Highest demand', icon: <TrendingUp size={20} />, color: '#f59e0b' },
                  { label: 'Avg Daily Users', value: '1,240', sub: 'Per kiosk', icon: <Users size={20} />, color: '#0ea5e9' },
                  { label: 'Water Saved', value: '2,400 L', sub: 'Vs. last week', icon: <Droplets size={20} />, color: '#10b981' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── ALERTS ─── */}
          {activeSection === 'alerts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Alerts & Incidents</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {networkStats.alerts.map(alert => (
                  <div key={alert.id} style={{
                    display: 'flex', gap: 16, alignItems: 'center',
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 12, padding: '16px 20px',
                    borderLeft: `4px solid ${alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#0ea5e9'}`,
                    opacity: alert.resolved ? 0.6 : 1,
                  }}>
                    <div style={{ color: alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#0ea5e9', flexShrink: 0 }}>
                      {alert.resolved ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{alert.message}</div>
                      <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{alert.location} · {alert.timestamp}</div>
                    </div>
                    <span className={`badge ${alert.resolved ? 'badge-success' : `badge-${alert.type === 'error' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}`}`}>
                      {alert.resolved ? 'Resolved' : alert.type}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── USERS ─── */}
          {activeSection === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Registered Users</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Account</th><th>Zone</th><th>Status</th></tr></thead>
                  <tbody>
                    {[
                      { name: 'Chanda Mwale', email: 'resident@majiflow.co.zm', role: 'Resident', account: 'MF-2024-0042', zone: 'Lusaka East', active: true },
                      { name: 'Ngosa Banda', email: 'utility@lwsc.co.zm', role: 'Utility', account: 'LWSC-OPS-001', zone: 'All Zones', active: true },
                      { name: 'Mwansa Phiri', email: 'mwansa@gmail.com', role: 'Resident', account: 'MF-2024-0087', zone: 'Lusaka West', active: true },
                      { name: 'Bwalya Mutale', email: 'bwalya@yahoo.com', role: 'Resident', account: 'MF-2024-0103', zone: 'Lusaka South', active: false },
                      { name: 'Temwa Zulu', email: 'temwa@outlook.com', role: 'Resident', account: 'MF-2024-0156', zone: 'Lusaka North', active: true },
                    ].map((u, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                        <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{u.email}</td>
                        <td><span className={`badge ${u.role === 'Utility' ? '' : 'badge-info'}`} style={u.role === 'Utility' ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', fontSize: 11, padding: '3px 8px', borderRadius: 20 } : { fontSize: 11 }}>{u.role}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{u.account}</td>
                        <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{u.zone}</td>
                        <td><span className={`badge badge-${u.active ? 'success' : 'danger'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── SETTINGS ─── */}
          {activeSection === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 560 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>System Settings</h2>
              {[
                { label: 'System Name', value: 'Maji Flow v2.0', desc: 'Application identifier' },
                { label: 'Operator', value: 'LWSC Zambia', desc: 'Lusaka Water & Sewerage Company' },
                { label: 'API Refresh Rate', value: '15 seconds', desc: 'Network data polling interval' },
                { label: 'Alert Threshold', value: 'Pressure < 2.0 bar', desc: 'Auto-alert trigger condition' },
                { label: 'Data Retention', value: '90 days', desc: 'Historical data storage period' },
              ].map(s => (
                <div key={s.label} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{s.desc}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-primary)', background: 'var(--color-surface)', padding: '6px 12px', borderRadius: 8 }}>{s.value}</div>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
