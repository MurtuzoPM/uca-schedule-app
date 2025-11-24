import { useEffect, useState } from 'react';
import { getStudentClasses, createStudentClass, deleteStudentClass, getMe } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';

const StudentClasses = () => {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({ name: '', year_level: 'Freshman' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { showConfirm } = useModal();

    useEffect(() => {
        getMe().then(res => {
            if (!res.data.is_superuser) {
                showToast('ACCESS DENIED: ADMINISTRATOR ONLY', 'error');
                navigate('/');
            } else {
                setIsAdmin(true);
                fetchClasses();
            }
        }).catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, []);

    const fetchClasses = () => {
        getStudentClasses().then(res => setClasses(res.data)).catch(err => console.error(err));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createStudentClass(newClass);
            setNewClass({ name: '', year_level: 'Freshman' });
            fetchClasses();
            showToast('Class added successfully!', 'success');
        } catch (err) {
            const errorMsg = err.response?.data?.name?.[0] || err.response?.data?.year_level?.[0] || 'Error adding class';
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = (id) => {
        showConfirm('Delete this class group?', async () => {
            try {
                await deleteStudentClass(id);
                fetchClasses();
                showToast('Class deleted successfully!', 'success');
            } catch (err) {
                showToast('Error deleting class', 'error');
            }
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h1 className="glitch-text text-center">VERIFYING_ACCESS...</h1>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="container mt-4">
            <h1 className="glitch-text mb-4">MANAGE_STUDENT_CLASSES</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">ADD_NEW_CLASS_GROUP</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAdd}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Class Name (e.g. CS-101)"
                                    value={newClass.name}
                                    onChange={e => setNewClass({ ...newClass, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={newClass.year_level}
                                    onChange={e => setNewClass({ ...newClass, year_level: e.target.value })}
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
                                    ADD_CLASS
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row g-3">
                {classes.length === 0 ? (
                    <div className="col-12">
                        <p className="text-center text-muted">NO_CLASS_GROUPS_FOUND</p>
                    </div>
                ) : (
                    classes.map(c => (
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
                                        DELETE_CLASS
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

export default StudentClasses;
