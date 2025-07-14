import React from "react";
import styles from "./NotificationBanner.module.css";

interface NotificationBannerProps {
  message: string;
  type: "error" | "success";
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type }) => {
  const bannerClass = type === "error" ? styles.error : styles.success;

  return <div className={`${styles.banner} ${bannerClass}`}>{message}</div>;
};

export default NotificationBanner;
