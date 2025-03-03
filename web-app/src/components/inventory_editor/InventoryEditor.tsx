import React from "react";
import { ShelfProvider } from "../../context/ShelfContext";
import { ItemProvider } from "../../context/ItemContext";
import RackSideSelector from "./RackSideSelector";
import ShelfList from "./ShelfList";
import { useSidebarContext } from "../../hooks/useSidebarContext";

const InventoryEditor: React.FC = () => {
  const { isInventoryOpen } = useSidebarContext();

  if (!isInventoryOpen) return null; // Hide when not open

  return (
    <ItemProvider>
      <ShelfProvider>
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            background: "white",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            zIndex: 998,
            color: "#333",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Content Section */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginTop: "50px",
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "10px",
              scrollbarWidth: "thin",
              scrollbarColor: "#aaaaaa #f0f0f0",
            }}
          >
            <RackSideSelector />
            <ShelfList />
          </div>
        </div>
      </ShelfProvider>
    </ItemProvider>
  );
};

export default InventoryEditor;
