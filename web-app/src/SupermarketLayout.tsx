import React, { useState } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";

interface Shape {
  id: number;
  type: "rect" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  fill: string;
  name: string;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

const SupermarketLayout: React.FC = () => {
  const [items, setItems] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [name, setName] = useState<string>("");
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  // Add new shape
  const addShape = (type: "rect" | "circle") => {
    let newShape: Shape;
  
    if (type === "rect") {
      newShape = {
        id: items.length + 1,
        type,
        x: 50 + items.length * 10,
        y: 50 + items.length * 10,
        width: 100,
        height: 50,
        fill: "lightblue",
        name: `Shape ${items.length + 1}`,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      };
    } else {
      // Initial points (triangle-like shape for testing)
      let points = [0, 0, 60, 200, 200, 0];
  
      // Compute centroid
      let sumX = 0, sumY = 0, pointCount = points.length / 2;
      for (let i = 0; i < points.length; i += 2) {
        sumX += points[i];
        sumY += points[i + 1];
      }
      const centerX = sumX / pointCount;
      const centerY = sumY / pointCount;
  
      // Adjust points relative to centroid
      points = points.map((p, i) => p - (i % 2 === 0 ? centerX : centerY));
  
      newShape = {
        id: items.length + 1,
        type,
        x: 200 + items.length * 10, // Place near the center
        y: 200 + items.length * 10,
        points, // Store adjusted points
        fill: "lightgreen",
        name: `Shape ${items.length + 1}`,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      };
    }
  
    setItems([...items, newShape]);
  };  

  // Handle drag move
  const handleDragMove = (e: any, id: number) => {
    const newX = e.target.x();
    const newY = e.target.y();
    setItems(items.map(item =>
      item.id === id ? { ...item, x: newX, y: newY } : item
    ));

    // Update sidebar position
    if (id === selectedId) {
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle selection
  const handleSelectShape = (id: number) => {
    setSelectedId(id);
    const selectedItem = items.find(item => item.id === id);
    if (selectedItem) {
      setPosition({ x: selectedItem.x, y: selectedItem.y });
      setName(selectedItem.name);  // Set the name in the sidebar
    }
  };

  // Handle name change in sidebar
  const handleNameChange = (newName: string) => {
    if (selectedId !== null) {
      setName(newName);
      setItems(items.map(item =>
        item.id === selectedId ? { ...item, name: newName } : item
      ));
    }
  };

  // Handle position change
  const handlePositionChange = (axis: "x" | "y", value: number) => {
    if (!isNaN(value) && selectedId !== null) {
      setPosition((prevPosition) => {
        const newPosition = { ...prevPosition, [axis]: value };
        setItems(items.map(item =>
          item.id === selectedId ? { ...item, ...newPosition } : item
        ));
        return newPosition;
      });
    }
  };

  // Handle scaling change for X
  const handleScaleXChange = (newScaleX: number) => {
    if (selectedId !== null) {
      setItems(items.map(item =>
        item.id === selectedId
          ? { ...item, scaleX: newScaleX }
          : item
      ));
    }
  };

  // Handle scaling change for Y
  const handleScaleYChange = (newScaleY: number) => {
    if (selectedId !== null) {
      setItems(items.map(item =>
        item.id === selectedId
          ? { ...item, scaleY: newScaleY }
          : item
      ));
    }
  };

  // Handle rotation change
  const handleRotationChange = (newRotation: number) => {
    if (selectedId !== null) {
      setItems(items.map(item =>
        item.id === selectedId
          ? { ...item, rotation: newRotation }
          : item
      ));
    }
  };

  // Handle delete
  const handleDelete = () => {
    setItems(items.filter(item => item.id !== selectedId));
    setSelectedId(null);
    setPosition({ x: 0, y: 0 });
    setName("");  // Reset the name in the sidebar
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <Toolbar
        onAddShape={addShape}
        onDelete={handleDelete}
        isDeleteDisabled={selectedId === null}
        onToggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      {isSidebarVisible && (
        <Sidebar
          position={position}
          name={name}
          scaleX={items.find(item => item.id === selectedId)?.scaleX || 1}
          scaleY={items.find(item => item.id === selectedId)?.scaleY || 1}
          rotation={items.find(item => item.id === selectedId)?.rotation || 0}
          onPositionChange={handlePositionChange}
          onNameChange={handleNameChange}
          onDelete={handleDelete}
          isDeleteDisabled={selectedId === null}
          onClose={closeSidebar}
          onScaleXChange={handleScaleXChange}
          onScaleYChange={handleScaleYChange}
          onRotationChange={handleRotationChange}
        />
      )}

      {/* Main canvas */}
      <div style={{ marginTop: "50px", marginLeft: "0", flex: 1 }}>
        {/* Canvas */}
        <Stage width={window.innerWidth} height={window.innerHeight - 50}>
          <Layer>
            {items.map((item) =>
              item.type === "rect" ? (
                <Rect
                  key={item.id}
                  id={item.id.toString()}
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                  fill={item.fill}
                  draggable
                  scaleX={item.scaleX}  // Apply scaleX
                  scaleY={item.scaleY}  // Apply scaleY
                  rotation={item.rotation}  // Apply rotation
                  onClick={() => handleSelectShape(item.id)}
                  onDragMove={(e) => handleDragMove(e, item.id)}
                  stroke={selectedId === item.id ? "red" : "transparent"}  // Highlight border when selected
                  strokeWidth={5}  // Border width
                  offsetX={item.width! / 2}  // Set rotation center to the middle of the shape
                  offsetY={item.height! / 2}  // Set rotation center to the middle of the shape
                />
              ) : (
                <>
  {/* Render the Polygon */}
  <Line
    key={item.id}
    id={item.id.toString()}
    x={item.x}
    y={item.y}
    points={item.points || []}
    fill={item.fill}
    closed
    draggable
    scaleX={item.scaleX}
    scaleY={item.scaleY}
    rotation={item.rotation} // Ensure rotation is applied
    stroke={selectedId === item.id ? "red" : "black"}
    strokeWidth={selectedId === item.id ? 5 : 2}
    onClick={() => handleSelectShape(item.id)}
    onDragMove={(e) => handleDragMove(e, item.id)}
  />

  {/* Render nodes when the shape is selected */}
  {selectedId === item.id &&
    (() => {
      const points = item.points || [];

      // Step 1: Compute centroid of polygon
      let sumX = 0, sumY = 0, pointCount = points.length / 2;
      for (let j = 0; j < points.length; j += 2) {
        sumX += points[j];
        sumY += points[j + 1];
      }
      const centerX = sumX / pointCount;
      const centerY = sumY / pointCount;

      // Step 2: Convert rotation angle to radians
      const angle = (item.rotation * Math.PI) / 180;

      return points.map((_, i) =>
        i % 2 === 0 ? (
          (() => {
            const originalX = points[i];
            const originalY = points[i + 1];

            // Step 3: Apply rotation around the centroid
            const rotatedX =
              centerX +
              (originalX - centerX) * Math.cos(angle) -
              (originalY - centerY) * Math.sin(angle);
            const rotatedY =
              centerY +
              (originalX - centerX) * Math.sin(angle) +
              (originalY - centerY) * Math.cos(angle);

            return (
              <Circle
                key={`node-${i}`}
                x={rotatedX + item.x} // Apply shape's x offset
                y={rotatedY + item.y} // Apply shape's y offset
                radius={5}
                fill="blue"
                draggable
                onDragMove={(e) => {
                  const newX = e.target.x() - item.x;
                  const newY = e.target.y() - item.y;

                  // Step 4: Reverse rotation to map new node position back to unrotated space
                  const unrotatedX =
                    centerX +
                    (newX - centerX) * Math.cos(-angle) -
                    (newY - centerY) * Math.sin(-angle);
                  const unrotatedY =
                    centerY +
                    (newX - centerX) * Math.sin(-angle) +
                    (newY - centerY) * Math.cos(-angle);

                  const newPoints = [...points];
                  newPoints[i] = unrotatedX;
                  newPoints[i + 1] = unrotatedY;

                  setItems(items.map(it => it.id === item.id ? { ...it, points: newPoints } : it));
                }}
              />
            );
          })()
        ) : null
      );
    })()}
</>
              )
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SupermarketLayout;
