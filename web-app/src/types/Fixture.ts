/**
 * Fixture represents a store layout element (racks, shelf, display, etc.)
 * Uses coordinate system with points array defining the polygon shape
 */

type Fixture = {
  id: string; // Unique identifier
  x: number; // x offset of the fixture origin in world space
  y: number; // y offset of the fixture origin in world space
  points: number[]; // Array of [x,y] coordinates defining fixture shape relative to fixtur origin (0, 0)
  name: string; // Name of the fixture
  color?: string; // Color of the fixture
};

export default Fixture;
