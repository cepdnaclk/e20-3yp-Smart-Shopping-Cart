import React, { useEffect, useState } from "react";
import { useEdgeContext } from "../../hooks/useEdgeContext";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { useNodeContext } from "../../hooks/useNodeContext";
import { useSidebarContext } from "../../hooks/useSidebarContext";

// Import images from the assets folder
import NescafeImg from "../../../assets/Nescafe_Ice_Cold_Coffee_180ml.jpg";
import MiloImg from "../../../assets/Milo_Food_Drink_Chocolate_Tetra_180ml.jpg";
import KistJamImg from "../../../assets/Kist_Jam_Mixed_Fruit_510g.jpg";
import KrestSausageImg from "../../../assets/Krest_Chicken_Sausages_Bockwurst_400g.jpg";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { selectedNode, deleteNode } = useNodeContext();
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
    deleteFixture,
    saveFixturesToLocal,
  } = useFixtureContext();
  const { closeSidebar, toggleInventoryEditor, isInventoryOpen } =
    useSidebarContext();

  const inventoryItems = [
    { name: "Nescafe Ice Cold Coffee 180ml", image: NescafeImg },
    { name: "Milo Food Drink Chocolate Tetra 180ml", image: MiloImg },
    { name: "Kist Jam Mixed Fruit 510g", image: KistJamImg },
    { name: "Krest Chicken Sausages Bockwurst 400g", image: KrestSausageImg },
  ];

  // Inside your component
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    if (selectedFixtureId && fixtures[selectedFixtureId]?.color) {
      setColor(fixtures[selectedFixtureId].color);
    } else {
      setColor("#ffffff");
    }
  }, [selectedFixtureId, fixtures]);

  const handleDragStart = (event: React.DragEvent, item: string) => {
    event.dataTransfer.setData("text/plain", item); // Store dragged item
  };

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
          {isInventoryOpen ? "Inventory" : "Properties"}
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

      {/* Inventory Mode */}
      {isInventoryOpen ? (
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "12px",
            }}
          >
            Drag items to add to your layout
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            {inventoryItems.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, item.name)}
                style={{
                  padding: "10px",
                  backgroundColor: "white",
                  color: "#333",
                  borderRadius: "8px",
                  cursor: "grab",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #eee",
                  fontSize: "14px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "contain",
                    marginBottom: "6px",
                  }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
              <div style={{ flex: 1, minWidth: "0" }}>
                {" "}
                {/* Prevents overflow */}
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
                  value={fixturePosition.x}
                  onChange={(e) =>
                    handleFixturePositionChange("x", parseFloat(e.target.value))
                  }
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
                  value={fixturePosition.y}
                  onChange={(e) =>
                    handleFixturePositionChange("y", parseFloat(e.target.value))
                  }
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

          {/* Color Picker */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", fontSize: "13px", fontWeight: 500 }}
            >
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

          <div style={{ marginBottom: "8px" }}>
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

            <button
              onClick={deleteFixture}
              disabled={selectedFixtureId === null}
              style={{
                width: "100%",
                padding: "10px 0",
                backgroundColor:
                  selectedFixtureId === null ? "#e0e0e0" : "#e74c3c",
                color: selectedFixtureId === null ? "#999" : "white",
                border: "none",
                borderRadius: "6px",
                cursor: selectedFixtureId === null ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: 500,
                transition: "background-color 0.2s",
              }}
            >
              Delete Shape
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "auto",
          paddingTop: "16px",
          borderTop: "1px solid #eee",
        }}
      >
        <button
          onClick={toggleInventoryEditor}
          disabled={selectedFixtureId === null && !isInventoryOpen}
          style={{
            width: "100%",
            padding: "10px 0",
            backgroundColor:
              selectedFixtureId === null && !isInventoryOpen
                ? "#e0e0e0"
                : "#f0f0f0",
            color:
              selectedFixtureId === null && !isInventoryOpen ? "#999" : "#333",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor:
              selectedFixtureId === null && !isInventoryOpen
                ? "not-allowed"
                : "pointer",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "10px",
            transition: "background-color 0.2s",
          }}
        >
          {isInventoryOpen ? "Edit Properties" : "Open Inventory"}
        </button>

        <button
          onClick={saveFixturesToLocal}
          style={{
            width: "100%",
            padding: "12px 0",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            transition: "background-color 0.2s",
            boxShadow: "0 2px 4px rgba(46,204,113,0.2)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#27ae60")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2ecc71")
          }
        >
          Save Layout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
