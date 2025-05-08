import { useContext } from "react";
import { ShelfContext } from "../context/ShelfContext";

export const useShelfContext = () => {
    const context = useContext(ShelfContext);
    if (!context) {
        throw new Error("useShelfContext must be used within an ShelfProvider");
    }
    return context;
};