import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe } from '../services/api';

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);

        if (token) {
            getMe().then(res => {
                if (res.data.is_superuser) setIsAdmin(true);
            }).catch(() => setIsAdmin(false));
        } else {
            setIsAdmin(false);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    if (!isLoggedIn) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top mb-4">
            <div className="container-fluid">
                <Link to="/dashboard" className="navbar-brand glitch-text">
                    UCA_OS
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link
                                to="/dashboard"
                                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                            >
                                DASHBOARD
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/meals"
                                className={`nav-link ${location.pathname === '/meals' ? 'active' : ''}`}
                            >
                                MEALS
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/gym"
                                className={`nav-link ${location.pathname === '/gym' ? 'active' : ''}`}
                            >
                                GYM
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/classes"
                                className={`nav-link ${location.pathname === '/classes' ? 'active' : ''}`}
                            >
                                CLASSES
                            </Link>
                        </li>

                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to="/student-classes"
                                        className={`nav-link text-primary ${location.pathname === '/student-classes' ? 'active' : ''}`}
                                    >
                                        MANAGE_CLASSES
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/courses"
                                        className={`nav-link text-primary ${location.pathname === '/courses' ? 'active' : ''}`}
                                    >
                                        MANAGE_COURSES
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/users"
                                        className={`nav-link text-primary ${location.pathname === '/users' ? 'active' : ''}`}
                                    >
                                        MANAGE_USERS
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link
                                to="/profile"
                                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                            >
                                PROFILE
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger btn-sm ms-2"
                            >
                                LOGOUT
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
