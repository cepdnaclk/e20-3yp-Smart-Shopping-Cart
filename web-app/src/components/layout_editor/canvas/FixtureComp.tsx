import React from "react";
import { Line } from "react-konva";
import Fixture from "../../../types/Fixture";
import NodeComp from "./NodeComp";
import { useEdgeContext } from "../../../hooks/useEdgeContext";
import { useNodeContext } from "../../../hooks/useNodeContext";
import { useFixtureContext } from "../../../hooks/useFixtureContext";

/**
 * FixtureComp - Interactive Konva Fixture Component
 *
 * Renders individual fixtures on the canvas with mode-dependent interactivity.
 * Handles scaling, selection states, and provides edit mode capabilities
 * for node and edge manipulation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Fixture} props.fixture - Fixture data object
 */

const FixtureComp = React.memo(({ fixture }: { fixture: Fixture }) => {
  // Scale factor: 40 pixels = 1 meter
  const SCALE = 40;
  const { selectedNode, setSelectedNode, handleNodeDragMove, setNodePosition } =
    useNodeContext();
  const { selectedEdge, setSelectedEdge } = useEdgeContext();
  const {
    fixtures,
    setFixtures,
    selectedFixtureId,
    fixturePosition,
    mode,
    handleSelectFixture,
    handleDragMoveFixture,
  } = useFixtureContext();

  // Convert fixture points to scaled canvas coordinates
  const scaledPoints = fixture.points.map((point) => point * SCALE);

  return (
    <React.Fragment key={fixture.id}>
      {/* Main fixture polygon with selection highlighting */}
      <Line
        id={fixture.id}
        x={fixture.x * SCALE}
        y={fixture.y * SCALE}
        points={scaledPoints}
        fill={fixture.color}
        closed
        draggable
        stroke={
          selectedFixtureId === fixture.id
            ? "rgba(0, 0, 0, 0.3)"
            : "rgba(0, 0, 0, 0.1)"
        }
        strokeWidth={selectedFixtureId === fixture.id ? 3 : 1}
        onClick={() => {
          handleSelectFixture(fixture.id);
          setSelectedEdge(null);
          setSelectedNode(null);
        }}
        onDragStart={() => {
          handleSelectFixture(fixture.id);
          setSelectedEdge(null);
        }}
        onDragMove={(e) => {
          if (selectedNode != null) setSelectedNode(null);
          handleDragMoveFixture(e, fixture.id);
        }}
      />

      {/* Invisible edges that are only visible if selected (Selectable in edit mode) */}
      {selectedFixtureId === fixture.id &&
        mode == "Edit Mode" &&
        fixture.points.map((_, i) => {
          if (i % 2 === 0) {
            const nextIndex = (i + 2) % fixture.points.length; // Wrap around for last edge
            return (
              <Line
                key={`${fixture.id}-edge-${i / 2}`}
                x={fixture.x * SCALE}
                y={fixture.y * SCALE}
                points={[
                  fixture.points[i] * SCALE,
                  fixture.points[i + 1] * SCALE, // Current point
                  fixture.points[nextIndex] * SCALE,
                  fixture.points[nextIndex + 1] * SCALE, // Next point (wrap around)
                ]}
                stroke={selectedEdge === i / 2 ? "rgb(0, 0, 0)" : "transparent"}
                strokeWidth={5}
                onClick={() => {
                  setSelectedEdge(i / 2);
                  if (selectedNode != null) setSelectedNode(null);
                }}
              />
            );
          }
          return null;
        })}

      {/* Invisible nodes that are only visible in edit mode (Selectable in edit mode) */}
      {selectedFixtureId === fixture.id &&
        mode == "Edit Mode" &&
        fixture.points.map((_, index) =>
          index % 2 === 0 ? (
            <NodeComp
              key={`${fixture.id}-node-${index / 2}`}
              x={(fixture.x + fixture.points[index]) * SCALE}
              y={(fixture.y + fixture.points[index + 1]) * SCALE}
              mode="edit"
              fill={
                selectedNode === index / 2
                  ? "rgb(0, 0, 0)"
                  : "rgba(0, 0, 0, 0.3)"
              }
              onClick={() => {
                setSelectedNode(index / 2);
                let x = fixtures[selectedFixtureId].points[index];
                let y = fixtures[selectedFixtureId].points[index + 1];
                setNodePosition({
                  x: x + fixturePosition.x,
                  y: y + fixturePosition.y,
                });
                if (selectedEdge != null) setSelectedEdge(null); // Deselect edge when a node is selected
              }}
              onDragMove={(e) => {
                if (selectedNode != index/2) setSelectedNode(index / 2);
                if (selectedEdge != null) setSelectedEdge(null);
                handleNodeDragMove(e, fixture.id, index, setFixtures);
              }}
            />
          ) : null
        )}

      {/* Crosshair indicator for origin of selected fixture */}
      {selectedFixtureId === fixture.id && (
        <>
          <Line
            x={fixture.x * SCALE}
            y={fixture.y * SCALE}
            points={[-0.2 * SCALE, 0, 0.2 * SCALE, 0]}
            stroke={"rgba(0, 0, 0, 0.3)"}
            strokeWidth={2}
          />
          <Line
            x={fixture.x * SCALE}
            y={fixture.y * SCALE}
            points={[0, -0.2 * SCALE, 0, 0.2 * SCALE]}
            stroke={"rgba(0, 0, 0, 0.3)"}
            strokeWidth={2}
          />
        </>
      )}
    </React.Fragment>
  );
});

export default FixtureComp;
