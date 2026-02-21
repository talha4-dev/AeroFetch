import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', title = '', message = '', duration = 4000 }) => {
        const id = ++idCounter;
        setToasts(prev => [...prev, { id, type, title, message, leaving: false }]);
        setTimeout(() => {
            // Mark as leaving (exit animation)
            setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 350);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, []);

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container" role="status" aria-live="polite">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type}${toast.leaving ? ' leaving' : ''}`}>
                        <span className="toast-icon">{icons[toast.type]}</span>
                        <div className="toast-content">
                            {toast.title && <div className="toast-title">{toast.title}</div>}
                            {toast.message && <div className="toast-message">{toast.message}</div>}
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close">×</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be within ToastProvider');
    return ctx;
};
