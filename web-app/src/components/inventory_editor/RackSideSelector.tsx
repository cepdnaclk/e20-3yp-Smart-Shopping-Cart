import React from "react";
import { useShelfContext } from "../../hooks/useShelfContext";

const rackSides = ["Front", "Back", "Left", "Right", "Top"];

const RackSideSelector: React.FC = () => {
  const { selectedSide, setSelectedSide, setSelectedShelf } = useShelfContext();

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
      {rackSides.map((side) => (
        <button
          key={side}
          onClick={() => {
            setSelectedSide(side);
            setSelectedShelf(null);
          }}
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            backgroundColor: selectedSide === side ? "#007bff" : "#ffffff",
            color: selectedSide === side ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.2s, transform 0.1s",
            boxShadow: selectedSide === side ? "0px 4px 8px rgba(0, 123, 255, 0.2)" : "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
          onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {side}
        </button>
      ))}
    </div>
  );
};

export default RackSideSelector;
