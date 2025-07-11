import React from "react";
import { UserRegistration } from "./UserRegistration";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import UserMenu from "../toolbar/UserMenu";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "./UserProfile";

/**
 * DashboardManager - Grid-Based Item Organization Interface
 *
 * Full-screen overlay interface for organizing items within fixture edges.
 * Only renders when an edge is selected and item map editor is active.
 *
 * @component
 */

const DashboardManager: React.FC = () => {
  const { profile } = useAuthContext();
  const { toggleEditor } = useEditorContext();
  const navigate = useNavigate();

  const buttonStyles: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "6px",
    color: "#fff",
    backgroundColor: "rgb(3, 160, 222)",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        color: "#333",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          height: "40px",
          background: "white",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          padding: "10px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Left: Buttons */}
        <div style={{ flex: 1, display: "flex", gap: "10px" }}>
          {profile?.role === "MANAGER" && (
            <>
              <button style={buttonStyles} onClick={() => {navigate('/editor'); toggleEditor("layout");}}>Layout Editor</button>
              <button style={buttonStyles} onClick={() => {navigate('/editor'); toggleEditor("inventory");}}>Inventory Editor</button>
            </>
          )}
        </div>

        {/* Center: Title */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1e293b",
            }}
          >
            {profile?.role} Dashboard
          </h3>
        </div>

        {/* Right: UserMenu */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <UserMenu />
        </div>
      </div>

      {/* Scrollable Body */}
      <div
        className="scrollable-area"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "5px",
          paddingBottom: "40px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "32px",
          }}
        >
          <UserProfile />
          {(profile?.role === 'ADMIN' || profile?.role === 'MANAGER') && <UserRegistration />}
        </div>
      </div>
    </div>
  );
};

export default DashboardManager;
