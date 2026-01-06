import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import anime from 'animejs';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login } = useAuth();
    const titleRef = useRef(null);
    const cardRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        // Animate title
        anime({
            targets: titleRef.current,
            opacity: [0, 1],
            translateY: [-30, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // Animate card
        anime({
            targets: cardRef.current,
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 600,
            delay: 200,
            easing: 'easeOutBack'
        });

        // Animate form elements with stagger
        anime({
            targets: formRef.current?.children,
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 600,
            delay: anime.stagger(100, { start: 400 }),
            easing: 'easeOutExpo'
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);

            // Animate success before navigation
            anime({
                targets: cardRef.current,
                scale: [1, 1.05, 1],
                duration: 300,
                easing: 'easeOutQuad',
                complete: () => navigate('/dashboard')
            });
        } catch (err) {
            // Shake animation on error
            anime({
                targets: cardRef.current,
                translateX: [0, -10, 10, -10, 10, 0],
                duration: 500,
                easing: 'easeInOutQuad'
            });
            showToast('Login failed. Check your credentials.', 'error');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center" style={{ marginTop: '5rem' }}>
                <div className="col-12 col-md-6 col-lg-4">
                    <h1 ref={titleRef} className="glitch-text text-center mb-4" style={{ opacity: 0 }}>
                        ACCESS_CONTROL
                    </h1>

                    <div ref={cardRef} className="card" style={{ opacity: 0 }}>
                        <div className="card-body p-4">
                            <form ref={formRef} onSubmit={handleSubmit}>
                                <div className="mb-3" style={{ opacity: 0 }}>
                                    <label className="form-label">EMAIL OR USERNAME</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3" style={{ opacity: 0 }}>
                                    <label className="form-label">PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ opacity: 0 }}>
                                    <button type="submit" className="btn btn-primary w-100 mb-3">
                                        INITIATE_SESSION
                                    </button>

                                    <p className="text-center mb-0">
                                        <Link to="/register" className="text-danger text-decoration-none">
                                            CREATE_NEW_ID
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
