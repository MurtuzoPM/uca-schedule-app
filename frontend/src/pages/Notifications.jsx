import { useEffect, useMemo, useState } from 'react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import { useToast } from '../context/ToastContext';

const Notifications = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState(false);

    const { showToast } = useToast();

    const unreadCount = useMemo(() => items.filter((n) => !n.is_read).length, [items]);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getNotifications();
            setItems(res.data || []);
        } catch (e) {
            showToast('Failed to load notifications', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onMarkRead = async (id) => {
        setWorking(true);
        try {
            await markNotificationRead(id);
            setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        } catch (e) {
            showToast('Failed to mark as read', 'error');
        } finally {
            setWorking(false);
        }
    };

    const onMarkAllRead = async () => {
        setWorking(true);
        try {
            await markAllNotificationsRead();
            setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
            showToast('All notifications marked as read', 'success');
        } catch (e) {
            showToast('Failed to mark all as read', 'error');
        } finally {
            setWorking(false);
        }
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="glitch-text mb-0">NOTIFICATIONS</h1>
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">UNREAD: {unreadCount}</span>
                    <button className="btn btn-outline-light" onClick={load} type="button" disabled={working}>
                        REFRESH
                    </button>
                    <button className="btn btn-primary" onClick={onMarkAllRead} type="button" disabled={working || items.length === 0}>
                        MARK_ALL_READ
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <p className="text-center text-muted">NO_NOTIFICATIONS</p>
            ) : (
                <div className="row g-3">
                    {items.map((n) => (
                        <div key={n.id} className="col-12">
                            <div className={`card ${n.is_read ? '' : 'border-danger'}`}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="text-primary" style={{ fontWeight: 'bold' }}>
                                                {n.type}
                                                {!n.is_read && <span className="text-danger"> •</span>}
                                            </div>
                                            <div className="text-white">{n.message}</div>
                                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                {n.created_at}
                                            </div>
                                        </div>
                                        {!n.is_read && (
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                type="button"
                                                disabled={working}
                                                onClick={() => onMarkRead(n.id)}
                                            >
                                                MARK_READ
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
