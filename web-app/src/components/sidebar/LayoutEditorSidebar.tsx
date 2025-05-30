import React, { useEffect, useState } from "react";
import { useEdgeContext } from "../../hooks/useEdgeContext";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { useNodeContext } from "../../hooks/useNodeContext";

/**
 * LayoutEditorSidebar - Properties Panel for Layout Editing
 *
 * Context-sensitive properties panel that adapts based on current selection.
 * Handles fixture properties, node editing, and advanced operations.
 *
 * Features:
 * - Fixture property editing (name, position, color)
 * - Node-specific position controls
 * - Advanced node/edge operations
 * - Context-sensitive input behavior
 *
 * @component
 */

const LayoutEditorSidebar: React.FC = () => {
  const { selectedNode, deleteNode, nodePosition, setNodePosition } = useNodeContext();
  const { selectedEdge, handleAddNodeToEdge } = useEdgeContext();
  const {
    selectedFixtureId,
    fixtures,
    fixtureName,
    fixturePosition,
    setFixtures,
    handleFixtureNameChange,
    handleFixtureColorChange,
    handleFixturePositionChange,
  } = useFixtureContext();

  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    if (selectedFixtureId && fixtures[selectedFixtureId]?.color) {
      setColor(fixtures[selectedFixtureId].color);
    } else {
      setColor("#ffffff");
    }
  }, [selectedFixtureId, fixtures]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Fixture name input field */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#666",
          }}
        >
          Name
        </label>
        <input
          type="text"
          value={fixtureName}
          onChange={(e) => handleFixtureNameChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
          placeholder="Enter name"
        />
      </div>

      {/* Position controls - adapts for fixture or node editing */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#666",
          }}
        >
          Position
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* X coordinate input with dual behavior (fixture/node) */}
          <div style={{ flex: 1, minWidth: "0" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              X
            </label>
            <input
              type="number"
              value={selectedNode != null ? nodePosition.x : fixturePosition.x}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (isNaN(newValue)) return; // Prevent updates with NaN

                if (selectedNode != null && selectedFixtureId != null) {
                  // Update the nodePosition state for sidebar display
                  setNodePosition((prev) => ({ ...prev, x: newValue }));

                  // Update the fixture's points array
                  setFixtures((prevFixtures) => {
                    const selectedFixture = prevFixtures[selectedFixtureId];
                    if (!selectedFixture) return prevFixtures;

                    const relativeX = newValue - selectedFixture.x;

                    return {
                      ...prevFixtures,
                      [selectedFixtureId]: {
                        ...selectedFixture,
                        points: selectedFixture.points.map((p, i) =>
                          i === selectedNode * 2 ? relativeX : p
                        ),
                      },
                    };
                  });
                } else {
                  handleFixturePositionChange("x", newValue);
                }
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                flexShrink: 1, // Prevents expansion
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Y coordinate input with dual behavior (fixture/node) */}
          <div style={{ flex: 1, minWidth: "0" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              Y
            </label>
            <input
              type="number"
              value={selectedNode != null ? nodePosition.y : fixturePosition.y}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                if (isNaN(newValue)) return; // Prevent updates with NaN

                if (selectedNode != null && selectedFixtureId != null) {
                  // Update the nodePosition state for sidebar display
                  setNodePosition((prev) => ({ ...prev, y: newValue }));

                  // Update the fixture's points array
                  setFixtures((prevFixtures) => {
                    const selectedFixture = prevFixtures[selectedFixtureId];
                    if (!selectedFixture) return prevFixtures;

                    const relativeY = newValue - selectedFixture.y;

                    return {
                      ...prevFixtures,
                      [selectedFixtureId]: {
                        ...selectedFixture,
                        points: selectedFixture.points.map((p, i) =>
                          i === selectedNode * 2 + 1 ? relativeY : p
                        ),
                      },
                    };
                  });
                } else {
                  handleFixturePositionChange("y", newValue);
                }
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                flexShrink: 1,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      {/* Color picker for fixture appearance */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 500 }}>
          Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            handleFixtureColorChange(e.target.value);
          }}
          style={{
            width: "100%",
            height: "40px",
            padding: "0",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Advanced operations section */}
      <div style={{ marginBottom: "8px" }}>
        {/* Add node to selected edge button */}
        <button
          onClick={() => {
            if (selectedEdge !== null) {
              handleAddNodeToEdge(selectedEdge);
            }
          }}
          disabled={selectedEdge === null}
          style={{
            width: "100%",
            padding: "10px 0",
            backgroundColor: selectedEdge === null ? "#e0e0e0" : "#4a90e2",
            color: selectedEdge === null ? "#999" : "white",
            border: "none",
            borderRadius: "6px",
            cursor: selectedEdge === null ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "10px",
            transition: "background-color 0.2s",
          }}
        >
          Add Node to Edge
        </button>

        {/* Delete selected node button */}
        <button
          onClick={() => {
            if (selectedNode !== null && selectedFixtureId != null) {
              deleteNode(selectedFixtureId, setFixtures);
            }
          }}
          disabled={selectedNode === null || selectedFixtureId === null}
          style={{
            width: "100%",
            padding: "10px 0",
            backgroundColor:
              selectedNode === null || selectedFixtureId === null
                ? "#e0e0e0"
                : "#e74c3c",
            color:
              selectedNode === null || selectedFixtureId === null
                ? "#999"
                : "white",
            border: "none",
            borderRadius: "6px",
            cursor:
              selectedNode === null || selectedFixtureId === null
                ? "not-allowed"
                : "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "10px",
            transition: "background-color 0.2s",
          }}
        >
          Delete Node
        </button>
      </div>
    </div>
  );
};

export default LayoutEditorSidebar;
