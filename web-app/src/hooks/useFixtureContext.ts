import { useContext } from "react";
import { FixtureContext } from "../context/FixtureContext";

/**
 * Custom hook for accessing FixtureContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useFixtureContext = () => {
  const context = useContext(FixtureContext);
  if (!context) {
    throw new Error("useFixtureContext must be used within an FixtureProvider");
  }
  return context;
};
