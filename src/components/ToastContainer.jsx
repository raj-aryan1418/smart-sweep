import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        let className = 'toast toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          className = 'toast toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          className = 'toast toast-error';
        }

        return (
          <div key={toast.id} className={className}>
            <Icon size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--text-dim)', padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
