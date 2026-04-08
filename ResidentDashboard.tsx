import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets, CreditCard, MapPin, Bell, LogOut, Menu, X,
  TrendingUp, Wallet, Activity, ChevronRight, Plus,
  CheckCircle, Clock, RefreshCw, User, Settings, Home,
  Zap, AlertTriangle, Info
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import Logo from '../components/Logo';
import ConsumptionChart from '../components/ConsumptionChart';
import Toast from '../components/Toast';

interface Props {
  onNavigate: (page: string) => void;
}

export default function ResidentDashboard({ onNavigate }: Props) {
  const {
    currentUser, logout, topup, fetchKiosks, kiosks,
    topupHistory, showToast, activeSection, setActiveSection,
    sidebarOpen, setSidebarOpen,
  } = useAppStore();

  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState('mobile_money');
  const [topupLoading, setTopupLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch kiosks on mount (simulates GET /api/kiosks)
  useEffect(() => {
    fetchKiosks();
    const interval = setInterval(fetchKiosks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Protected route check
  useEffect(() => {
    if (!currentUser) onNavigate('login');
    else if (currentUser.role !== 'resident') onNavigate('utility_dashboard');
  }, [currentUser]);

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (!amount || amount < 5) { showToast('Minimum top-up is ZMW 5.00', 'error'); return; }
    if (amount > 500) { showToast('Maximum top-up is ZMW 500.00', 'error'); return; }

    setTopupLoading(true);
    // Simulate API call to POST /api/topup
    await new Promise(r => setTimeout(r, 1200));
    const ok = topup(amount, topupMethod);
    setTopupLoading(false);

    if (ok) {
      showToast(`✓ ZMW ${amount.toFixed(2)} added to your account!`, 'success');
      setTopupAmount('');
    } else {
      showToast('Top-up failed. Please try again.', 'error');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    fetchKiosks();
    setRefreshing(false);
    showToast('Data refreshed', 'info');
  };

  const nearbyKiosks = kiosks.filter(k => k.zone === currentUser?.zone || k.zone === 'Lusaka East').slice(0, 4);

  const navItems = [
    { id: 'dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { id: 'topup', icon: <Wallet size={18} />, label: 'Top Up Credits' },
    { id: 'kiosks', icon: <MapPin size={18} />, label: 'Nearby Kiosks' },
    { id: 'usage', icon: <Activity size={18} />, label: 'Usage History' },
    { id: 'alerts', icon: <Bell size={18} />, label: 'Alerts' },
    { id: 'profile', icon: <User size={18} />, label: 'My Profile' },
  ];

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <Toast />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: 260,
        background: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <Logo size="sm" />
        </div>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="badge badge-info" style={{ fontSize: 10, padding: '2px 6px' }}>Resident</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, background: 'var(--color-surface)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 2 }}>Water Credits</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>
              ZMW {currentUser.balance?.toFixed(2) ?? '0.00'}
            </div>
          </div>
        </div>

        {/* Nav */}
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

        {/* Logout */}
        <div style={{ padding: '12px 12px', borderTop: '1px solid var(--color-border)' }}>
          <button className="nav-link" style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', color: 'var(--color-danger)' }}
            onClick={() => { logout(); onNavigate('landing'); }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
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
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{currentUser.zone}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={handleRefresh}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}>
              <RefreshCw size={18} className={refreshing ? 'animate-spin-slow' : ''} />
            </button>
            <div className="badge badge-success"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Live</div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: 24, flex: 1 }}>

          {/* ─── DASHBOARD ─── */}
          {activeSection === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Welcome */}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Good day, {currentUser.name.split(' ')[0]}! 👋</h2>
                <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Account: {currentUser.accountNumber} · Meter: {currentUser.meterNumber}</p>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Water Balance', value: `ZMW ${currentUser.balance?.toFixed(2)}`, icon: <Wallet size={20} />, color: '#0ea5e9', sub: 'Available credits' },
                  { label: 'This Week', value: '845 L', icon: <Droplets size={20} />, color: '#06b6d4', sub: 'Total consumed' },
                  { label: 'Active Kiosks', value: `${kiosks.filter(k=>k.status==='online').length}`, icon: <MapPin size={20} />, color: '#10b981', sub: 'In your zone' },
                  { label: 'Last Top-Up', value: topupHistory.length ? `ZMW ${topupHistory[0].amount}` : 'None', icon: <CreditCard size={20} />, color: '#8b5cf6', sub: topupHistory.length ? topupHistory[0].timestamp.split(',')[0] : 'No history' },
                ].map((s, i) => (
                  <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}20`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{s.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>Weekly Consumption</h3>
                    <TrendingUp size={16} color="var(--color-primary)" />
                  </div>
                  <ConsumptionChart />
                </div>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>Quick Top-Up</h3>
                    <Zap size={16} color="#f59e0b" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                    {[20, 50, 100].map(amt => (
                      <button key={amt} onClick={() => setTopupAmount(String(amt))}
                        style={{
                          padding: '10px', borderRadius: 8, border: `1px solid ${topupAmount === String(amt) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: topupAmount === String(amt) ? 'rgba(14,165,233,0.1)' : 'var(--color-surface)',
                          color: topupAmount === String(amt) ? 'var(--color-primary)' : 'var(--color-text)',
                          cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
                        }}>
                        ZMW {amt}
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onClick={() => setActiveSection('topup')}>
                    <Plus size={16} /> Add Credits
                  </button>
                </div>
              </div>

              {/* Nearby kiosks */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Nearby Kiosks</h3>
                  <button onClick={() => setActiveSection('kiosks')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {nearbyKiosks.map(k => (
                    <div key={k.id} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{k.name}</div>
                        <span className={`badge badge-${k.status === 'online' ? 'success' : k.status === 'offline' ? 'danger' : 'warning'}`} style={{ fontSize: 10 }}>
                          {k.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 6 }}><MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />{k.location}</div>
                      {k.status === 'online' && (
                        <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                          <span style={{ color: 'var(--color-muted)' }}>Flow: <strong style={{ color: 'var(--color-text)' }}>{k.flow_rate} L/m</strong></span>
                          <span style={{ color: 'var(--color-muted)' }}>Pressure: <strong style={{ color: 'var(--color-text)' }}>{k.pressure} bar</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── TOP-UP ─── */}
          {activeSection === 'topup' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 560 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Top Up Water Credits</h2>

              {/* Balance card */}
              <div style={{
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                borderRadius: 16, padding: '24px',
                marginBottom: 24,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Current Balance</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 4 }}>ZMW {currentUser.balance?.toFixed(2)}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Account: {currentUser.accountNumber}</div>
              </div>

              {/* Top-up form */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Add Credits</h3>
                <form onSubmit={handleTopup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Quick amounts */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>Quick Select</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {[10, 20, 50, 100, 150, 200, 300, 500].map(amt => (
                        <button key={amt} type="button" onClick={() => setTopupAmount(String(amt))}
                          style={{
                            padding: '10px 4px', borderRadius: 8,
                            border: `1px solid ${topupAmount === String(amt) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            background: topupAmount === String(amt) ? 'rgba(14,165,233,0.15)' : 'var(--color-surface)',
                            color: topupAmount === String(amt) ? 'var(--color-primary)' : 'var(--color-muted)',
                            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
                            transition: 'all 0.2s',
                          }}>
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', marginBottom: 6 }}>Amount (ZMW)</label>
                    <input type="number" className="input-field" placeholder="Enter amount (min ZMW 5)"
                      value={topupAmount} onChange={e => setTopupAmount(e.target.value)}
                      min="5" max="500" step="0.01" />
                  </div>

                  {/* Payment method */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      {[
                        { id: 'mobile_money', label: '📱 Mobile Money' },
                        { id: 'bank_transfer', label: '🏦 Bank Transfer' },
                        { id: 'voucher', label: '🎟️ Voucher' },
                      ].map(m => (
                        <button key={m.id} type="button" onClick={() => setTopupMethod(m.id)}
                          style={{
                            padding: '10px 8px', borderRadius: 8, fontSize: 12,
                            border: `1px solid ${topupMethod === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            background: topupMethod === m.id ? 'rgba(14,165,233,0.1)' : 'var(--color-surface)',
                            color: topupMethod === m.id ? 'var(--color-primary)' : 'var(--color-muted)',
                            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
                          }}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" disabled={topupLoading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: topupLoading ? 0.7 : 1 }}>
                    {topupLoading ? (
                      <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite' }} /> Processing...</>
                    ) : (
                      <><Wallet size={16} /> Top Up ZMW {topupAmount || '0.00'}</>
                    )}
                  </button>
                </form>
              </div>

              {/* Transaction history */}
              {topupHistory.length > 0 && (
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Transaction History</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topupHistory.map(t => (
                        <tr key={t.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)' }}>{t.reference}</td>
                          <td style={{ fontWeight: 600 }}>ZMW {t.amount.toFixed(2)}</td>
                          <td style={{ textTransform: 'capitalize', fontSize: 13, color: 'var(--color-muted)' }}>{t.method.replace('_', ' ')}</td>
                          <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{t.timestamp}</td>
                          <td><span className="badge badge-success"><CheckCircle size={10} /> Completed</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── KIOSKS ─── */}
          {activeSection === 'kiosks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Kiosk Network</h2>
                <button onClick={handleRefresh} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RefreshCw size={14} className={refreshing ? 'animate-spin-slow' : ''} /> Refresh
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {kiosks.map((k, i) => (
                  <motion.div key={k.id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{k.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{k.id} · {k.zone}</div>
                      </div>
                      <span className={`badge badge-${k.status === 'online' ? 'success' : k.status === 'offline' ? 'danger' : 'warning'}`}>
                        {k.status === 'online' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />}
                        {k.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {k.location}
                    </div>
                    {k.status === 'online' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                          { label: 'Flow Rate', value: `${k.flow_rate} L/min` },
                          { label: 'Pressure', value: `${k.pressure} bar` },
                          { label: 'Daily Volume', value: `${k.daily_volume.toLocaleString()} L` },
                          { label: 'Updated', value: k.last_updated },
                        ].map(d => (
                          <div key={d.label} style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '8px 10px' }}>
                            <div style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 2 }}>{d.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{d.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={14} /> {k.status === 'offline' ? 'Kiosk offline — no service available' : 'Under scheduled maintenance'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── USAGE HISTORY ─── */}
          {activeSection === 'usage' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Usage History</h2>
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Weekly Consumption (Last 7 Days)</h3>
                <ConsumptionChart />
              </div>
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Daily Breakdown</h3>
                <table className="data-table">
                  <thead><tr><th>Day</th><th>Volume (L)</th><th>Cost (ZMW)</th><th>Status</th></tr></thead>
                  <tbody>
                    {useAppStore.getState().consumptionHistory.map((d, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{d.date}</td>
                        <td>{d.volume} L</td>
                        <td>ZMW {d.cost.toFixed(2)}</td>
                        <td><span className="badge badge-success"><CheckCircle size={10} /> Normal</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── ALERTS ─── */}
          {activeSection === 'alerts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Alerts & Notifications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { type: 'info', msg: 'Your water balance is sufficient for the next 7 days.', time: 'Just now', icon: <Info size={16} /> },
                  { type: 'warning', msg: 'Chelstone Kiosk has low pressure today. Consider using Matero Main.', time: '2 hrs ago', icon: <AlertTriangle size={16} /> },
                  { type: 'success', msg: 'Scheduled maintenance at Chawama Kiosk 1 completes tonight.', time: 'Today', icon: <CheckCircle size={16} /> },
                  { type: 'info', msg: 'New kiosk opening in Chilenje next month.', time: 'Yesterday', icon: <Info size={16} /> },
                ].map((a, i) => (
                  <div key={i} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: a.type === 'warning' ? 'rgba(245,158,11,0.1)' : a.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(14,165,233,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: a.type === 'warning' ? '#f59e0b' : a.type === 'success' ? '#10b981' : '#0ea5e9',
                    }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>{a.msg}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {a.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── PROFILE ─── */}
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 520 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>My Profile</h2>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'white' }}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{currentUser.name}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>{currentUser.email}</div>
                    <span className="badge badge-info" style={{ marginTop: 4 }}>Resident</span>
                  </div>
                </div>
                {[
                  { label: 'Account Number', value: currentUser.accountNumber },
                  { label: 'Meter Number', value: currentUser.meterNumber },
                  { label: 'Service Zone', value: currentUser.zone },
                  { label: 'User ID', value: currentUser.id },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 14, color: 'var(--color-muted)' }}>{f.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, fontFamily: f.label.includes('Number') || f.label === 'User ID' ? 'var(--font-mono)' : 'inherit', color: 'var(--color-primary)' }}>{f.value}</span>
                  </div>
                ))}
              </div>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={16} /> Account Settings
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
