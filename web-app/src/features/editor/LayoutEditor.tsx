import React, { useState, useEffect, useContext } from "react";
import { Stage, Layer } from "react-konva";
import Toolbar from "./toolbar/Toolbar";
import Sidebar from "./sidebar/Sidebar";
import FixtureComp from "./canvas/FixtureComp";
import { FixtureContext } from "../../context/FixtureContext";
import useSidebar from "../../hooks/useSidebar";

const LayoutEditor: React.FC = () => {
  const fixtureContext = useContext(FixtureContext);

  if (!fixtureContext) {
    throw new Error("FixtureContext must be used within a FixtureProvider");
  }

  const { fixtures, fixturePosition, fixtureName, toggleEditMode } =
    fixtureContext;

  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight - 50 : 600,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 50,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { isSidebarVisible, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Toolbar onToggleMode={toggleEditMode} onToggleSidebar={toggleSidebar} />

      {isSidebarVisible && (
        <Sidebar
          position={fixturePosition}
          name={fixtureName}
          onClose={closeSidebar}
        />
      )}

      <div style={{ marginTop: "50px", flex: 1 }}>
        <Stage
          key={Object.keys(fixtures).length}
          width={dimensions.width}
          height={dimensions.height}
        >
          <Layer>
            {Object.values(fixtures).map((item) => (
              <FixtureComp key={item.id} item={item} />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LayoutEditor;
