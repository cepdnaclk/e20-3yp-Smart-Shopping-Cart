import React, { useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
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
    const newShape: Shape = {
      id: items.length + 1,
      type,
      x: 50 + items.length * 10,
      y: 50 + items.length * 10,
      width: type === "rect" ? 100 : undefined,
      height: type === "rect" ? 50 : undefined,
      radius: type === "circle" ? 30 : undefined,
      fill: type === "rect" ? "lightblue" : "lightgreen",
      name: `Shape ${items.length + 1}`, // Default name
      scaleX: 1,  // Default scale
      scaleY: 1,  // Default scale
      rotation: 0,  // Default rotation
    };
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
                <Circle
                  key={item.id}
                  id={item.id.toString()}
                  x={item.x}
                  y={item.y}
                  radius={item.radius}
                  fill={item.fill}
                  draggable
                  scaleX={item.scaleX}  // Apply scaleX
                  scaleY={item.scaleY}  // Apply scaleY
                  rotation={item.rotation}  // Apply rotation
                  onClick={() => handleSelectShape(item.id)}
                  onDragMove={(e) => handleDragMove(e, item.id)}
                  stroke={selectedId === item.id ? "red" : "transparent"}  // Highlight border when selected
                  strokeWidth={5}  // Border width
                  offsetX={item.radius!}  // Set rotation center to the middle of the circle
                  offsetY={item.radius!}  // Set rotation center to the middle of the circle
                />
              )
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SupermarketLayout;
