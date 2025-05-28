import React from "react";
import { Line } from "react-konva";
import Fixture from "../../../types/Fixture";
import NodeComp from "./NodeComp";
import { useEdgeContext } from "../../../hooks/useEdgeContext";
import { useNodeContext } from "../../../hooks/useNodeContext";
import { useFixtureContext } from "../../../hooks/useFixtureContext";

const FixtureComp = React.memo(({ fixture }: { fixture: Fixture }) => {
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
    <React.Fragment key={fixture.id}>
      {/* Main Polygon */}
      <Line
        id={fixture.id}
        x={fixture.x}
        y={fixture.y}
        points={fixture.points}
        fill={fixture.color || "orange"} // Default color
        closed
        draggable
        stroke={selectedFixtureId === fixture.id ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"}
        strokeWidth={selectedFixtureId === fixture.id ? 3 : 1}
        onClick={() => {
          handleSelectFixture(fixture.id);
          setSelectedEdge(null);
        }}
        onDragStart={() => {
          handleSelectFixture(fixture.id);
          setSelectedEdge(null);
        }}
        onDragMove={(e) => handleDragMoveFixture(e, fixture.id)}
      />

      {/* Invisible Edges (Selectable in edit mode) */}
      {selectedFixtureId === fixture.id &&
        editMode &&
        fixture.points.map((_, i) => {
          if (i % 2 === 0) {
            const nextIndex = (i + 2) % fixture.points.length; // Wrap around for last edge
            return (
              <Line
                key={`${fixture.id}-edge-${i / 2}`}
                x={fixture.x}
                y={fixture.y}
                points={[
                  fixture.points[i],
                  fixture.points[i + 1], // Current point
                  fixture.points[nextIndex],
                  fixture.points[nextIndex + 1], // Next point (wrap around)
                ]}
                stroke={selectedEdge === i / 2 ? "rgb(0, 0, 0)" : "transparent"}
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
      {selectedFixtureId === fixture.id &&
        editMode &&
        fixture.points.map((_, index) =>
          index % 2 === 0 ? (
            <NodeComp
              key={`${fixture.id}-node-${index / 2}`}
              x={fixture.x + fixture.points[index]}
              y={fixture.y + fixture.points[index + 1]}
              mode="edit"
              fill={selectedNode === index / 2 ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.3)"}
              onClick={() => {
                handleSelectNode(index / 2);
                if (selectedEdge != null) handleSelectEdge(null); // Deselect edge when a node is selected
              }}
              onDragMove={(e) =>
                handleNodeDragMove(e, fixture.id, index, setFixtures)
              }
            />
          ) : null
        )}
    </React.Fragment>
  );
});

export default FixtureComp;
