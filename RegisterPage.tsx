import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { UserRole } from '../lib/store';
import Logo from '../components/Logo';

interface Props {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: Props) {
  const { register, authError, clearAuthError } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => { clearAuthError(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirm) { setLocalError('Passwords do not match.'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = register(name, email, password, role);
    setLoading(false);
    if (ok) {
      onNavigate(role === 'utility' ? 'utility_dashboard' : 'resident_dashboard');
    }
  };

  const error = localError || authError;

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div className="water-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="grid-pattern" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.3 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}
      >
        <button
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24, padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to home
        </button>

        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 20,
          padding: '36px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Logo size="md" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Create Account</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Join Maji Flow — smart water for Zambia</p>
          </div>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {(['resident', 'utility'] as UserRole[]).map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                padding: '12px',
                borderRadius: 10,
                border: `2px solid ${role === r ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: role === r ? 'rgba(14,165,233,0.1)' : 'transparent',
                color: role === r ? 'var(--color-primary)' : 'var(--color-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                {role === r && <CheckCircle size={14} />}
                {r === 'resident' ? '🏠 Resident' : '🏭 Utility'}
              </button>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
              <AlertCircle size={16} color="#ef4444" />
              <span style={{ fontSize: 14, color: '#ef4444' }}>{error}</span>
            </motion.div>
          )}

          {/* Form - POST /register */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--color-muted)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input type="text" name="name" required className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="Chanda Mwale" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--color-muted)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input type="email" name="email" required className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); clearAuthError(); }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--color-muted)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input type={showPw ? 'text' : 'password'} name="password" required className="input-field" style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--color-surface)', borderRadius: 2 }}>
                    <div style={{ width: `${(pwStrength / 3) * 100}%`, height: '100%', background: strengthColors[pwStrength], borderRadius: 2, transition: 'all 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: strengthColors[pwStrength] }}>{strengthLabels[pwStrength]}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--color-muted)' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input type={showPw ? 'text' : 'password'} name="confirm" required className="input-field" style={{ paddingLeft: 42 }}
                  placeholder="Repeat password" value={confirm} onChange={e => { setConfirm(e.target.value); setLocalError(''); }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite' }} /> Creating account...</>
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-muted)' }}>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Sign in
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
