import { useEffect, useState } from 'react';

/**
 * NotificationToast — Displays reminder notifications as slide-in toasts.
 * Auto-dismisses after 5 seconds with a smooth exit animation.
 */
export default function NotificationToast({ reminders }) {
    const [visible, setVisible] = useState([]);

    useEffect(() => {
        if (reminders.length > 0) {
            const latest = reminders[reminders.length - 1];
            const id = `${latest.id}-${latest.triggered_at}`;

            // Avoid duplicate toasts
            if (!visible.find(v => v.uniqueId === id)) {
                const toast = { ...latest, uniqueId: id, exiting: false };
                setVisible(prev => [...prev, toast]);

                // Auto-dismiss after 5 seconds
                setTimeout(() => {
                    setVisible(prev =>
                        prev.map(t => t.uniqueId === id ? { ...t, exiting: true } : t)
                    );
                    setTimeout(() => {
                        setVisible(prev => prev.filter(t => t.uniqueId !== id));
                    }, 300);
                }, 5000);
            }
        }
    }, [reminders]);

    const dismiss = (uniqueId) => {
        setVisible(prev =>
            prev.map(t => t.uniqueId === uniqueId ? { ...t, exiting: true } : t)
        );
        setTimeout(() => {
            setVisible(prev => prev.filter(t => t.uniqueId !== uniqueId));
        }, 300);
    };

    if (visible.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-50 space-y-3" style={{ maxWidth: '380px' }}>
            {visible.map((toast) => (
                <div
                    key={toast.uniqueId}
                    className={`glass-card p-4 ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
                    style={{
                        background: 'rgba(102, 126, 234, 0.15)',
                        borderColor: 'rgba(102, 126, 234, 0.4)',
                    }}
                >
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                            🔔
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">
                                Time to take {toast.medicine_name}
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                {toast.dosage} — Scheduled at {toast.reminder_time}
                            </p>
                        </div>
                        <button
                            onClick={() => dismiss(toast.uniqueId)}
                            className="text-white/50 hover:text-white transition-colors text-sm shrink-0 mt-0.5"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
