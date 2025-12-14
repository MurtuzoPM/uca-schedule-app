import { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * Custom hook for Anime.js animations
 * @param {Object} animationConfig - Anime.js configuration object
 * @param {Array} dependencies - React dependencies array
 */
export const useAnime = (animationConfig, dependencies = []) => {
    const elementRef = useRef(null);

    useEffect(() => {
        if (elementRef.current && animationConfig) {
            const config = {
                targets: elementRef.current,
                ...animationConfig
            };
            anime(config);
        }
    }, dependencies);

    return elementRef;
};

/**
 * Stagger animation for multiple elements
 * @param {string} selector - CSS selector for elements
 * @param {Object} animationConfig - Animation configuration
 */
export const staggerAnimation = (selector, animationConfig) => {
    anime({
        targets: selector,
        ...animationConfig,
        delay: anime.stagger(100) // 100ms delay between each element
    });
};

/**
 * Fade in animation
 */
export const fadeIn = {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'easeOutExpo'
};

/**
 * Slide in from left
 */
export const slideInLeft = {
    opacity: [0, 1],
    translateX: [-50, 0],
    duration: 600,
    easing: 'easeOutExpo'
};

/**
 * Slide in from right
 */
export const slideInRight = {
    opacity: [0, 1],
    translateX: [50, 0],
    duration: 600,
    easing: 'easeOutExpo'
};

/**
 * Scale up animation
 */
export const scaleUp = {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutBack'
};

/**
 * Glitch text animation
 */
export const glitchText = {
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 1000,
    easing: 'easeOutExpo',
    textShadow: [
        { value: '0 0 0px rgba(15, 76, 129, 0)' },
        { value: '2px 2px 0px rgba(15, 76, 129, 1)' }
    ]
};

/**
 * Card hover animation
 */
export const cardHover = {
    scale: 1.05,
    translateY: -5,
    boxShadow: '0 10px 30px rgba(255, 77, 0, 0.3)',
    duration: 300,
    easing: 'easeOutQuad'
};

/**
 * Card hover out animation
 */
export const cardHoverOut = {
    scale: 1,
    translateY: 0,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    duration: 300,
    easing: 'easeOutQuad'
};

