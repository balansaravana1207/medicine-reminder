import MedicineCard from './MedicineCard';

/**
 * MedicineList — Renders the full medicine list or an empty state.
 * Maps the medicines array into MedicineCard components.
 */
export default function MedicineList({ medicines, onDelete, isLoading }) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-5">
                        <div className="flex items-start gap-4">
                            <div className="skeleton w-8 h-8 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="skeleton h-5 w-2/3 rounded" />
                                <div className="skeleton h-4 w-1/2 rounded" />
                                <div className="skeleton h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!medicines || medicines.length === 0) {
        return (
            <div className="glass-card animate-fade-in-up" id="empty-state">
                <div className="empty-state">
                    <span className="empty-state-icon">💊</span>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No medicines added yet
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Add your first medicine using the form to start receiving reminders.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 stagger-children" id="medicine-list">
            {medicines.map((medicine, index) => (
                <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onDelete={onDelete}
                    index={index}
                />
            ))}
        </div>
    );
}
