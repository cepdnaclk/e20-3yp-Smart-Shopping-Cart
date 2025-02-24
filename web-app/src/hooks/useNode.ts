import { SetStateAction } from "react";
import Fixture from "../types/Fixture";

const useNode = ({
  selectedNode,
  setSelectedNode,
}: {
  selectedNode: number | null;
  setSelectedNode: React.Dispatch<SetStateAction<number | null>>;
}) => {
  const handleNodeDragMove = (
    e: any,
    itemId: string,
    nodeIndex: number,
    setItems: React.Dispatch<SetStateAction<Record<string, Fixture>>>
  ) => {
    const { x, y } = e.target.position();

    setItems((prevItems) => {
      const item = prevItems[itemId];
      if (!item) return prevItems;

      const relativeX = x - item.x;
      const relativeY = y - item.y;

      return {
        ...prevItems,
        [itemId]: {
          ...item,
          points: item.points.map((p, i) =>
            i === nodeIndex ? relativeX : i === nodeIndex + 1 ? relativeY : p
          ),
        },
      };
    });
  };

  const handleNodeDelete = () => {
    if (selectedNode != null) {
      setSelectedNode(null);
    }
  };

  return { handleNodeDragMove, handleNodeDelete };
};

export default useNode;
