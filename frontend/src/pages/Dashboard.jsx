import { useState, useEffect, useCallback } from 'react';
import MedicineForm from '../components/MedicineForm';
import MedicineList from '../components/MedicineList';
import NotificationToast from '../components/NotificationToast';
import { getMedicines, addMedicine, deleteMedicine, getTriggeredReminders } from '../services/api';

/**
 * Dashboard — The main page.
 * Owns all state, fetches data on mount, passes props to children.
 * Polls for triggered reminders every 30 seconds.
 */
export default function Dashboard() {
    const [medicines, setMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reminders, setReminders] = useState([]);
    const [stats, setStats] = useState({ total: 0, upcoming: 0 });

    // ─── Fetch medicines on mount ───
    const fetchMedicines = useCallback(async () => {
        try {
            const data = await getMedicines();
            setMedicines(data);
            updateStats(data);
        } catch (err) {
            console.error('Failed to fetch medicines:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ─── Update stats ───
    const updateStats = (meds) => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const upcoming = meds.filter(m => m.reminder_time >= currentTime).length;
        setStats({ total: meds.length, upcoming });
    };

    // ─── Add medicine handler ───
    const handleAdd = async (medicineData) => {
        const newMedicine = await addMedicine(medicineData);
        setMedicines(prev => [newMedicine, ...prev]);
        updateStats([newMedicine, ...medicines]);
    };

    // ─── Delete medicine handler ───
    const handleDelete = async (id) => {
        await deleteMedicine(id);
        const updated = medicines.filter(m => m.id !== id);
        setMedicines(updated);
        updateStats(updated);
    };

    // ─── Poll for triggered reminders ───
    useEffect(() => {
        fetchMedicines();

        const reminderPoll = setInterval(async () => {
            try {
                const data = await getTriggeredReminders();
                setReminders(data);
            } catch (err) {
                // Silently fail — reminders are non-critical
            }
        }, 30000);

        return () => clearInterval(reminderPoll);
    }, [fetchMedicines]);

    // ─── Current time display ───
    const [currentTime, setCurrentTime] = useState('');
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            {/* Notification Toasts */}
            <NotificationToast reminders={reminders} />

            {/* ─── Header ─── */}
            <header className="max-w-6xl mx-auto mb-8 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
                                💊
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    Medicine Reminder
                                </h1>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Never miss a dose again
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Live Clock */}
                    <div className="glass-card px-5 py-3" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-3">
                            <span className="text-lg">🕐</span>
                            <div>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Current Time
                                </p>
                                <p className="text-lg font-semibold" style={{
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontVariantNumeric: 'tabular-nums',
                                }}>
                                    {currentTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex gap-4 mt-6">
                    <div className="glass-card px-4 py-3 flex items-center gap-3" style={{ animationDelay: '0.3s' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))', border: '1px solid rgba(79, 172, 254, 0.3)' }}>
                            📋
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total</p>
                            <p className="text-lg font-bold text-white">{stats.total}</p>
                        </div>
                    </div>
                    <div className="glass-card px-4 py-3 flex items-center gap-3" style={{ animationDelay: '0.35s' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2))', border: '1px solid rgba(240, 147, 251, 0.3)' }}>
                            ⏰
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Upcoming</p>
                            <p className="text-lg font-bold text-white">{stats.upcoming}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Main Content ─── */}
            <main className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-8">
                            <MedicineForm onAdd={handleAdd} />
                        </div>
                    </div>

                    {/* Right Column: Medicine List */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span>📋</span> Your Medicines
                                {medicines.length > 0 && (
                                    <span className="text-xs font-normal px-2 py-0.5 rounded-full ml-1"
                                        style={{
                                            background: 'rgba(102, 126, 234, 0.15)',
                                            color: '#a5b4fc',
                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                        }}>
                                        {medicines.length}
                                    </span>
                                )}
                            </h2>
                            <button
                                onClick={fetchMedicines}
                                className="text-sm px-3 py-1.5 rounded-lg transition-all"
                                style={{
                                    color: 'var(--text-secondary)',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => e.target.style.borderColor = 'rgba(102, 126, 234, 0.4)'}
                                onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                id="refresh-btn"
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        <MedicineList
                            medicines={medicines}
                            onDelete={handleDelete}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </main>

            {/* ─── Footer ─── */}
            <footer className="max-w-6xl mx-auto mt-12 pb-6 text-center">
                <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                    Medicine Reminder Prototype • Built with React + FastAPI + SQLite + APScheduler
                </p>
            </footer>
        </div>
    );
}
