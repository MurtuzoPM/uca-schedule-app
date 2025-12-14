import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotificationCount } from '../services/api';
import anime from 'animejs';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const navRef = useRef(null);
    const linksRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    const unreadCountRef = useRef(0);

    const isAdmin = useMemo(() => !!user?.is_superuser, [user]);

    useEffect(() => {
        if (!navRef.current) return;
        // If a previous logout animation hid the navbar, make sure it becomes visible again
        // when auth state changes (login/logout) without requiring a full refresh.
        navRef.current.style.opacity = 1;
        navRef.current.style.transform = 'translateY(0px)';
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            unreadCountRef.current = 0;
            return;
        }

        getUnreadNotificationCount()
            .then((res) => {
                unreadCountRef.current = Number(res.data || 0);
                // force a repaint by touching the nav style; lightweight state is avoided intentionally
                if (navRef.current) navRef.current.dataset.unread = String(unreadCountRef.current);
            })
            .catch(() => {
                unreadCountRef.current = 0;
            });
    }, [isAuthenticated, location.pathname]);

    useEffect(() => {
        if (!navRef.current) return;

        // Only animate once (initial mount), not on every route change.
        if (hasAnimatedRef.current) {
            navRef.current.style.opacity = 1;
            return;
        }
        hasAnimatedRef.current = true;

        // Slide in navbar
        anime({
            targets: navRef.current,
            translateY: [-100, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // Stagger nav links
        if (linksRef.current) {
            anime({
                targets: linksRef.current.querySelectorAll('.nav-link, .btn'),
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 600,
                delay: anime.stagger(50, { start: 300 }),
                easing: 'easeOutExpo'
            });
        }
    }, []);

    const handleLogout = () => {
        // Animate logout
        if (navRef.current) {
            anime({
                targets: navRef.current,
                translateY: [0, -100],
                opacity: [1, 0],
                duration: 400,
                easing: 'easeInExpo',
                complete: () => {
                    logout();
                    navigate('/');
                }
            });
        } else {
            logout();
            navigate('/');
        }
    };

    return (
        <nav ref={navRef} className="navbar navbar-expand-lg navbar-dark sticky-top mb-4" style={{ opacity: 0 }}>
            <div className="container-fluid">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-brand glitch-text">
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

                <div ref={linksRef} className="collapse navbar-collapse" id="navbarNav">
                    {isAuthenticated ? (
                        <>
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
                                <li className="nav-item">
                                    <Link
                                        to="/timetable"
                                        className={`nav-link ${location.pathname === '/timetable' ? 'active' : ''}`}
                                    >
                                        TIMETABLE
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/notifications"
                                        className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}
                                    >
                                        NOTIFICATIONS
                                        {Number(navRef.current?.dataset?.unread || 0) > 0 ? (
                                            <span className="badge bg-danger ms-2">
                                                {navRef.current?.dataset?.unread}
                                            </span>
                                        ) : null}
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
                        </>
                    ) : (
                        <>
                            <ul className="navbar-nav me-auto"></ul>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link
                                        to="/login"
                                        className={`btn btn-outline-light btn-sm ms-2 ${location.pathname === '/login' ? 'active' : ''}`}
                                    >
                                        LOGIN
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/register"
                                        className={`btn btn-primary btn-sm ms-2 ${location.pathname === '/register' ? 'active' : ''}`}
                                    >
                                        REGISTER
                                    </Link>
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
