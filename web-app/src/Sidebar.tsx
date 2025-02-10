import React from "react";

interface SidebarProps {
  position: { x: number; y: number };
  name: string;
  scaleX: number;
  scaleY: number;
  rotation: number;
  onPositionChange: (axis: "x" | "y", value: number) => void;
  onNameChange: (name: string) => void;
  onDelete: () => void;
  isDeleteDisabled: boolean;
  onClose: () => void;
  onScaleXChange: (scaleX: number) => void;
  onScaleYChange: (scaleY: number) => void;
  onRotationChange: (rotation: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  position,
  name,
  scaleX,
  scaleY,
  rotation,
  onPositionChange,
  onNameChange,
  onDelete,
  isDeleteDisabled,
  onClose,
  onScaleXChange,
  onScaleYChange,
  onRotationChange,
}) => {
  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#666d",
        padding: "10px",
        position: "absolute",
        top: "0",
        left: "0",
        bottom: "0",
        zIndex: 10,
      }}
    >
      <button onClick={onClose} style={{ float: "right" }}>
        X
      </button>
      <h3>Selected Item</h3>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        style={{ width: "100%" }}
      />
      <br />
      <label>X Position:</label>
      <input
        type="number"
        value={position.x}
        onChange={(e) => onPositionChange("x", parseFloat(e.target.value))}
      />
      <br />
      <label>Y Position:</label>
      <input
        type="number"
        value={position.y}
        onChange={(e) => onPositionChange("y", parseFloat(e.target.value))}
      />
      <br />
      <label>Scale X:</label>
      <input
        type="number"
        value={scaleX}
        onChange={(e) => onScaleXChange(parseFloat(e.target.value))}
        step="0.1"
        min="0.1"
      />
      <br />
      <label>Scale Y:</label>
      <input
        type="number"
        value={scaleY}
        onChange={(e) => onScaleYChange(parseFloat(e.target.value))}
        step="0.1"
        min="0.1"
      />
      <br />
      <label>Rotation:</label>
      <input
        type="number"
        value={rotation}
        onChange={(e) => onRotationChange(parseFloat(e.target.value))}
        step="1"
        min="0"
        max="360"
      />
      <br />
      <button onClick={onDelete} disabled={isDeleteDisabled}>
        Delete Shape
      </button>
    </div>
  );
};

export default Sidebar;
