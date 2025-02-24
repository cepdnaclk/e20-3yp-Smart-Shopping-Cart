import { useContext } from "react";
import { EdgeContext } from "../context/EdgeContext";

export const useEdgeContext = () => {
    const context = useContext(EdgeContext);
    if (!context) {
        throw new Error("useEdgeContext must be used within an EdgeProvider");
    }
    return context;
};