import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function Toast() {
  const { toast, clearToast } = useAppStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-sky-400" />,
  };

  return (
    <div className={`toast ${toast.type}`}>
      {icons[toast.type]}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={clearToast} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '2px' }}>
        <X size={14} />
      </button>
    </div>
  );
}
