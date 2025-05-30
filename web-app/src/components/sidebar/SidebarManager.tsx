import React from "react";
import { useEdgeContext } from "../../hooks/useEdgeContext";
import { useSidebarContext } from "../../hooks/useSidebarContext";
import LayoutEditorSidebar from "./LayoutEditorSidebar";
import ItemMapEditorSidebar from "./ItemMapEditorSidebar";

/**
 * SidebarManager - Context-Sensitive Sidebar Component
 *
 * Manages sidebar visibility and content based on the current editor mode.
 * Provides different interfaces for layout editing (properties) and item management (inventory).
 *
 * @component
 */

const SidebarManager: React.FC = () => {
  const { selectedEdge } = useEdgeContext();

  const { closeSidebar, toggleEditors, isItemMapEditorOpen } =
    useSidebarContext();

  return (
    <div
      style={{
        width: "280px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        padding: "16px",
        position: "absolute",
        top: "0",
        left: "0",
        bottom: "0",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#333",
        borderRadius: "0 8px 8px 0",
        overflow: "hidden",
      }}
    >
      {/* Sidebar header with dynamic title and close button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {isItemMapEditorOpen ? "Inventory" : "Properties"}
        </h2>
        <button
          onClick={closeSidebar}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f0f0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          ✕
        </button>
      </div>

      {/* Dynamic content area - switches between Layout Editor and Item Map Editor sidebar contents */}
      {isItemMapEditorOpen ? <ItemMapEditorSidebar /> : <LayoutEditorSidebar />}

      {/* Footer section with editor mode toggle functionality */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "16px",
          borderTop: "1px solid #eee",
        }}
      >
        <button
          onClick={toggleEditors}
          disabled={selectedEdge === null && !isItemMapEditorOpen}
          style={{
            width: "100%",
            padding: "10px 0",
            backgroundColor:
              selectedEdge === null && !isItemMapEditorOpen
                ? "#e0e0e0"
                : "#f0f0f0",
            color:
              selectedEdge === null && !isItemMapEditorOpen ? "#999" : "#333",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor:
              selectedEdge === null && !isItemMapEditorOpen
                ? "not-allowed"
                : "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "10px",
            transition: "background-color 0.2s",
          }}
        >
          {isItemMapEditorOpen ? "Open Layout Editor" : "Open Item Map Editor"}
        </button>
      </div>
    </div>
  );
};

export default SidebarManager;
