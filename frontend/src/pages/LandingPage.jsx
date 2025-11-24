import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="hud-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 className="glitch-text" style={{ fontSize: '4rem', marginBottom: '1rem' }}>University of Central Asia OS</h1>
            <p style={{ fontSize: '1.5rem', color: '#8da2b5', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                OPTIMIZE YOUR ACADEMIC LIFE WITH PRECISION SCHEDULE MANAGEMENT.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '5rem' }}>
                <Link to="/login">
                    <button className="hud-btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: '#0f4c81', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        LOGIN
                    </button>
                </Link>
                <Link to="/register">
                    <button className="hud-btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: 'transparent', color: '#ff4d00', border: '2px solid #ff4d00', cursor: 'pointer', fontWeight: 'bold' }}>
                        REGISTER
                    </button>
                </Link>
            </div>

            <div className="grid-layout" style={{ textAlign: 'left' }}>
                <div className="hud-card">
                    <h3>SYSTEM_PURPOSE</h3>
                    <p>This platform allows students to manage their daily schedules efficiently. It integrates meal plans, gym access times, and academic classes into a single, unified interface.</p>
                </div>
                <div className="hud-card">
                    <h3>PERSONALIZED_DATA</h3>
                    <p>Your schedule is tailored to your specific Class and Gender. You only see what is relevant to you, ensuring maximum clarity and focus.</p>
                </div>
                <div className="hud-card">
                    <h3>SECURE_ACCESS</h3>
                    <p>All data is protected by advanced authentication protocols. Your personal schedule remains private and accessible only to you.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
