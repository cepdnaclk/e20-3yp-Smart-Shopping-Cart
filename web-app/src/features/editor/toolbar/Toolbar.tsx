// Toolbar.tsx
import React from "react";
import { useEdgeContext } from "../../../hooks/useEdgeContext";
import { useFixtureContext } from "../../../hooks/useFixtureContext";

interface ToolbarProps {
  onToggleSidebar: () => void;
  onToggleMode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar, onToggleMode }) => {
  const { setSelectedEdge } = useEdgeContext();
  const { selectedFixtureId, addFixture, deleteFixture } = useFixtureContext();

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        gap: "10px",
        background: "#ddd",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        zIndex: 1000,
      }}
    >
      <button onClick={() => addFixture()}>Add Fixture</button>
      <button onClick={deleteFixture} disabled={selectedFixtureId === null}>
        Delete Selected
      </button>
      <button onClick={onToggleSidebar}>Toggle Sidebar</button>
      <button
        onClick={() => {
          setSelectedEdge(null);
          onToggleMode();
        }}
      >
        Toggle Mode
      </button>
    </div>
  );
};

export default Toolbar;
