import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

const LandingPage = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);
    const cardsRef = useRef(null);

    useEffect(() => {
        // Animate title
        anime({
            targets: titleRef.current,
            opacity: [0, 1],
            translateY: [-50, 0],
            scale: [0.9, 1],
            duration: 1200,
            easing: 'easeOutExpo'
        });

        // Animate subtitle
        anime({
            targets: subtitleRef.current,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 1000,
            delay: 300,
            easing: 'easeOutExpo'
        });

        // Animate buttons
        anime({
            targets: buttonsRef.current?.children,
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.8, 1],
            duration: 800,
            delay: anime.stagger(200, { start: 600 }),
            easing: 'easeOutBack'
        });

        // Animate cards with stagger
        anime({
            targets: cardsRef.current?.children,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.9, 1],
            duration: 1000,
            delay: anime.stagger(200, { start: 1000 }),
            easing: 'easeOutBack'
        });
    }, []);

    return (
        <div className="hud-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 
                ref={titleRef}
                className="glitch-text" 
                style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0 }}
            >
                University of Central Asia OS
            </h1>
            <p 
                ref={subtitleRef}
                style={{ fontSize: '1.5rem', color: '#8da2b5', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto', opacity: 0 }}
            >
                OPTIMIZE YOUR ACADEMIC LIFE WITH PRECISION SCHEDULE MANAGEMENT.
            </p>

            <div 
                ref={buttonsRef}
                style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '5rem' }}
            >
                <Link to="/login">
                    <button 
                        className="hud-btn animated-btn" 
                        style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: '#0f4c81', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', opacity: 0 }}
                    >
                        LOGIN
                    </button>
                </Link>
                <Link to="/register">
                    <button 
                        className="hud-btn animated-btn" 
                        style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: 'transparent', color: '#ff4d00', border: '2px solid #ff4d00', cursor: 'pointer', fontWeight: 'bold', opacity: 0 }}
                    >
                        REGISTER
                    </button>
                </Link>
            </div>

            <div ref={cardsRef} className="grid-layout" style={{ textAlign: 'left' }}>
                <div className="hud-card animated-card">
                    <h3>SYSTEM_PURPOSE</h3>
                    <p>This platform allows students to manage their daily schedules efficiently. It integrates meal plans, gym access times, and academic classes into a single, unified interface.</p>
                </div>
                <div className="hud-card animated-card">
                    <h3>PERSONALIZED_DATA</h3>
                    <p>Your schedule is tailored to your specific Class and Gender. You only see what is relevant to you, ensuring maximum clarity and focus.</p>
                </div>
                <div className="hud-card animated-card">
                    <h3>SECURE_ACCESS</h3>
                    <p>All data is protected by advanced authentication protocols. Your personal schedule remains private and accessible only to you.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
