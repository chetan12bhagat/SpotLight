import React, { useEffect } from 'react';
import styles from './SplashScreen.module.css';

export const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        // Total animation duration = 4.7s (as defined in CSS)
        const timer = setTimeout(() => {
            if (onFinish) onFinish();
        }, 4700);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={styles.overlay}>
            <img src="/logo.png" alt="Spotlight Logo" className={styles.logo} />
        </div>
    );
};
