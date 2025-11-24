import { useEffect, useState } from 'react';
import { getMe } from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getMe().then(res => setUser(res.data)).catch(err => console.error(err));
    }, []);

    if (!user) return <div className="hud-container"><h1 className="glitch-text">LOADING_SYSTEM...</h1></div>;

    return (
        <div className="hud-container">
            <h1 className="glitch-text">WELCOME, {user.username.toUpperCase()}</h1>

            <div className="hud-card" style={{ marginBottom: '2rem', borderLeft: '4px solid #ff4d00' }}>
                <h3>USER_PROFILE</h3>
                <p className="label">CLASS: <span className="value">{user.student_class || 'N/A'}</span></p>
                <p className="label">GENDER: <span className="value">{user.gender || 'N/A'}</span></p>
                <p className="label">ACCESS_LEVEL: <span className="value">{user.is_superuser ? 'ADMINISTRATOR' : 'STUDENT'}</span></p>
            </div>

            <div className="grid-layout">
                <div className="hud-card">
                    <h3>MEALS</h3>
                    <p>View your daily meal schedule tailored to your class.</p>
                </div>
                <div className="hud-card">
                    <h3>GYM</h3>
                    <p>Check gym opening times specifically for your gender.</p>
                </div>
                <div className="hud-card">
                    <h3>CLASSES</h3>
                    <p>See your academic timetable and lecture locations.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
