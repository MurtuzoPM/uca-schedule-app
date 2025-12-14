import { useRef, useEffect } from 'react';
import anime from 'animejs';

const AnimatedCard = ({ children, className = '', delay = 0, ...props }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (cardRef.current) {
            anime({
                targets: cardRef.current,
                opacity: [0, 1],
                translateY: [30, 0],
                scale: [0.9, 1],
                duration: 600,
                delay: delay,
                easing: 'easeOutBack'
            });
        }
    }, []);

    const handleMouseEnter = () => {
        if (cardRef.current) {
            anime({
                targets: cardRef.current,
                scale: 1.05,
                translateY: -8,
                boxShadow: '0 10px 30px rgba(255, 77, 0, 0.3)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            anime({
                targets: cardRef.current,
                scale: 1,
                translateY: 0,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    };

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ opacity: 0, ...props.style }}
            {...props}
        >
            {children}
        </div>
    );
};

export default AnimatedCard;

