import React, { useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import Toolbar from "../src/features/editor/toolbar/Toolbar";
import Sidebar from "../src/features/editor/sidebar/Sidebar";
import NodeComp from "../src/features/editor/canvas/NodeComp";
import useFixture from "../src/hooks/useFixture";
import useSidebar from "../src/hooks/useSidebar";
import Fixture from "../src/types/Fixture";
import useNode from "../src/hooks/useNode";
import FixtureComp from "../src/features/editor/canvas/FixtureComp";

const LayoutEditor: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight - 50 : 600,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight - 50 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    items,
    setItems,
    selectedId,
    name,
    position,
    addFixture,
    handleFixtureNameChange,
    handlePositionChange,
    handleDragMoveFixture,
    handleSelectFixture,
    handleDeleteFixture,
  } = useFixture();

  const { isSidebarVisible, toggleSidebar, closeSidebar } = useSidebar();

  const {handleNodeDragMove} = useNode();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Toolbar
        onAddFixture={addFixture}
        onDelete={handleDeleteFixture}
        isDeleteDisabled={selectedId === null}
        onToggleSidebar={toggleSidebar}
      />
      {isSidebarVisible && (
        <Sidebar
          position={position}
          name={name}
          onPositionChange={handlePositionChange}
          onNameChange={handleFixtureNameChange}
          onDelete={handleDeleteFixture}
          isDeleteDisabled={selectedId === null}
          onClose={closeSidebar}
        />
      )}

      <div style={{ marginTop: "50px", flex: 1 }}>
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            {items.map((item: Fixture) => (
              <React.Fragment key={item.id}>
                {/* Polygon */}
                <Line
                  id={item.id.toString()}
                  x={item.x}
                  y={item.y}
                  points={item.points}
                  fill={item.fill}
                  closed
                  draggable
                  stroke={selectedId === item.id ? "red" : "black"} // Outline when selected
                  strokeWidth={selectedId === item.id ? 3 : 1}
                  onClick={() => handleSelectFixture(item.id)}
                  onDblClick={() => handleSelectFixture(item.id)}
                  onDblTap={() => handleSelectFixture(item.id)}
                  onTouchStart={() => handleSelectFixture(item.id)}
                  onDragStart={() => handleSelectFixture(item.id)}
                  onDragMove={(e) => handleDragMoveFixture(e, item.id)}
                />

                {/* Nodes (Only visible if selected) */}
                {selectedId === item.id &&
                  item.points.map((_, index) =>
                    index % 2 === 0 ? (
                      <NodeComp
                        key={`${item.id}-node-${index / 2}`}
                        x={item.x + item.points[index]} // Adjust for fixture's position
                        y={item.y + item.points[index + 1]}
                        mode="edit"
                        onDragMove={(e) => handleNodeDragMove(e, item.id, index, setItems)}
                      />
                    ) : null
                  )}
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LayoutEditor;
