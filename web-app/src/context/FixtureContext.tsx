import { createContext, useState, ReactNode } from "react";
import Fixture from "../types/Fixture";
import { v4 } from "uuid";

interface FixtureContextType {
  fixtures: Record<string, Fixture>;
  setFixtures: React.Dispatch<React.SetStateAction<Record<string, Fixture>>>;
  selectedFixtureId: string | null;
  setSelectedFixtureId: React.Dispatch<React.SetStateAction<string | null>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  fixturePosition: { x: number; y: number };
  setFixturePosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  fixtureName: string;
  setFixtureName: React.Dispatch<React.SetStateAction<string>>;
  addFixture: () => void;
  handleFixtureNameChange: (newName: string) => void;
  handleFixturePositionChange: (axis: "x" | "y", value: number) => void;
  handleDragMoveFixture: (e: any, id: string) => void;
  handleSelectFixture: (id: string) => void;
  deleteFixture: () => void;
  toggleEditMode: () => void;
}

export const FixtureContext = createContext<FixtureContextType | undefined>(
  undefined
);

export const FixtureProvider = ({ children }: { children: ReactNode }) => {
  const [fixtures, setFixtures] = useState<Record<string, Fixture>>({});
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fixturePosition, setFixturePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [fixtureName, setFixtureName] = useState<string>("");

  const addFixture = () => {
    console.log("Add Fixture");
    const newId = v4();
    let points = [0, 0, 60, 200, 200, 0];

    let sumX = 0,
      sumY = 0,
      pointCount = points.length / 2;
    for (let i = 0; i < points.length; i += 2) {
      sumX += points[i];
      sumY += points[i + 1];
    }
    const centerX = sumX / pointCount;
    const centerY = sumY / pointCount;
    points = points.map((p, i) => p - (i % 2 === 0 ? centerX : centerY));

    const newFixture: Fixture = {
      id: newId,
      x: 500,
      y: 500,
      points,
      fill: "lightgreen",
      name: "Fixture",
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    setFixtures((prevItems) => ({ ...prevItems, [newId]: newFixture }));
  };

  const handleFixtureNameChange = (newName: string) => {
    if (selectedFixtureId !== null) {
      setFixtureName(newName);
      setFixtures((prevItems) => ({
        ...prevItems,
        [selectedFixtureId]: {
          ...prevItems[selectedFixtureId],
          fixtureName: newName,
        },
      }));
    }
  };

  const handleFixturePositionChange = (axis: "x" | "y", value: number) => {
    if (!isNaN(value) && selectedFixtureId !== null) {
      setFixturePosition((prevPosition) => ({
        ...prevPosition,
        [axis]: value,
      }));
      setFixtures((prevItems) => ({
        ...prevItems,
        [selectedFixtureId]: { ...prevItems[selectedFixtureId], [axis]: value },
      }));
    }
  };

  const handleDragMoveFixture = (e: any, id: string) => {
    const newX = e.target.x();
    const newY = e.target.y();
    setFixtures((prevItems) => ({
      ...prevItems,
      [id]: { ...prevItems[id], x: newX, y: newY },
    }));
    if (id === selectedFixtureId) {
      setFixturePosition({ x: newX, y: newY });
    }
  };

  const handleSelectFixture = (id: string) => {
    setSelectedFixtureId(id);
    setFixturePosition({ x: fixtures[id].x, y: fixtures[id].y });
    setFixtureName(fixtures[id].name);
  };

  const deleteFixture = () => {
    if (selectedFixtureId !== null) {
      setFixtures((prevItems) => {
        const newItems = { ...prevItems };
        delete newItems[selectedFixtureId];
        return newItems;
      });
      setSelectedFixtureId(null);
      setFixturePosition({ x: 0, y: 0 });
      setFixtureName("");
    }
  };

  const toggleEditMode = () => {
    if (selectedFixtureId !== null) {
      console.log("Change Mode");
      setEditMode(!editMode);
    }
  };

  return (
    <FixtureContext.Provider
      value={{
        fixtures,
        setFixtures,
        selectedFixtureId,
        setSelectedFixtureId,
        editMode,
        setEditMode,
        fixturePosition,
        setFixturePosition,
        fixtureName,
        setFixtureName,
        addFixture,
        handleFixtureNameChange,
        handleFixturePositionChange,
        handleDragMoveFixture,
        handleSelectFixture,
        deleteFixture,
        toggleEditMode,
      }}
    >
      {children}
    </FixtureContext.Provider>
  );
};
