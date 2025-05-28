import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import FixtureComp from "../../components/layout_editor/canvas/FixtureComp";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { useSidebarContext } from "../../hooks/useSidebarContext";
import Sidebar from "../../components/sidebar/Sidebar";

const LayoutEditor: React.FC = () => {

  const { fixtures } = useFixtureContext();
  const {isSidebarVisible} = useSidebarContext();

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

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {isSidebarVisible && <Sidebar />}
      
      <div style={{ marginTop: "50px", flex: 1 }}>
        <Stage
          key={Object.keys(fixtures).length}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            borderRadius: "10px",
            background: "rgb(246, 252, 254)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Layer>
            {Object.values(fixtures).map((fixture) => (
              <FixtureComp key={fixture.id} fixture={fixture} />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default LayoutEditor;
