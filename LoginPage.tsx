import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../lib/store';
import Logo from '../components/Logo';

interface Props {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: Props) {
  const { login, authError, clearAuthError } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { clearAuthError(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    // Simulate network delay (like Flask POST /login)
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      // Redirect based on role (Flask redirect logic)
      const user = useAppStore.getState().currentUser;
      onNavigate(user?.role === 'utility' ? 'utility_dashboard' : 'resident_dashboard');
    }
  };

  const fillDemo = (type: 'resident' | 'utility') => {
    if (type === 'resident') { setEmail('resident@majiflow.co.zm'); setPassword('water123'); }
    else { setEmail('utility@lwsc.co.zm'); setPassword('lwsc2026'); }
    clearAuthError();
  };

  return (
    <div className="water-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="grid-pattern" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.3 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
      >
        {/* Back button */}
        <button
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24, padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to home
        </button>

        {/* Card */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 20,
          padding: '36px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Logo size="md" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome Back</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Sign in to your Maji Flow account</p>
          </div>

          {/* Demo buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            <button onClick={() => fillDemo('resident')} style={{
              background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)',
              borderRadius: 8, padding: '8px 12px', color: 'var(--color-primary)',
              fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
            }}>Use Resident Demo</button>
            <button onClick={() => fillDemo('utility')} style={{
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 8, padding: '8px 12px', color: '#a78bfa',
              fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
            }}>Use Utility Demo</button>
          </div>

          {/* Error */}
          {authError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
              <AlertCircle size={16} color="#ef4444" />
              <span style={{ fontSize: 14, color: '#ef4444' }}>{authError}</span>
            </motion.div>
          )}

          {/* Form - POST /login */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--color-muted)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  type="email" name="email" required
                  className="input-field"
                  style={{ paddingLeft: 42 }}
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearAuthError(); }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--color-muted)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'} name="password" required
                  className="input-field"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearAuthError(); }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite' }} /> Signing in...</>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-muted)' }}>
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Register here
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
