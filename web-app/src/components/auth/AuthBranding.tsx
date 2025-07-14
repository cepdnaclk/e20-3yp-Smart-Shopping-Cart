import React from 'react';
import Logo from '../../assets/smart_shopping_cart_logo-Photoroom.png';
import styles from './AuthBranding.module.css';

const AuthBranding: React.FC = () => {
    const benefits = [
        "Optimize customer flow and navigation",
        "Reduce average shopping time by 30%",
        "Boost customer satisfaction scores",
        "Increase revenue through strategic placement"
    ];

    return (
        <div className={styles.container}>
            <div className={styles.logoWrapper}>
                <div className={styles.logoBox}>
                    <img
                        src={Logo}
                        alt="Smart Shopping Cart Logo"
                        className={styles.logoImage}
                    />
                </div>
                <span className={styles.logoText}>
                    Smart Shopping Cart
                </span>
            </div>

            <p className={styles.description}>
                Transform your retail experience with intelligent store layout optimization and enhanced customer navigation.
            </p>

            <div className={styles.benefitsBox}>
                <h3 className={styles.benefitsTitle}>Key Benefits</h3>
                <ul className={styles.benefitsList}>
                    {benefits.map((benefit, index) => (
                        <li key={index} className={styles.benefitItem}>
                            <span className={styles.benefitIcon}>✓</span>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AuthBranding;
