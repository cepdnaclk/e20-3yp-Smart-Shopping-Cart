import React from "react";
import { Circle } from "react-konva";

const NodeComp = React.memo(
  ({
    x,
    y,
    mode,
    fill,
    onClick,
    onDragMove,
    onDragStart,
    onDragEnd,
  }: {
    x: number;
    y: number;
    mode: "object" | "edit"; // Mode to control interactivity
    fill: string;
    onClick: (e: any) => void;
    onDragMove: (e: any) => void;
    onDragStart?: (e: any) => void;
    onDragEnd?: (e: any) => void;
  }) => {
    return (
      <Circle
        x={x}
        y={y}
        radius={5}
        fill={fill}
        draggable={mode === "edit"}
        onClick={mode === "edit" ? onClick : undefined}
        onDragMove={mode === "edit" ? onDragMove : undefined}
        onDragStart={mode === "edit" ? onDragStart : undefined}
        onDragEnd={mode === "edit" ? onDragEnd : undefined}
      />
    );
  }
);

export default NodeComp;
