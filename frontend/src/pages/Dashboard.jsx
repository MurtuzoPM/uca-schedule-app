import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMe, getMyTimetable, getNotifications, getUnreadNotificationCount } from '../services/api';
import anime from 'animejs';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [timetable, setTimetable] = useState({ entries: [], conflicts: [] });
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const titleRef = useRef(null);
    const statsRef = useRef(null);
    const panelsRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [meRes, ttRes, notesRes, unreadRes] = await Promise.all([
                    getMe(),
                    getMyTimetable(),
                    getNotifications(),
                    getUnreadNotificationCount(),
                ]);
                setUser(meRes.data);
                setTimetable({
                    entries: ttRes.data?.entries || [],
                    conflicts: ttRes.data?.conflicts || [],
                });
                setNotifications(notesRes.data || []);
                setUnreadCount(Number(unreadRes.data || 0));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!loading) {
            anime({
                targets: titleRef.current,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 900,
                easing: 'easeOutExpo'
            });

            anime({
                targets: statsRef.current?.children,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 700,
                delay: anime.stagger(120, { start: 150 }),
                easing: 'easeOutExpo'
            });

            anime({
                targets: panelsRef.current?.children,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 700,
                delay: anime.stagger(120, { start: 300 }),
                easing: 'easeOutExpo'
            });
        }
    }, [loading]);

    const todayName = useMemo(() => {
        const day = new Date().toLocaleDateString(undefined, { weekday: 'long' });
        return day;
    }, []);

    const todaysEntries = useMemo(() => {
        const entries = (timetable.entries || []).filter((e) => e.day === todayName);
        const toMinutes = (t) => {
            if (!t) return 0;
            const [h, m] = String(t).slice(0, 5).split(':').map(Number);
            return h * 60 + m;
        };
        return entries.sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time));
    }, [timetable.entries, todayName]);

    const notificationPreview = useMemo(() => (notifications || []).slice(0, 5), [notifications]);

    if (loading || !user) {
        return (
            <div className="hud-container">
                <h1 className="glitch-text">LOADING_SYSTEM...</h1>
            </div>
        );
    }

    return (
        <div className="hud-container">
            <h1 ref={titleRef} className="glitch-text" style={{ opacity: 0 }}>
                DASHBOARD: {user.username.toUpperCase()}
            </h1>

            <div className="mb-4">
                <div className="card">
                    <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div>
                            <div className="text-muted">CLASS</div>
                            <div style={{ fontWeight: 'bold' }}>{user.student_class || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-muted">GENDER</div>
                            <div style={{ fontWeight: 'bold' }}>{user.gender || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-muted">ACCESS</div>
                            <div style={{ fontWeight: 'bold' }}>{user.is_superuser ? 'ADMINISTRATOR' : 'STUDENT'}</div>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                            <Link to="/timetable" className="btn btn-primary btn-sm">OPEN_TIMETABLE</Link>
                            <Link to="/classes" className="btn btn-outline-light btn-sm">CLASSES</Link>
                            <Link to="/meals" className="btn btn-outline-light btn-sm">MEALS</Link>
                            <Link to="/gym" className="btn btn-outline-light btn-sm">GYM</Link>
                            <Link to="/notifications" className="btn btn-outline-danger btn-sm">NOTIFICATIONS</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={statsRef} className="row g-3 mb-4">
                <div className="col-12 col-md-4" style={{ opacity: 0 }}>
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="text-muted">TIMETABLE_ENTRIES</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timetable.entries.length}</div>
                            <div className="text-muted">Saved schedule entries</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4" style={{ opacity: 0 }}>
                    <div className={`card h-100 ${timetable.conflicts.length ? 'border-danger' : ''}`}>
                        <div className="card-body">
                            <div className="text-muted">CONFLICTS</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timetable.conflicts.length}</div>
                            <div className="text-muted">Overlaps detected</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4" style={{ opacity: 0 }}>
                    <div className={`card h-100 ${unreadCount ? 'border-danger' : ''}`}>
                        <div className="card-body">
                            <div className="text-muted">UNREAD_NOTIFICATIONS</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{unreadCount}</div>
                            <div className="text-muted">Class change alerts</div>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={panelsRef} className="row g-3">
                <div className="col-12 col-lg-7" style={{ opacity: 0 }}>
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>UPCOMING: {todayName.toUpperCase()}</span>
                            <Link to="/timetable" className="btn btn-outline-light btn-sm">VIEW_ALL</Link>
                        </div>
                        <div className="card-body">
                            {todaysEntries.length === 0 ? (
                                <div className="text-muted">NO_CLASSES_TODAY</div>
                            ) : (
                                <div className="d-grid gap-2">
                                    {todaysEntries.slice(0, 5).map((e) => (
                                        <div key={e.id} className="hud-card" style={{ padding: '1rem' }}>
                                            <div className="d-flex justify-content-between">
                                                <div style={{ fontWeight: 'bold', color: 'var(--bs-primary)' }}>{e.course_name}</div>
                                                <div className="text-muted">{String(e.start_time).slice(0, 5)} - {String(e.end_time).slice(0, 5)}</div>
                                            </div>
                                            <div className="text-muted">LOC: <span className="text-white">{e.location}</span></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {timetable.conflicts.length > 0 && (
                                <div className="alert alert-danger mt-3 mb-0">
                                    <strong>CONFLICTS_DETECTED</strong>
                                    <div className="text-muted" style={{ marginTop: '0.25rem' }}>
                                        Resolve in TIMETABLE to avoid overlaps.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-5" style={{ opacity: 0 }}>
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>NOTIFICATION_FEED</span>
                            <Link to="/notifications" className="btn btn-outline-danger btn-sm">OPEN</Link>
                        </div>
                        <div className="card-body">
                            {notificationPreview.length === 0 ? (
                                <div className="text-muted">NO_NOTIFICATIONS</div>
                            ) : (
                                <div className="d-grid gap-2">
                                    {notificationPreview.map((n) => (
                                        <div key={n.id} className={`hud-card ${n.is_read ? '' : 'border-danger'}`} style={{ padding: '1rem' }}>
                                            <div className="d-flex justify-content-between">
                                                <div style={{ fontWeight: 'bold' }}>{n.type}</div>
                                                {!n.is_read ? <span className="text-danger">UNREAD</span> : <span className="text-muted">READ</span>}
                                            </div>
                                            <div className="text-white" style={{ marginTop: '0.25rem' }}>{n.message}</div>
                                            <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{n.created_at}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
