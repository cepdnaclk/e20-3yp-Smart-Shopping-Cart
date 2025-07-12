import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

/**
 * Custom hook for accessing AuthContext with error handling
 * Ensures hook is used within proper provider component
 */

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an EdgeProvider");
  }
  return context;
};
