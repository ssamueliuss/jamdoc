import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'info' | 'success' | 'error';
interface Toast { id: number; message: string; type?: ToastType }

const ToastContext = createContext<{ addToast: (m: string, t?: ToastType) => void } | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, message, type }]);
    // auto remove
    setTimeout(() => {
      setToasts((t) => t.filter(tt => tt.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`max-w-xs p-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-indigo-600'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider');
  return ctx;
}
