/**
 * EdgeContext provides functionality for managing fixture edges and adding nodes.
 * Handles edge selection state and coordinates for node insertion at edge midpoints.
 */

import { createContext, useState, ReactNode } from "react";
import { useFixtureContext } from "../hooks/useFixtureContext";

/**
 * Context interface for edge management operations
 * @interface EdgeContextType
 */
interface EdgeContextType {
  selectedEdge: number | null;
  setSelectedEdge: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddNodeToEdge: (edgeIndex: number) => void;
}

export const EdgeContext = createContext<EdgeContextType | undefined>(
  undefined
);

export const EdgeProvider = ({ children }: { children: ReactNode }) => {
  const { fixtures, setFixtures, selectedFixtureId } = useFixtureContext();
  const [selectedEdge, setSelectedEdge] = useState<number | null>(null);

  /**
   * Adds a new node at the midpoint of the selected edge
   * @param edgeIndex - Index of the edge where the node should be added
   */
  const handleAddNodeToEdge = (edgeIndex: number) => {
    if (selectedFixtureId !== null) {
      const fixture = fixtures[selectedFixtureId];
      const points = [...fixture.points];

      // Calculate current edge endpoints from fixture points array
      const x1 = fixture.x + points[edgeIndex * 2];
      const y1 = fixture.y + points[edgeIndex * 2 + 1];
      const x2 = fixture.x + points[(edgeIndex * 2 + 2) % points.length];
      const y2 = fixture.y + points[(edgeIndex * 2 + 3) % points.length];

      // Find midpoint coordinates for new node placement
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Insert new node coordinates relative to fixture origin
      points.splice(edgeIndex * 2 + 2, 0, midX - fixture.x, midY - fixture.y);

      setFixtures((prevItems) => ({
        ...prevItems,
        [selectedFixtureId]: { ...fixture, points },
      }));
    }
  };

  return (
    <EdgeContext.Provider
      value={{
        selectedEdge,
        setSelectedEdge,
        handleAddNodeToEdge,
      }}
    >
      {children}
    </EdgeContext.Provider>
  );
};
