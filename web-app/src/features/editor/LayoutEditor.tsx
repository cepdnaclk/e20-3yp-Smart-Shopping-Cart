import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import Toolbar from "./toolbar/Toolbar";
import Sidebar from "./sidebar/Sidebar";
import useFixture from "../../hooks/useFixture";
import useSidebar from "../../hooks/useSidebar";
import FixtureComp from "./canvas/FixtureComp";
import Fixture from "../../types/Fixture";

const LayoutEditor: React.FC = () => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
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
        <Stage key={items.length} width={dimensions.width} height={dimensions.height}>
          <Layer>
            {items.map((item: Fixture) => (
              <FixtureComp
                key={item.id}
                item={item}
                setItems={setItems}
                selectedId={selectedId}
                handleSelectFixture={handleSelectFixture}
                handleDragMoveFixture={handleDragMoveFixture}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LayoutEditor;
