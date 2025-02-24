import { useContext } from "react";
import { NodeContext } from "../context/NodeContext";

export const useNodeContext = () => {
    const context = useContext(NodeContext);
    if (!context) {
        throw new Error("useNodeContext must be used within an NodeProvider");
    }
    return context;
};