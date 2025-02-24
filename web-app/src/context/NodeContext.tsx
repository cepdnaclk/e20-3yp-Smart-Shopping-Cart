import { createContext, useState, ReactNode, SetStateAction } from "react";
import Fixture from "../types/Fixture";

interface NodeContextType {
  selectedNode: number | null;
  setSelectedNode: React.Dispatch<SetStateAction<number | null>>;
  handleSelectNode: (selectedNode: number | null) => void;
  handleNodeDragMove: (
    e: any,
    selectedFixtureId: string,
    selectedNode: number,
    setItems: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => void;
  deleteNode: (
    selectedFixtureId: string,
    setItems: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => void;
}

export const NodeContext = createContext<NodeContextType | undefined>(
  undefined
);

export const NodeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const handleSelectNode = (selectedNode: number | null) => {
    console.log("Select Node: " + selectedNode);
    setSelectedNode(selectedNode);
  };

  const handleNodeDragMove = (
    e: any,
    selectedFixtureId: string,
    selectedNode: number,
    setItems: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => {
    const { x, y } = e.target.position();

    setItems((prevItems) => {
      const item = prevItems[selectedFixtureId];
      if (!item) return prevItems;

      const relativeX = x - item.x;
      const relativeY = y - item.y;

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
  };

  const deleteNode = (
    selectedFixtureId: string,
    setItems: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => {
    if (selectedNode === null) return; // No node selected

    setItems((prevItems) => {
      const item = prevItems[selectedFixtureId];
      if (!item) return prevItems;

      // Each node is represented by (x, y), so its index in `points` should be `selectedNode * 2`
      const nodeIndex = selectedNode * 2;

      const updatedPoints = item.points.filter(
        (_, i) => i !== nodeIndex && i !== nodeIndex + 1
      );

      return {
        ...prevItems,
        [selectedFixtureId]: { ...item, points: updatedPoints },
      };
    });

    setSelectedNode(null); // Deselect after deletion
  };

  return (
    <NodeContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        handleSelectNode,
        handleNodeDragMove,
        deleteNode,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
