// Toolbar.tsx
import React from "react";

interface ToolbarProps {
  onAddShape: (type: "rect" | "circle") => void;
  onDelete: () => void;
  isDeleteDisabled: boolean;
  onToggleSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddShape, onDelete, isDeleteDisabled, onToggleSidebar }) => {
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
      <button onClick={() => onAddShape("rect")}>Add Rectangle</button>
      <button onClick={() => onAddShape("circle")}>Add Circle</button>
      <button onClick={onDelete} disabled={isDeleteDisabled}>
        Delete Selected
      </button>
      <button onClick={onToggleSidebar}>Toggle Sidebar</button>
    </div>
  );
};

export default Toolbar;
