import { useEffect, useState } from 'react';
import { getCourses, createCourse, deleteCourse, getMe } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ name: '', year_level: 'Freshman' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { showConfirm } = useModal();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const res = await getMe();
            if (!res.data.is_superuser) {
                showToast('ACCESS DENIED: ADMINISTRATOR ONLY', 'error');
                navigate('/');
                return;
            }
            fetchCourses();
        } catch (err) {
            navigate('/');
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await getCourses();
            setCourses(res.data);
            setLoading(false);
        } catch (err) {
            showToast('Error loading courses', 'error');
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createCourse(newCourse);
            setNewCourse({ name: '', year_level: 'Freshman' });
            fetchCourses();
            showToast('Course added successfully', 'success');
        } catch (err) {
            showToast('Error adding course', 'error');
        }
    };

    const handleDelete = (id) => {
        showConfirm('Delete this course?', async () => {
            try {
                await deleteCourse(id);
                setCourses(courses.filter(c => c.id !== id));
                showToast('Course deleted successfully', 'success');
            } catch (err) {
                showToast('Error deleting course', 'error');
            }
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h1 className="glitch-text text-center">LOADING_COURSES...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="glitch-text mb-4">MANAGE_COURSES</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">ADD_NEW_COURSE</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAdd}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Course Name (e.g. Data Structures)"
                                    value={newCourse.name}
                                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={newCourse.year_level}
                                    onChange={e => setNewCourse({ ...newCourse, year_level: e.target.value })}
                                    required
                                >
                                    <option value="Preparatory">Preparatory Year</option>
                                    <option value="Freshman">Freshman Year</option>
                                    <option value="Sophomore">Sophomore Year</option>
                                    <option value="Junior">Junior Year</option>
                                    <option value="Senior">Senior Year</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary w-100">
                                    ADD_COURSE
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row g-3">
                {courses.length === 0 ? (
                    <div className="col-12">
                        <p className="text-center text-muted">NO_COURSES_FOUND</p>
                    </div>
                ) : (
                    courses.map(c => (
                        <div key={c.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{c.name}</h5>
                                    <p className="card-text text-muted mb-3">
                                        YEAR: <span className="text-white">{c.year_level}</span>
                                    </p>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        className="btn btn-outline-danger w-100"
                                    >
                                        DELETE_COURSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
