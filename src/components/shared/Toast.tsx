import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Floating Toast Stream (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-md shadow-lg border text-white text-xs sm:text-sm transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-discord-secondary border-l-4 border-l-discord-green border-discord-border'
                : toast.type === 'error'
                ? 'bg-discord-secondary border-l-4 border-l-discord-red border-discord-border'
                : toast.type === 'warning'
                ? 'bg-discord-secondary border-l-4 border-l-discord-yellow border-discord-border'
                : 'bg-discord-secondary border-l-4 border-l-discord-blurple border-discord-border'
            }`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-discord-green" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-discord-red" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-discord-yellow" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-discord-blurple" />}
            </div>

            {/* Message Text */}
            <div className="flex-1 font-medium leading-snug">{toast.message}</div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-discord-muted hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
