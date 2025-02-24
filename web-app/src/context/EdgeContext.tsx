import { createContext, useState, ReactNode } from "react";
import { useFixtureContext } from "../hooks/useFixtureContext";

interface EdgeContextType {
  selectedEdge: number | null;
  setSelectedEdge: React.Dispatch<React.SetStateAction<number | null>>;
  handleSelectEdge: (edgeIndex: number | null) => void;
  handleAddNodeToEdge: (edgeIndex: number) => void;
}

export const EdgeContext = createContext<EdgeContextType | undefined>(
  undefined
);

export const EdgeProvider = ({ children }: { children: ReactNode }) => {
  const { fixtures, setFixtures, selectedFixtureId } = useFixtureContext();

  const [selectedEdge, setSelectedEdge] = useState<number | null>(null);

  const handleSelectEdge = (edgeIndex: number | null) => {
    console.log("Select Edge: " + selectedEdge);
    setSelectedEdge(edgeIndex);
  };

  const handleAddNodeToEdge = (edgeIndex: number) => {
    if (selectedFixtureId !== null) {
      const fixture = fixtures[selectedFixtureId];
      const points = [...fixture.points];

      const x1 = fixture.x + points[edgeIndex * 2];
      const y1 = fixture.y + points[edgeIndex * 2 + 1];
      const x2 = fixture.x + points[(edgeIndex * 2 + 2) % points.length];
      const y2 = fixture.y + points[(edgeIndex * 2 + 3) % points.length];

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

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
        handleSelectEdge,
        handleAddNodeToEdge,
      }}
    >
      {children}
    </EdgeContext.Provider>
  );
};
