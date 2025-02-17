import React from "react";
import { Line } from "react-konva";
import Fixture from "../../../types/Fixture";
import useNode from "../../../hooks/useNode";
import NodeComp from "./NodeComp";

const FixtureComp = React.memo(
  ({
    item,
    setItems,
    selectedId,
    handleSelectFixture,
    handleDragMoveFixture,
  }: {
    item: Fixture;
    setItems: React.Dispatch<React.SetStateAction<Record<string, Fixture>>>;
    selectedId: string | null;
    handleSelectFixture: (id: string) => void;
    handleDragMoveFixture: (e: any, id: string) => void;
  }) => {

    const { handleNodeDragMove } = useNode();

    return (
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
    );
  }
);

export default FixtureComp;
