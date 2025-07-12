import React, { useState, useRef, useEffect } from "react";
import { useAuthForm } from "../../hooks/UI/useAuthForm";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { useNavigate } from "react-router-dom";

const UserMenu: React.FC = () => {
    const navigate = useNavigate();
    const { profile, logout } = useAuthContext();
    const { } = useAuthForm();
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
        <div style={{ position: "relative" }} ref={menuRef}>
            {/* Avatar Circle */}
            <div
                onClick={toggleMenu}
                title="User Menu"
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(59, 130, 246, 0.8)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    userSelect: "none",
                    transition: "all 0.2s ease",
                    border: "2px solid transparent",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
            >
                {profile.firstName &&
                    profile.lastName &&
                    profile.firstName.charAt(0) + profile.lastName.charAt(0)}
            </div>

            {/* Dropdown Menu */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "48px",
                        backgroundColor: "white",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.23)",
                        borderRadius: "12px",
                        padding: "0",
                        minWidth: "220px",
                        zIndex: 1000,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        opacity: 0,
                        transform: "translateY(-10px)",
                        animation: "slideIn 0.2s ease-out forwards",
                    }}
                >
                    {/* User Info Section */}
                    <div
                        style={{
                            padding: "20px",
                            background: "rgb(255, 255, 255)",
                            borderBottom: "1px solid #e5e7eb",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: "600",
                                fontSize: "16px",
                                color: "#1f2937",
                                marginBottom: "4px",
                            }}
                        >
                            {profile.firstName} {profile.lastName}
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                marginBottom: "8px",
                            }}
                        >
                            {profile.role}
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div style={{ padding: "12px" }}>
                        <button
                            onClick={() => {
                                navigate("/dashboard");
                            }}
                            style={{
                                width: "100%",
                                background: "none",
                                border: "none",
                                color: "rgba(0, 0, 0, 1)",
                                fontWeight: "500",
                                cursor: "pointer",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(102, 102, 102, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                setOpen(false);
                            }}
                            style={{
                                width: "100%",
                                background: "none",
                                border: "none",
                                color: "#dc2626",
                                fontWeight: "500",
                                cursor: "pointer",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#fef2f2";
                                e.currentTarget.style.color = "#b91c1c";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#dc2626";
                            }}
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

            {/* Add keyframe animation to head */}
            {typeof document !== "undefined" &&
                (() => {
                    const styleId = "user-menu-animation";
                    if (!document.getElementById(styleId)) {
                        const style = document.createElement("style");
                        style.id = styleId;
                        style.textContent = `
                        @keyframes slideIn {
                            from {
                                opacity: 0;
                                transform: translateY(-10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `;
                        document.head.appendChild(style);
                    }
                    return null;
                })()}
        </div>
    );
};

export default UserMenu;
