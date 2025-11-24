import { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUser, getStudentClasses, getMe } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ email: '', gender: '', student_class: '', is_superuser: false });
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
            fetchData();
        } catch (err) {
            navigate('/');
        }
    };

    const fetchData = async () => {
        try {
            const [usersRes, classesRes] = await Promise.all([getUsers(), getStudentClasses()]);
            setUsers(usersRes.data);
            setClasses(classesRes.data);
            setLoading(false);
        } catch (err) {
            showToast('Error loading data', 'error');
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        showConfirm('PERMANENTLY DELETE USER? This cannot be undone.', async () => {
            try {
                await deleteUser(id);
                setUsers(users.filter(u => u.id !== id));
                if (selectedUser?.id === id) setSelectedUser(null);
                showToast('User deleted successfully', 'success');
            } catch (err) {
                showToast('Error deleting user', 'error');
            }
        });
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            gender: user.gender || 'Male',
            student_class: user.student_class_id || '',
            is_superuser: user.is_superuser
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            const data = { ...formData };
            if (data.is_superuser) {
                data.is_staff = true;
            }
            await updateUser(selectedUser.id, data);
            showToast('User updated successfully', 'success');
            fetchData();
            setSelectedUser(null);
        } catch (err) {
            showToast('Error updating user', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h1 className="glitch-text text-center">AUTHENTICATING_ADMIN...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="glitch-text mb-4">USER_DATABASE_ADMIN</h1>

            <div className="row g-4">
                {/* User List */}
                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">REGISTERED_PERSONNEL</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <table className="table table-dark table-hover mb-0">
                                    <thead className="sticky-top">
                                        <tr>
                                            <th>ID</th>
                                            <th>USERNAME</th>
                                            <th>CLASS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} className={selectedUser?.id === u.id ? 'table-primary' : ''}>
                                                <td>{u.id}</td>
                                                <td>
                                                    {u.username}
                                                    {u.is_superuser && <span className="badge bg-primary ms-2">ADMIN</span>}
                                                </td>
                                                <td>{u.student_class || 'N/A'}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleSelectUser(u)}
                                                        className="btn btn-outline-primary btn-sm me-2"
                                                    >
                                                        EDIT
                                                    </button>
                                                    {!u.is_superuser && (
                                                        <button
                                                            onClick={() => handleDelete(u.id)}
                                                            className="btn btn-outline-danger btn-sm"
                                                        >
                                                            DEL
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Panel */}
                <div className="col-12 col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">{selectedUser ? `EDITING: ${selectedUser.username}` : 'SELECT_USER'}</h5>
                        </div>
                        <div className="card-body">
                            {selectedUser ? (
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label className="form-label">EMAIL</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">GENDER</label>
                                        <select
                                            className="form-select"
                                            value={formData.gender}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ROLE</label>
                                        <select
                                            className="form-select"
                                            value={formData.is_superuser ? 'admin' : 'student'}
                                            onChange={e => setFormData({ ...formData, is_superuser: e.target.value === 'admin' })}
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin (Superuser)</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">CLASS</label>
                                        <select
                                            className="form-select"
                                            value={formData.student_class}
                                            onChange={e => setFormData({ ...formData, student_class: e.target.value })}
                                        >
                                            <option value="">No Class</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.year_level})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 mb-2">
                                        SAVE_CHANGES
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUser(null)}
                                        className="btn btn-outline-secondary w-100"
                                    >
                                        CANCEL
                                    </button>
                                </form>
                            ) : (
                                <p className="text-muted">Select a user from the list to modify their details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
