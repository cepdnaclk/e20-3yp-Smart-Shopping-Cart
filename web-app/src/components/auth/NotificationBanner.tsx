import React from 'react';

interface NotificationBannerProps {
    message: string;
    type: 'error' | 'success';
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type }) => {
    const isError = type === 'error';

    return (
        <div style={{
            backgroundColor: isError ? "#ffebee" : "#e8f5e9",
            color: isError ? "#c62828" : "#2e7d32",
            padding: "15px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            border: isError ? "1px solid #ffcdd2" : "1px solid #c8e6c9",
        }}>
            {message}
        </div>
    );
};

export default NotificationBanner;