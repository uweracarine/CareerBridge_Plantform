import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationContext = createContext(null);

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const STYLES = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  warning: 'bg-warning text-white',
  info: 'bg-secondary text-white',
};

function Toast({ toast, onRemove }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-sm ${STYLES[toast.type]} animate-slide-up`}>
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="shrink-0 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    if (duration > 0) setTimeout(() => remove(id), duration);
  }, [remove]);

  const success = useCallback((msg) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg) => toast(msg, 'error'), [toast]);
  const warning = useCallback((msg) => toast(msg, 'warning'), [toast]);
  const info = useCallback((msg) => toast(msg, 'info'), [toast]);

  return (
    <NotificationContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => <Toast key={t.id} toast={t} onRemove={remove} />)}
      </div>
    </NotificationContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useToast must be used within NotificationProvider');
  return ctx;
};
