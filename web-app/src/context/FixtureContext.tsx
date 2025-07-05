/**
 * FixtureContext manages the complete lifecycle of store fixtures including
 * creation, positioning, styling, and interaction modes. Uses a 40px:1m scale factor.
 */

import { createContext, useState, useEffect, ReactNode } from "react";
import Fixture from "../types/Fixture";
import { v4 } from "uuid";
import { loadFixtureLayout } from "../utils/LoadData";

/**
 * Comprehensive context interface for fixture management
 * Includes create, delete fixture operations, positioning, styling, and mode switching
 * @interface EdgeContextType
 */

interface FixtureContextType {
  fixtures: Record<string, Fixture>;
  setFixtures: React.Dispatch<React.SetStateAction<Record<string, Fixture>>>;
  selectedFixtureId: string | null;
  setSelectedFixtureId: React.Dispatch<React.SetStateAction<string | null>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  fixturePosition: { x: number; y: number };
  setFixturePosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  fixtureName: string;
  setFixtureName: React.Dispatch<React.SetStateAction<string>>;
  fixtureColor: string;
  setFixtureColor: React.Dispatch<React.SetStateAction<string>>;
  addFixture: () => void;
  handleFixtureNameChange: (newName: string) => void;
  handleFixtureColorChange: (newColor: string) => void;
  handleFixturePositionChange: (axis: "x" | "y", value: number) => void;
  handleDragMoveFixture: (e: any, id: string) => void;
  handleSelectFixture: (id: string) => void;
  deleteFixture: () => void;
  toggleModes: (mode: string) => void;
}

export const FixtureContext = createContext<FixtureContextType | undefined>(
  undefined
);

export const FixtureProvider = ({ children }: { children: ReactNode }) => {
  // Scale factor: 40 pixels = 1 meter for real-world coordinate mapping
  const SCALE = 40;  const [fixtures, setFixtures] = useState<Record<string, Fixture>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFixtures = async () => {
      try {
        setIsLoading(true);
        const loadedLayout = await loadFixtureLayout();
        console.log("Initial fixtures loaded:", loadedLayout);
        setFixtures(loadedLayout || {});
      } catch (error) {
        console.error("Error loading fixtures:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFixtures();
  }, []);

  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(
    null
  );
  const [mode, setMode] = useState<string>("Object Mode");
  const [fixturePosition, setFixturePosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [fixtureName, setFixtureName] = useState<string>("");
  const [fixtureColor, setFixtureColor] = useState<string>("");

  /**
   * Creates a new fixture with default rectangular shape and properties
   * Automatically centers the fixture points around origin
   */
  const addFixture = () => {
    console.log("Add Fixture");
    const newId = v4();

    // Default fixture shape: vertical rectangle (1m wide, 8m tall)
    let points = [-0.5, -4, -0.5, 4, 0.5, 4, 0.5, -4];

    let sumX = 0,
      sumY = 0,
      pointCount = points.length / 2;
    for (let i = 0; i < points.length; i += 2) {
      sumX += points[i];
      sumY += points[i + 1];
    }

    // Center the fixture points around origin (0,0) for consistent positioning
    // This (0, 0) origin is the center of the fixture and points are positioned relative to it
    // The center of the fixture is then offset in world space by the fixture's x and y properties
    const centerX = sumX / pointCount;
    const centerY = sumY / pointCount;
    points = points.map((p, i) => p - (i % 2 === 0 ? centerX : centerY));

    const newFixture: Fixture = {
      id: newId,
      x: 12,
      y: 12,
      points,
      color: "#f5a051",
      name: "New Fixture",
    };
    setFixtures((prevItems) => ({ ...prevItems, [newId]: newFixture }));
  };

  /**
   * Updates the name of the currently selected fixture
   * @param newName - New display name for the fixture
   */
  const handleFixtureNameChange = (newName: string) => {
    if (selectedFixtureId !== null) {
      setFixtures((prevItems) => ({
        ...prevItems,
        [selectedFixtureId]: {
          ...prevItems[selectedFixtureId],
          name: newName,
        },
      }));
      setFixtureName(newName);
    }
  };

  /**
   * Handles fixture color change
   * @param newColor - The new color of the fixture
   */
  const handleFixtureColorChange = (newColor: string) => {
    if (selectedFixtureId !== null) {
      setFixtures((prevItems) => ({
        ...prevItems,
        [selectedFixtureId]: {
          ...prevItems[selectedFixtureId],
          color: newColor,
        },
      }));
    }
  };

  /**
   * Handles fixture repositioning using sidebar coordinate inputs
   * @param axis - The axis (x or y) of the coordinate
   * @param value - Value of the coordinate
   */
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

  /**
   * Handles fixture repositioning during drag operations
   * Converts screen coordinates to real-world coordinates using scale factor
   * @param e - Drag event containing new position
   * @param id - ID of the fixture being moved
   */
  const handleDragMoveFixture = (e: any, id: string) => {
    const newX = e.target.x();
    const newY = e.target.y();
    setFixtures((prevItems) => ({
      ...prevItems,
      [id]: { ...prevItems[id], x: newX / SCALE, y: newY / SCALE },
    }));
    if (id === selectedFixtureId) {
      setFixturePosition({ x: newX / SCALE, y: newY / SCALE });
    }
  };

  /**
   * Handles fixture selectioin
   * @param id - ID of the fixture got selected
   */
  const handleSelectFixture = (id: string) => {
    setSelectedFixtureId(id);
    setFixturePosition({ x: fixtures[id].x, y: fixtures[id].y });
    setFixtureName(fixtures[id].name);
  };

  /**
   * Handles fixture deletion
   * Selected fixture (fixture with ID == selectedFixtureId) will be removd from fixtures
   */
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

  /**
   * Switches between editing modes (Object Mode, Edit Mode, etc.)
   * Only allows mode changes when a fixture is selected
   * @param mode - Target mode to switch to
   */
  const toggleModes = (mode: string) => {
    if (selectedFixtureId !== null) {
      console.log("Change Mode");
      setMode(mode);
    }
  };

  return (
    <FixtureContext.Provider
      value={{
        fixtures,
        setFixtures,
        selectedFixtureId,
        setSelectedFixtureId,
        mode,
        setMode,
        fixturePosition,
        setFixturePosition,
        fixtureName,
        setFixtureName,
        fixtureColor,
        setFixtureColor,
        addFixture,
        handleFixtureNameChange,
        handleFixtureColorChange,
        handleFixturePositionChange,
        handleDragMoveFixture,
        handleSelectFixture,
        deleteFixture,
        toggleModes,
      }}
    >
      {children}
    </FixtureContext.Provider>
  );
};
