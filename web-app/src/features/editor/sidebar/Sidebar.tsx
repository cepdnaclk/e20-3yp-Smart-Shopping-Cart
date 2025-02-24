import React from "react";
import { useEdgeContext } from "../../../hooks/useEdgeContext";
import { useFixtureContext } from "../../../hooks/useFixtureContext";
import { useNodeContext } from "../../../hooks/useNodeContext";

interface SidebarProps {
  position: { x: number; y: number };
  name: string;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ position, name, onClose }) => {
  const { selectedNode, deleteNode } = useNodeContext();
  const { selectedEdge, handleAddNodeToEdge } = useEdgeContext();
  const {
    selectedFixtureId,
    setFixtures,
    handleFixtureNameChange,
    handleFixturePositionChange,
    deleteFixture,
  } = useFixtureContext();

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
        onChange={(e) => handleFixtureNameChange(e.target.value)}
        style={{ width: "100%" }}
      />
      <br />
      <label>X Position:</label>
      <input
        type="number"
        value={position.x}
        onChange={(e) =>
          handleFixturePositionChange("x", parseFloat(e.target.value))
        }
      />
      <br />
      <label>Y Position:</label>
      <input
        type="number"
        value={position.y}
        onChange={(e) =>
          handleFixturePositionChange("y", parseFloat(e.target.value))
        }
      />
      <br />
      <button onClick={deleteFixture} disabled={selectedFixtureId === null}>
        Delete Shape
      </button>
      <br />
      <button
        onClick={() => {
          if (selectedEdge !== null) {
            handleAddNodeToEdge(selectedEdge);
          }
        }}
        disabled={selectedEdge === null}
      >
        Add Node to Edge
      </button>
      <button
        onClick={() => {
          if (selectedNode !== null && selectedFixtureId != null) {
            deleteNode(selectedFixtureId, setFixtures);
          }
        }}
        disabled={selectedNode === null || selectedFixtureId === null}
      >
        Delete Node
      </button>
    </div>
  );
};

export default Sidebar;
