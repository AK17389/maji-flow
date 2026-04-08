
import { motion } from 'framer-motion';
import { Droplets, Shield, Zap, BarChart3, MapPin, Bell, ChevronRight, Users, Activity, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';

interface Props {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: Props) {
  const features = [
    { icon: <MapPin size={22} />, title: 'Kiosk Network', desc: 'Real-time monitoring of all water kiosks across Lusaka\'s distribution network.' },
    { icon: <BarChart3 size={22} />, title: 'Usage Analytics', desc: 'Track consumption patterns, costs, and water usage trends over time.' },
    { icon: <Zap size={22} />, title: 'Instant Top-Up', desc: 'Add water credits instantly via mobile money, bank, or voucher.' },
    { icon: <Bell size={22} />, title: 'Smart Alerts', desc: 'Get notified about outages, low pressure, and maintenance schedules.' },
    { icon: <Shield size={22} />, title: 'Secure Access', desc: 'Role-based access for residents and utility operators with full audit trails.' },
    { icon: <Activity size={22} />, title: 'Network Health', desc: 'Monitor pressure, flow rates, and water quality indices across all zones.' },
  ];

  const stats = [
    { value: '8', label: 'Active Kiosks', sub: 'Lusaka Network' },
    { value: '72K', label: 'Litres/Day', sub: 'Average distribution' },
    { value: '94%', label: 'Quality Index', sub: 'WHO standard' },
    { value: '5K+', label: 'Residents', sub: 'Registered users' },
  ];

  return (
    <div className="water-bg" style={{ minHeight: '100vh' }}>
      {/* Grid overlay */}
      <div className="grid-pattern" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(2,15,30,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-outline" onClick={() => onNavigate('login')} style={{ padding: '8px 20px', fontSize: 14 }}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => onNavigate('register')} style={{ padding: '8px 20px', fontSize: 14 }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="badge badge-info" style={{ marginBottom: 20 }}>
              <Activity size={12} /> Smart Water Management Platform
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 20,
              background: 'linear-gradient(135deg, #e2f0fb 0%, #67e8f9 50%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Clean Water,<br />Smarter Delivery
            </h1>
            <p style={{ fontSize: 17, color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Maji Flow connects residents to Lusaka's water kiosk network. Monitor usage, top up credits, and access clean water — anytime, anywhere.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => onNavigate('register')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Create Free Account <ChevronRight size={16} />
              </button>
              <button className="btn-outline" onClick={() => onNavigate('login')}>
                Demo Login
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 36 }}>
              {[['resident@majiflow.co.zm', 'water123', 'Resident'], ['utility@lwsc.co.zm', 'lwsc2026', 'Utility']].map(([email, pass, role]) => (
              <div key={role} style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
              }}>
                <div style={{ color: 'var(--color-muted)', marginBottom: 2 }}>Demo {role}</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-light)', fontSize: 11 }}>{email}</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: 11 }}>pw: {pass}</div>
              </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div style={{ position: 'relative' }}>
              <div className="animate-float" style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <img src="/hero-water.jpg" alt="Water meters" style={{ width: '100%', height: 260, objectFit: 'cover', opacity: 0.8 }} />
                {/* Overlay stats */}
                <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Network Status', value: 'ONLINE', color: '#10b981' },
                    { label: 'Active Kiosks', value: '6 / 8', color: '#0ea5e9' },
                    { label: 'Flow Rate', value: '10.0 L/min', color: '#06b6d4' },
                    { label: 'Quality Index', value: '94 / 100', color: '#8b5cf6' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badge */}
              <div style={{
                position: 'absolute', top: -16, right: -16,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                borderRadius: 12, padding: '10px 16px',
                boxShadow: '0 8px 24px rgba(14,165,233,0.4)',
                fontSize: 13, fontWeight: 700, color: 'white',
              }}>
                <div style={{ fontSize: 10, opacity: 0.8 }}>LWSC Zambia</div>
                <div>Certified ✓</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.4 }} style={{ textAlign: 'center' }}>
              <div className="stat-value">{s.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 12, color: 'var(--color-text)' }}>Everything You Need</h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: 500, margin: '0 auto' }}>A complete platform for residents and utility operators to manage Lusaka's water distribution.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.5 }}
              style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: 'rgba(14,165,233,0.12)',
                border: '1px solid rgba(14,165,233,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)',
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-bg-card2) 0%, var(--color-surface) 100%)',
          border: '1px solid var(--color-border)',
          borderRadius: 24, padding: '48px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Droplets size={40} color="#0ea5e9" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 12 }}>Ready to Get Started?</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>Join thousands of Lusaka residents already using Maji Flow for smarter water access.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => onNavigate('register')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} /> Register as Resident
            </button>
            <button className="btn-outline" onClick={() => onNavigate('login')}>
              Utility Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--color-muted)',
        fontSize: 13,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <CheckCircle size={14} color="#10b981" />
          <span>Powered by LWSC Zambia · Maji Flow v2.0 · © {new Date().getFullYear()}</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(107,143,173,0.6)' }}>Built with Flask · React · Smart IoT Sensors</div>
      </footer>
    </div>
  );
}
