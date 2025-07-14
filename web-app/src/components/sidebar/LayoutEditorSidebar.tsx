import React, { useEffect, useState } from "react";
import { useEditorContext } from "../../hooks/context/useEditorContext";
import { useEdgeContext } from "../../hooks/context/useEdgeContext";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useNodeContext } from "../../hooks/context/useNodeContext";
import styles from "./LayoutEditorSidebar.module.css";

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
  const { toggleEditor } = useEditorContext();

  useEffect(() => {
    if (selectedFixtureId && fixtures[selectedFixtureId]?.color) {
      setColor(fixtures[selectedFixtureId].color);
    } else {
      setColor("#ffffff");
    }
  }, [selectedFixtureId, fixtures]);

  const getButtonClass = (enabled: boolean) =>
    `${styles.button} ${enabled ? styles.buttonPrimary : styles.buttonDisabled}`;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        {/* Name */}
        <div className={styles.row}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={fixtureName}
            onChange={(e) => handleFixtureNameChange(e.target.value)}
            className={styles.input}
            placeholder="Enter name"
          />
        </div>

        {/* X Coordinate */}
        <div className={styles.row}>
          <label className={styles.label}>X Coordinate</label>
          <input
            type="number"
            title="x coordinate of the selected object"
            className={styles.input}
            value={selectedNode != null ? nodePosition.x : fixturePosition.x}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (isNaN(newValue)) return;

              if (selectedNode != null && selectedFixtureId != null) {
                setNodePosition((prev) => ({ ...prev, x: newValue }));
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
          />
        </div>

        {/* Y Coordinate */}
        <div className={styles.row}>
          <label className={styles.label}>Y Coordinate</label>
          <input
            type="number"
            title="y coordinate of the selected object"
            className={styles.input}
            value={selectedNode != null ? nodePosition.y : fixturePosition.y}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (isNaN(newValue)) return;

              if (selectedNode != null && selectedFixtureId != null) {
                setNodePosition((prev) => ({ ...prev, y: newValue }));
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
          />
        </div>

        {/* Color Picker */}
        <div className={styles.row}>
          <label className={styles.label}>Color</label>
          <input
            title="color_picker"
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              handleFixtureColorChange(e.target.value);
            }}
            className={styles.colorInput}
          />
        </div>

        {/* Buttons */}
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={() => selectedEdge && handleAddNodeToEdge(selectedEdge)}
            disabled={selectedEdge === null}
            className={getButtonClass(selectedEdge !== null)}
          >
            Add Node to Edge
          </button>

          <button
            onClick={() =>
              selectedNode !== null &&
              selectedFixtureId != null &&
              deleteNode(selectedFixtureId, setFixtures)
            }
            disabled={selectedNode === null || selectedFixtureId === null}
            className={getButtonClass(selectedNode !== null && selectedFixtureId !== null)}
          >
            Delete Node
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          onClick={() => toggleEditor("itemMap")}
          disabled={selectedEdge === null}
          className={getButtonClass(selectedEdge !== null)}
        >
          Open Item Map Editor
        </button>

        <button
          onClick={() => toggleEditor("inventory")}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Open Inventory Editor
        </button>
      </div>
    </div>
  );
};

export default LayoutEditorSidebar;
