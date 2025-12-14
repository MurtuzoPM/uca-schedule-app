import { useEffect, useMemo, useState } from 'react';
import { downloadMyTimetableIcs, getClasses, getMyTimetable, updateMyTimetable } from '../services/api';
import { useToast } from '../context/ToastContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const toMinutes = (hhmm) => {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

const formatTime = (t) => (t ? String(t).slice(0, 5) : '');

const Timetable = () => {
    const [allEntries, setAllEntries] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        const load = async () => {
            try {
                const [classesRes, ttRes] = await Promise.all([getClasses(), getMyTimetable()]);
                setAllEntries(classesRes.data || []);

                const entries = ttRes.data?.entries || [];
                const ids = new Set(entries.map((e) => e.id));
                setSelectedIds(ids);
                setConflicts(ttRes.data?.conflicts || []);
            } catch (e) {
                showToast('Failed to load timetable data', 'error');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [showToast]);

    const selectedEntries = useMemo(() => {
        const ids = selectedIds;
        return allEntries.filter((e) => ids.has(e.id));
    }, [allEntries, selectedIds]);

    const weekly = useMemo(() => {
        const grouped = {};
        for (const day of DAYS) grouped[day] = [];

        for (const e of selectedEntries) {
            if (!grouped[e.day]) grouped[e.day] = [];
            grouped[e.day].push(e);
        }
        for (const day of Object.keys(grouped)) {
            grouped[day].sort((a, b) => toMinutes(formatTime(a.start_time)) - toMinutes(formatTime(b.start_time)));
        }
        return grouped;
    }, [selectedEntries]);

    const toggleSelected = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const save = async () => {
        setSaving(true);
        try {
            const ids = Array.from(selectedIds);
            const res = await updateMyTimetable(ids);
            setConflicts(res.data?.conflicts || []);
            showToast('Timetable saved', 'success');
        } catch (e) {
            showToast('Failed to save timetable', 'error');
        } finally {
            setSaving(false);
        }
    };

    const exportIcs = async () => {
        try {
            const res = await downloadMyTimetableIcs();
            const blob = new Blob([res.data], { type: 'text/calendar' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'uca_timetable.ics';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            showToast('Failed to export .ics', 'error');
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
                <h1 className="glitch-text mb-0">MY_TIMETABLE</h1>
                <div className="d-flex gap-2">
                    <button onClick={exportIcs} className="btn btn-outline-light" type="button">
                        EXPORT_ICS
                    </button>
                    <button onClick={save} className="btn btn-primary" type="button" disabled={saving}>
                        {saving ? 'SAVING...' : 'SAVE_TIMETABLE'}
                    </button>
                </div>
            </div>

            {conflicts.length > 0 && (
                <div className="alert alert-danger">
                    <strong>CONFLICTS_DETECTED</strong>
                    <ul className="mb-0">
                        {conflicts.map((c, idx) => (
                            <li key={idx}>{c.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="row g-3">
                <div className="col-12 col-lg-5">
                    <div className="card">
                        <div className="card-header">
                            <strong>SELECT_CLASSES</strong>
                        </div>
                        <div className="card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {allEntries.length === 0 ? (
                                <p className="text-muted mb-0">NO_SCHEDULE_DATA_FOUND</p>
                            ) : (
                                <div className="d-grid gap-2">
                                    {allEntries.map((e) => (
                                        <label key={e.id} className="form-check" style={{ cursor: 'pointer' }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={selectedIds.has(e.id)}
                                                onChange={() => toggleSelected(e.id)}
                                            />
                                            <span className="form-check-label">
                                                <span style={{ fontWeight: 'bold' }}>{e.course_name}</span>
                                                {' — '}
                                                {e.day} {formatTime(e.start_time)}-{formatTime(e.end_time)}
                                                {' @ '}
                                                {e.location}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="card">
                        <div className="card-header">
                            <strong>WEEKLY_VIEW</strong>
                        </div>
                        <div className="card-body">
                            {selectedEntries.length === 0 ? (
                                <p className="text-muted mb-0">NO_SELECTIONS_YET</p>
                            ) : (
                                DAYS.map((day) => (
                                    <div key={day} className="mb-4">
                                        <h5 className="text-primary border-bottom border-primary pb-2 mb-3">{day.toUpperCase()}</h5>
                                        {weekly[day]?.length ? (
                                            <div className="row g-3">
                                                {weekly[day].map((e) => (
                                                    <div key={e.id} className="col-12 col-md-6">
                                                        <div className="card h-100">
                                                            <div className="card-body">
                                                                <h6 className="card-title text-primary">{e.course_name}</h6>
                                                                <div className="text-muted">
                                                                    TIME: <span className="text-white">{formatTime(e.start_time)} - {formatTime(e.end_time)}</span>
                                                                </div>
                                                                <div className="text-muted">
                                                                    LOC: <span className="text-white">{e.location}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">NO_ENTRIES</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timetable;
