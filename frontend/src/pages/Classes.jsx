import { useEffect, useState } from 'react';
import { getClasses, createClass, deleteClass, getCourses, getStudentClasses, getMe } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [studentClasses, setStudentClasses] = useState([]);
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [newClass, setNewClass] = useState({ course_name: '', day: '', start_time: '', end_time: '', location: '' });
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

            if (admin) {
                const classesRes = await getStudentClasses();
                setStudentClasses(classesRes.data);
                fetchCourses();
            } else {
                fetchClasses();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = (classIds = null) => {
        if (classIds === null) {
            getClasses().then(res => setClasses(res.data)).catch(err => console.error(err));
            return;
        }

        if (classIds.length === 0) {
            setClasses([]);
            return;
        }

        Promise.all(classIds.map(id => getClasses({ student_class_id: id })))
            .then(responses => {
                const allClasses = responses.flatMap(res => res.data);
                setClasses(allClasses);
            })
            .catch(err => console.error(err));
    };

    const fetchCourses = () => {
        getCourses().then(res => setCourses(res.data)).catch(err => console.error(err));
    };

    const handleClassToggle = (classId) => {
        setSelectedClassIds(prev => {
            const newSelection = prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId];
            fetchClasses(newSelection);
            return newSelection;
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (selectedClassIds.length === 0) {
            showToast('Please select at least one student class', 'error');
            return;
        }
        try {
            await createClass({ ...newClass, student_class_ids: selectedClassIds });
            setNewClass({ course_name: '', day: '', start_time: '', end_time: '', location: '' });
            fetchClasses(selectedClassIds);
            showToast(`Class added successfully for ${selectedClassIds.length} group(s)!`, 'success');
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Error adding class';
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = (id) => {
        showConfirm('Delete this class?', async () => {
            try {
                await deleteClass(id);
                fetchClasses(isAdmin ? selectedClassIds : []);
                showToast('Class deleted successfully!', 'success');
            } catch (err) {
                showToast('Error deleting class', 'error');
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
            <h1 className="glitch-text mb-4">{isAdmin ? 'MANAGE_CLASS_SCHEDULES' : 'MY_CLASS_SCHEDULE'}</h1>

            {/* Admin: Multi-select Class Groups */}
            {isAdmin && (
                <div className="card mb-4 border-primary">
                    <div className="card-header">
                        <h5 className="mb-0">SELECT_TARGET_CLASSES ({selectedClassIds.length} selected)</h5>
                    </div>
                    <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <div className="d-grid gap-2">
                            {studentClasses.map(c => (
                                <div key={c.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`class-${c.id}`}
                                        checked={selectedClassIds.includes(c.id)}
                                        onChange={() => handleClassToggle(c.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`class-${c.id}`}>
                                        {c.name} ({c.year_level})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Admin: Add New Schedule Form */}
            {isAdmin && selectedClassIds.length > 0 && (
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
                                        value={newClass.course_name}
                                        onChange={e => setNewClass({ ...newClass, course_name: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={newClass.day}
                                        onChange={e => setNewClass({ ...newClass, day: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Location"
                                        value={newClass.location}
                                        onChange={e => setNewClass({ ...newClass, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={newClass.start_time}
                                        onChange={e => setNewClass({ ...newClass, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={newClass.end_time}
                                        onChange={e => setNewClass({ ...newClass, end_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <button type="submit" className="btn btn-primary w-100">
                                        ADD_SCHEDULE
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Student View: Day-Grouped Schedules */}
            {!isAdmin && classes.length > 0 && (
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                    const dayClasses = classes.filter(c => c.day === day);
                    if (dayClasses.length === 0) return null;

                    return (
                        <div key={day} className="mb-4">
                            <h2 className="text-primary border-bottom border-primary pb-2 mb-3">
                                {day.toUpperCase()}
                            </h2>
                            <div className="row g-3">
                                {dayClasses.map(c => (
                                    <div key={c.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title text-primary">{c.course_name}</h5>
                                                <p className="card-text text-muted mb-1">
                                                    TIME: <span className="text-white">{c.start_time.slice(0, 5)} - {c.end_time.slice(0, 5)}</span>
                                                </p>
                                                <p className="card-text text-muted mb-0">
                                                    LOC: <span className="text-white">{c.location}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}

            {!isAdmin && classes.length === 0 && (
                <p className="text-center text-muted">NO_SCHEDULE_DATA_FOUND</p>
            )}

            {/* Admin View: All Schedules */}
            {isAdmin && (
                <div className="row g-3">
                    {classes.length === 0 ? (
                        <div className="col-12">
                            <p className="text-center text-muted">
                                {selectedClassIds.length === 0 ? 'Select class groups to view schedules.' : 'NO_SCHEDULE_DATA_FOUND'}
                            </p>
                        </div>
                    ) : (
                        classes.map(c => (
                            <div key={c.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title text-primary">{c.course_name}</h5>
                                        <p className="card-text text-muted mb-1">
                                            DAY: <span className="text-white">{c.day}</span>
                                        </p>
                                        <p className="card-text text-muted mb-1">
                                            TIME: <span className="text-white">{c.start_time.slice(0, 5)} - {c.end_time.slice(0, 5)}</span>
                                        </p>
                                        <p className="card-text text-muted mb-3">
                                            LOC: <span className="text-white">{c.location}</span>
                                        </p>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="btn btn-outline-danger w-100"
                                        >
                                            DELETE_ENTRY
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Classes;
