// context/ToastContext.jsx
// Global toast notifications - success, error, info messages ko bottom-right me dikhata hai

import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={16} className="text-tealdark shrink-0 mt-0.5" />,
  error:   <XCircle    size={16} className="text-red-500 shrink-0 mt-0.5" />,
  info:    <Info       size={16} className="text-amberdark shrink-0 mt-0.5" />,
};

const borderColors = {
  success: 'border-l-tealdark',
  error:   'border-l-red-500',
  info:    'border-l-amberdark',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container - fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.94 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto glass-card rounded-lg pl-3 pr-10 py-3 flex items-start gap-2.5 min-w-[260px] max-w-xs border-l-4 ${borderColors[t.type]} relative shadow-glass`}
            >
              {icons[t.type]}
              <p className="text-sm text-flip leading-snug">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="absolute right-2.5 top-2.5 text-flip-muted hover:text-flip transition-colors"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
