import { useState } from 'react';

/**
 * MedicineForm — Controlled form component for adding medicines.
 * Manages its own input state; calls parent's onAdd callback on submit.
 * Includes validation feedback and loading state.
 */
export default function MedicineForm({ onAdd }) {
    const [formData, setFormData] = useState({
        medicine_name: '',
        dosage: '',
        reminder_time: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.medicine_name.trim() || !formData.dosage.trim() || !formData.reminder_time) {
            setError('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await onAdd(formData);
            setFormData({ medicine_name: '', dosage: '', reminder_time: '' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add medicine');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-6 animate-fade-in-up" id="medicine-form-card">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    💊
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Add Medicine</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Set up a new reminder
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} id="add-medicine-form">
                <div className="space-y-4">
                    {/* Medicine Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Medicine Name
                        </label>
                        <input
                            type="text"
                            name="medicine_name"
                            id="medicine-name-input"
                            value={formData.medicine_name}
                            onChange={handleChange}
                            placeholder="e.g. Metformin"
                            className="glass-input"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Dosage */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Dosage
                        </label>
                        <input
                            type="text"
                            name="dosage"
                            id="dosage-input"
                            value={formData.dosage}
                            onChange={handleChange}
                            placeholder="e.g. 500mg twice daily"
                            className="glass-input"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Reminder Time */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Reminder Time
                        </label>
                        <input
                            type="time"
                            name="reminder_time"
                            id="reminder-time-input"
                            value={formData.reminder_time}
                            onChange={handleChange}
                            className="glass-input"
                            disabled={isSubmitting}
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 rounded-lg text-sm animate-fade-in"
                        style={{
                            background: 'rgba(245, 87, 108, 0.1)',
                            border: '1px solid rgba(245, 87, 108, 0.3)',
                            color: '#f5576c'
                        }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    id="add-medicine-btn"
                    className="btn-primary w-full mt-6"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Adding...
                        </span>
                    ) : (
                        '➕ Add Medicine'
                    )}
                </button>
            </form>
        </div>
    );
}
