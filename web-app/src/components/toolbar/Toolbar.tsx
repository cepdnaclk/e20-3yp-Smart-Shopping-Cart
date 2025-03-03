import React, { useState } from "react";
import { useEdgeContext } from "../../hooks/useEdgeContext";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { useSidebarContext } from "../../hooks/useSidebarContext";
import { X, Menu } from "lucide-react"; // Import icons

interface ToolbarProps {
  onToggleMode: (mode: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleMode }) => {
  const { setSelectedEdge } = useEdgeContext();
  const { selectedFixtureId, addFixture, deleteFixture } = useFixtureContext();
  const { toggleSidebar, closeInventoryEditor, isInventoryOpen } = useSidebarContext();
  const [mode, setMode] = useState("Object Mode");

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value;
    setMode(newMode);
    setSelectedEdge(null);
    onToggleMode(newMode);
  };

  return (
    <div
      style={{
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        height: "40px",
        zIndex: 999,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#333",
      }}
    >
      {/* Left Side: Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        style={{
          padding: "10px",
          backgroundColor: "transparent",
          color: "#333",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 500,
          transition: "background-color 0.2s",
        }}
        title="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Center: Dynamic Title */}
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
        {isInventoryOpen ? "Inventory Editor" : "Layout Editor"}
      </h2>

      {/* Right Side: Dynamic Buttons */}
      {isInventoryOpen ? (
        // Inventory Editor Header Actions
        <button
          onClick={closeInventoryEditor}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#e74c3c",
            fontSize: "18px",
          }}
          title="Close Editor"
        >
          <X size={24} />
        </button>
      ) : (
        // Layout Editor Toolbar Actions
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={addFixture}
            style={{
              padding: "10px 16px",
              backgroundColor: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginRight: "10px",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
            }}
            title="Add Fixture"
          >
            Add Fixture
          </button>
          <button
            onClick={deleteFixture}
            disabled={selectedFixtureId === null}
            style={{
              padding: "10px 16px",
              backgroundColor: selectedFixtureId === null ? "#e0e0e0" : "#e74c3c",
              color: selectedFixtureId === null ? "#999" : "white",
              border: "none",
              borderRadius: "6px",
              cursor: selectedFixtureId === null ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 500,
              marginRight: "10px",
              transition: "background-color 0.2s",
            }}
            title="Delete Selected"
          >
            Delete Fixture
          </button>

          {/* Mode Dropdown */}
          <select
            value={mode}
            onChange={handleModeChange}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              fontWeight: 500,
              border: "2px solid #ddd",
              borderRadius: "6px",
              color: "#676767",
              backgroundColor: "#ffffff",
              cursor: "pointer",
            }}
            title="Select Mode"
          >
            <option value="Object Mode">Object Mode</option>
            <option value="Edit Mode">Edit Mode</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
