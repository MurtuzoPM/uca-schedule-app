import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, getStudentClasses } from '../services/api';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        gender: 'Male',
        student_class: ''
    });
    const [availableClasses, setAvailableClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any existing tokens to ensure fresh registration
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        getStudentClasses().then(res => {
            setAvailableClasses(res.data);
            setFilteredClasses(res.data);
        }).catch(err => {
            console.error(err);
            showToast('Failed to load classes. Please refresh the page.', 'error');
        });
    }, []);

    useEffect(() => {
        if (selectedYear) {
            setFilteredClasses(availableClasses.filter(c => c.year_level === selectedYear));
        } else {
            setFilteredClasses(availableClasses);
        }
        // Reset selected class if it doesn't match the new filter
        setFormData(prev => ({ ...prev, student_class: '' }));
    }, [selectedYear, availableClasses]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            showToast('Registration successful! Please login.', 'success');
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || 'Registration failed';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="col-12 col-md-6 col-lg-4">
                    <h2 className="glitch-text text-center mb-4">REGISTRATION</h2>

                    <div className="card">
                        <div className="card-body p-4">
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label">USERNAME</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">EMAIL</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">PASSWORD</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">GENDER</label>
                                    <select
                                        name="gender"
                                        className="form-select"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">FILTER BY YEAR (OPTIONAL)</label>
                                    <select
                                        className="form-select"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="">All Years</option>
                                        <option value="Preparatory">Preparatory Year</option>
                                        <option value="Freshman">Freshman Year</option>
                                        <option value="Sophomore">Sophomore Year</option>
                                        <option value="Junior">Junior Year</option>
                                        <option value="Senior">Senior Year</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">SELECT CLASS</label>
                                    <select
                                        name="student_class"
                                        className="form-select"
                                        value={formData.student_class}
                                        onChange={handleChange}
                                        required
                                        disabled={availableClasses.length === 0}
                                    >
                                        <option value="">Select Class</option>
                                        {filteredClasses.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.year_level})
                                            </option>
                                        ))}
                                    </select>
                                    {availableClasses.length === 0 && (
                                        <small className="text-danger">Loading classes...</small>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'REGISTERING...' : 'REGISTER_ID'}
                                </button>

                                <p className="text-center mb-0">
                                    <Link to="/login" className="text-danger text-decoration-none">
                                        RETURN_TO_LOGIN
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
