import { Droplets } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 20, title: 'text-lg', sub: 'text-xs' },
    md: { icon: 28, title: 'text-xl', sub: 'text-xs' },
    lg: { icon: 40, title: 'text-3xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: s.icon + 16,
        height: s.icon + 16,
        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
        flexShrink: 0,
      }}>
        <Droplets size={s.icon} color="white" />
      </div>
      {showText && (
        <div>
          <div className={`${s.title} font-bold`} style={{ lineHeight: 1.1, background: 'linear-gradient(135deg, #e2f0fb, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Maji Flow
          </div>
          <div className={s.sub} style={{ color: 'var(--color-muted)', letterSpacing: '0.05em' }}>
            Smart Water Management
          </div>
        </div>
      )}
    </div>
  );
}
