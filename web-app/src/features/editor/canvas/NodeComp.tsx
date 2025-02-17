import React from "react";
import { Circle } from "react-konva";

const NodeComp = React.memo(
  ({
    x,
    y,
    mode,
    onDragMove,
    onDragStart,
    onDragEnd,
  }: {
    x: number;
    y: number;
    mode: "object" | "edit"; // Mode to control interactivity
    onDragMove: (e: any) => void;
    onDragStart?: (e: any) => void;
    onDragEnd?: (e: any) => void;
  }) => {
    return (
      <Circle
        x={x}
        y={y}
        radius={5}
        fill="blue"
        draggable={mode === "edit"} // Nodes are draggable only in edit mode
        onDragMove={mode === "edit" ? onDragMove : undefined}
        onDragStart={mode === "edit" ? onDragStart : undefined}
        onDragEnd={mode === "edit" ? onDragEnd : undefined}
      />
    );
  }
);

export default NodeComp;
