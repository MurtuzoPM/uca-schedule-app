import { useEffect, useState } from 'react';
import { getGymSchedules, createGymSchedule, deleteGymSchedule, getMe } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';

const Gym = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [newSchedule, setNewSchedule] = useState({ day: '', open_time: '', close_time: '' });
    const [copiedSchedule, setCopiedSchedule] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();
    const { showConfirm } = useModal();

    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            const res = await getMe();
            const admin = res.data.is_superuser;
            setIsAdmin(admin);
            fetchGym();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGym = (gender = null) => {
        const params = gender ? { gender } : {};
        getGymSchedules(params).then(res => setSchedules(res.data)).catch(err => console.error(err));
    };

    const handleGenderSelect = (e) => {
        const gender = e.target.value;
        setSelectedGender(gender);
        if (gender) {
            fetchGym(gender);
        } else {
            setSchedules([]);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (isAdmin && !selectedGender) {
            showToast('Please select a gender first', 'error');
            return;
        }
        try {
            const data = isAdmin ? { ...newSchedule, gender: selectedGender } : newSchedule;
            await createGymSchedule(data);
            setNewSchedule({ day: '', open_time: '', close_time: '' });
            fetchGym(isAdmin ? selectedGender : null);
            showToast('Gym schedule added successfully!', 'success');
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.response?.data?.gender?.[0] || 'Error adding schedule';
            showToast(errorMsg, 'error');
        }
    };

    const handleCopy = (schedule) => {
        setCopiedSchedule(schedule);
        showToast('Schedule copied! Select a day to paste.', 'success');
    };

    const handlePaste = async (targetDay) => {
        if (!copiedSchedule) return;

        try {
            const pasteData = {
                day: targetDay,
                open_time: copiedSchedule.open_time,
                close_time: copiedSchedule.close_time,
                gender: selectedGender
            };
            await createGymSchedule(pasteData);
            fetchGym(selectedGender);
            showToast(`Schedule pasted to ${targetDay}!`, 'success');
            setCopiedSchedule(null);
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Error pasting schedule';
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = (id) => {
        showConfirm('Delete this gym schedule?', async () => {
            try {
                await deleteGymSchedule(id);
                fetchGym(isAdmin ? selectedGender : null);
                showToast('Gym schedule deleted successfully!', 'success');
            } catch (err) {
                showToast('Error deleting gym schedule', 'error');
            }
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h1 className="glitch-text text-center">LOADING_MODULE...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="glitch-text mb-4">{isAdmin ? 'MANAGE_GYM_SCHEDULES' : 'MY_GYM_SCHEDULE'}</h1>

            {/* Admin: Gender Selection */}
            {isAdmin && (
                <div className="card mb-4 border-primary">
                    <div className="card-header">
                        <h5 className="mb-0">SELECT_TARGET_GENDER</h5>
                    </div>
                    <div className="card-body">
                        <select
                            className="form-select"
                            value={selectedGender}
                            onChange={handleGenderSelect}
                        >
                            <option value="">-- Select Gender --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Admin: Add New Schedule Form */}
            {isAdmin && selectedGender && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">ADD_NEW_ENTRY</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleAdd}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={newSchedule.day}
                                        onChange={e => setNewSchedule({ ...newSchedule, day: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={newSchedule.open_time}
                                        onChange={e => setNewSchedule({ ...newSchedule, open_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={newSchedule.close_time}
                                        onChange={e => setNewSchedule({ ...newSchedule, close_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button type="submit" className="btn btn-primary w-100">
                                        ADD
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin: Copy/Paste Panel */}
            {isAdmin && selectedGender && copiedSchedule && (
                <div className="card mb-4 border-primary">
                    <div className="card-header">
                        <h5 className="mb-0">PASTE_SCHEDULE</h5>
                    </div>
                    <div className="card-body">
                        <p className="text-muted mb-3">
                            Copied: {copiedSchedule.day} ({copiedSchedule.open_time.slice(0, 5)} - {copiedSchedule.close_time.slice(0, 5)})
                        </p>
                        <div className="row g-2 mb-3">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <div key={day} className="col">
                                    <button
                                        onClick={() => handlePaste(day)}
                                        disabled={day === copiedSchedule.day}
                                        className={`btn w-100 ${day === copiedSchedule.day ? 'btn-secondary' : 'btn-primary'}`}
                                    >
                                        {day.slice(0, 3).toUpperCase()}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setCopiedSchedule(null)}
                            className="btn btn-outline-secondary w-100"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            {/* Schedules Display: Day-Grouped */}
            {schedules.length === 0 ? (
                <p className="text-center text-muted">
                    {isAdmin && !selectedGender ? 'Select a gender to view schedules.' : 'NO_GYM_DATA_FOUND'}
                </p>
            ) : (
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const daySchedules = schedules.filter(s => s.day === day);
                    if (daySchedules.length === 0) return null;

                    return (
                        <div key={day} className="mb-4">
                            <h2 className="text-primary border-bottom border-primary pb-2 mb-3">
                                {day.toUpperCase()}
                            </h2>
                            <div className="row g-3">
                                {daySchedules.map(s => (
                                    <div key={s.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="card">
                                            <div className="card-body">
                                                <p className="card-text text-muted mb-1">
                                                    OPEN: <span className="text-white">{s.open_time ? s.open_time.substring(0, 5) : "--:--"}</span>
                                                </p>
                                                <p className="card-text text-muted mb-3">
                                                    CLOSE: <span className="text-white">{s.close_time.slice(0, 5)}</span>
                                                </p>
                                                {isAdmin && (
                                                    <div className="d-grid gap-2">
                                                        <button
                                                            onClick={() => handleCopy(s)}
                                                            className="btn btn-outline-primary btn-sm"
                                                        >
                                                            COPY_SCHEDULE
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(s.id)}
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            DELETE_ENTRY
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Gym;
