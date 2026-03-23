/**
 * MedicineCard — Displays a single medicine with name, dosage, time badge, and delete button.
 * Uses glassmorphism styling with hover effects and staggered entry animation.
 */
export default function MedicineCard({ medicine, onDelete, index }) {
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div
            className="glass-card p-5 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.08}s` }}
            id={`medicine-card-${medicine.id}`}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{ background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))', border: '1px solid rgba(79, 172, 254, 0.3)' }}>
                            💊
                        </div>
                        <h3 className="text-base font-semibold text-white truncate">
                            {medicine.medicine_name}
                        </h3>
                    </div>

                    <p className="text-sm mb-3 ml-11" style={{ color: 'var(--text-secondary)' }}>
                        {medicine.dosage}
                    </p>

                    <div className="flex items-center gap-3 ml-11 flex-wrap">
                        <span className="time-badge">
                            🕐 {formatTime(medicine.reminder_time)}
                        </span>
                        {medicine.created_at && (
                            <span className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                                Added {formatDate(medicine.created_at)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Delete */}
                <button
                    onClick={() => onDelete(medicine.id)}
                    className="btn-danger shrink-0"
                    id={`delete-medicine-${medicine.id}`}
                    title="Delete medicine"
                >
                    🗑️ Remove
                </button>
            </div>
        </div>
    );
}
