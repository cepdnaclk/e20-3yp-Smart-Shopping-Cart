import { useContext } from "react";
import { FixtureContext } from "../context/FixtureContext";

export const useFixtureContext = () => {
  const context = useContext(FixtureContext);
  if (!context) {
    throw new Error("useFixtureContext must be used within an FixtureProvider");
  }
  return context;
};
