import React from "react";
import { Line } from "react-konva";
import Fixture from "../../../types/Fixture";
import NodeComp from "./NodeComp";
import { useEdgeContext } from "../../../hooks/useEdgeContext";
import { useNodeContext } from "../../../hooks/useNodeContext";
import { useFixtureContext } from "../../../hooks/useFixtureContext";

const FixtureComp = React.memo(({ item }: { item: Fixture }) => {
  const { selectedNode, handleSelectNode, handleNodeDragMove } =
    useNodeContext();
  const { selectedEdge, setSelectedEdge, handleSelectEdge } = useEdgeContext();
  const {
    setFixtures,
    selectedFixtureId,
    editMode,
    handleSelectFixture,
    handleDragMoveFixture,
  } = useFixtureContext();

  return (
    <React.Fragment key={item.id}>
      {/* Main Polygon */}
      <Line
        id={item.id.toString()}
        x={item.x}
        y={item.y}
        points={item.points}
        fill={item.color || "orange"} // Default color
        closed
        draggable
        stroke={selectedFixtureId === item.id ? "white" : "black"}
        strokeWidth={selectedFixtureId === item.id ? 3 : 1}
        onClick={() => {
          handleSelectFixture(item.id);
          setSelectedEdge(null);
        }}
        onDragStart={() => {
          handleSelectFixture(item.id);
          setSelectedEdge(null);
        }}
        onDragMove={(e) => handleDragMoveFixture(e, item.id)}
      />

      {/* Invisible Edges (Selectable in edit mode) */}
      {selectedFixtureId === item.id &&
        editMode &&
        item.points.map((_, i) => {
          if (i % 2 === 0) {
            const nextIndex = (i + 2) % item.points.length; // Wrap around for last edge
            return (
              <Line
                key={`${item.id}-edge-${i / 2}`}
                x={item.x}
                y={item.y}
                points={[
                  item.points[i],
                  item.points[i + 1], // Current point
                  item.points[nextIndex],
                  item.points[nextIndex + 1], // Next point (wrap around)
                ]}
                stroke={selectedEdge === i / 2 ? "blue" : "transparent"}
                strokeWidth={5}
                onClick={() => {
                  handleSelectEdge(i / 2);
                  if (selectedNode != null) handleSelectNode(null);
                }}
              />
            );
          }
          return null;
        })}

      {/* Nodes (Only visible in edit mode) */}
      {selectedFixtureId === item.id &&
        editMode &&
        item.points.map((_, index) =>
          index % 2 === 0 ? (
            <NodeComp
              key={`${item.id}-node-${index / 2}`}
              x={item.x + item.points[index]}
              y={item.y + item.points[index + 1]}
              mode="edit"
              fill={selectedNode === index / 2 ? "blue" : "white"}
              onClick={() => {
                handleSelectNode(index / 2);
                if (selectedEdge != null) handleSelectEdge(null); // Deselect edge when a node is selected
              }}
              onDragMove={(e) =>
                handleNodeDragMove(e, item.id, index, setFixtures)
              }
            />
          ) : null
        )}
    </React.Fragment>
  );
});

export default FixtureComp;
