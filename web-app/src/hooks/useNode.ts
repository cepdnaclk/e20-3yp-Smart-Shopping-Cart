import { SetStateAction } from "react";
import Fixture from "../types/Fixture";

const useNode = () => {
    const handleNodeDragMove = (
        e: any,
        itemId: string,
        nodeIndex: number,
        setItems: React.Dispatch<SetStateAction<Record<string, Fixture>>>
    ) => {
        const { x, y } = e.target.position(); // Get absolute position in canvas

        setItems((prevItems) => {
            const item = prevItems[itemId];
            if (!item) return prevItems; // If item doesn't exist, return unchanged state

            // ✅ Fix: Adjust node position to be relative to the fixture (Group)
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

    return { handleNodeDragMove };
};

export default useNode;
