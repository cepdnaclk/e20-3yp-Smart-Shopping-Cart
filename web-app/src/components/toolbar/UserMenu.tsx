import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./UserMenu.module.css";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) return null;

  return (
    <div className={styles.container} ref={menuRef}>
      {/* Avatar Circle */}
      <div onClick={toggleMenu} title="User Menu" className={styles.avatar}>
        {profile.firstName &&
          profile.lastName &&
          profile.firstName.charAt(0) + profile.lastName.charAt(0)}
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className={styles.dropdown}>
          {/* User Info Section */}
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {profile.firstName} {profile.lastName}
            </div>
            <div className={styles.userRole}>{profile.role}</div>
          </div>

          {/* Actions Section */}
          <div className={styles.actions}>
            <button
              onClick={() => navigate("/dashboard")}
              className={styles.button}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className={`${styles.button} ${styles.logoutButton}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
