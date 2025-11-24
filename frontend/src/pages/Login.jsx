import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(username, password);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            showToast('Login failed. Check your credentials.', 'error');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center" style={{ marginTop: '5rem' }}>
                <div className="col-12 col-md-6 col-lg-4">
                    <h1 className="glitch-text text-center mb-4">ACCESS_CONTROL</h1>

                    <div className="card">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">USERNAME</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mb-3">
                                    INITIATE_SESSION
                                </button>

                                <p className="text-center mb-0">
                                    <Link to="/register" className="text-danger text-decoration-none">
                                        CREATE_NEW_ID
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

export default Login;
