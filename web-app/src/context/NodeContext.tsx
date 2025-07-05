/**
 * NodeContext handles individual node manipulation within fixtures.
 * Manages node selection, positioning, and deletion with coordinate scaling.
 */

import { createContext, useState, ReactNode, SetStateAction } from "react";
import Fixture from "../types/Fixture";

/**
 * Context interface for node (points of the fixture shape) management operations
 * @interface NodeContextType
 */
interface NodeContextType {
  selectedNode: number | null;
  setSelectedNode: React.Dispatch<SetStateAction<number | null>>;
  handleNodeDragMove: (
    e: any,
    selectedFixtureId: string,
    selectedNode: number,
    setFixtures: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => void;
  deleteNode: (
    selectedFixtureId: string,
    setFixtures: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => void;
  nodePosition: {
    x: number;
    y: number;
  };
  setNodePosition: React.Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    }>
  >;
}

export const NodeContext = createContext<NodeContextType | undefined>(
  undefined
);

export const NodeProvider = ({ children }: { children: ReactNode }) => {
  // Scale factor matching FixtureContext: 40 pixels = 1 meter
  const SCALE = 40;
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [nodePosition, setNodePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  /**
   * Updates node position during drag operations
   * Converts screen coordinates to relative fixture coordinates
   * @param e - Drag event with new position
   * @param selectedFixtureId - ID of the fixture containing the node
   * @param selectedNode - Index of the node being moved
   * @param setFixtures - Fixture state setter function
   */
  const handleNodeDragMove = (
    e: any,
    selectedFixtureId: string,
    selectedNode: number,
    setFixtures: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => {
    const { x, y } = e.target.position();

    // Convert screen coordinates to scaled world coordinates
    const scaledX = x / SCALE;
    const scaledY = y / SCALE;

    setFixtures((prevItems) => {
      const item = prevItems[selectedFixtureId];
      if (!item) return prevItems;

      // Calculate node position relative to fixture origin
      const relativeX = scaledX - item.x;
      const relativeY = scaledY - item.y;

      return {
        ...prevItems,
        [selectedFixtureId]: {
          ...item,
          points: item.points.map((p, i) =>
            i === selectedNode
              ? relativeX
              : i === selectedNode + 1
              ? relativeY
              : p
          ),
        },
      };
    });

    setNodePosition({ x: scaledX, y: scaledY });
  };

  /**
   * Removes the selected node from the fixture's points array
   * Each node consists of x,y coordinates, so removes 2 array elements
   * @param selectedFixtureId - ID of the fixture containing the node
   * @param setFixtures - Fixture state setter function
   */
  const deleteNode = (
    selectedFixtureId: string,
    setFixtures: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => {
    if (selectedNode === null) return; // No node selected

    setFixtures((prevItems) => {
      const item = prevItems[selectedFixtureId];
      if (!item) return prevItems;

      // Calculate array index: each node uses 2 elements (x, y)
      const nodeIndex = selectedNode * 2;

      const updatedPoints = item.points.filter(
        (_, i) => i !== nodeIndex && i !== nodeIndex + 1
      );

      return {
        ...prevItems,
        [selectedFixtureId]: { ...item, points: updatedPoints },
      };
    });

    setNodePosition({ x: 0, y: 0 }); // Reset position after deletion
    setSelectedNode(null); // Deselect after deletion
  };

  return (
    <NodeContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        handleNodeDragMove,
        deleteNode,
        nodePosition,
        setNodePosition,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
