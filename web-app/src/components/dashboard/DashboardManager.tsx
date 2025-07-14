import React from "react";
import { UserRegistration } from "./UserRegistration";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import UserMenu from "../toolbar/UserMenu";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import styles from "./DashboardManager.module.css";

const DashboardManager: React.FC = () => {
  const { profile } = useAuthContext();
  const { toggleEditor } = useEditorContext();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {/* Left: Buttons */}
        <div className={styles.leftButtons}>
          {profile?.role === "MANAGER" && (
            <>
              <button
                className={styles.button}
                onClick={() => {
                  navigate("/editor");
                  toggleEditor("layout");
                }}
              >
                Layout Editor
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  navigate("/editor");
                  toggleEditor("inventory");
                }}
              >
                Inventory Editor
              </button>
            </>
          )}
           {profile?.role === "CASHIER" && (
            <>
              <button
                className={styles.button}
                onClick={() => {
                  navigate("/counter");
                }}
              >
                Cashier Counter
              </button>
            </>
          )}
        </div>

        {/* Center: Title */}
        <div className={styles.centerTitle}>
          <h3 className={styles.titleText}>{profile?.role} Dashboard</h3>
        </div>

        {/* Right: UserMenu */}
        <div className={styles.rightMenu}>
          <UserMenu />
        </div>
      </div>

      {/* Scrollable Body */}
      <div className={styles.scrollableArea}>
        <div className={styles.gridLayout}>
          <UserProfile />
          {(profile?.role === "ADMIN" || profile?.role === "MANAGER") && (
            <UserRegistration />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardManager;
