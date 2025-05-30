import React from "react";
import { v4 as uuidv4 } from "uuid";
import NescafeImg from "../../../assets/Nescafe_Ice_Cold_Coffee_180ml.jpg";
import MiloImg from "../../../assets/Milo_Food_Drink_Chocolate_Tetra_180ml.jpg";
import KistJamImg from "../../../assets/Kist_Jam_Mixed_Fruit_510g.jpg";
import KrestSausageImg from "../../../assets/Krest_Chicken_Sausages_Bockwurst_400g.jpg";
import Item from "../../types/Item";
import { useItemContext } from "../../hooks/useItemContext";

/**
 * ItemMapEditorSidebar - Inventory Panel for Item Management
 *
 * Provides a draggable inventory of items that can be added to the layout.
 * Items are displayed in a grid format with images and can be dragged
 * onto the item map editor grid.
 *
 * @component
 */

const ItemMapEditorSidebar: React.FC = () => {
  const { setDragging } = useItemContext();
  const inventoryItems = [
    { name: "Nescafe Ice Cold Coffee 180ml", image: NescafeImg },
    { name: "Milo Food Drink Chocolate Tetra 180ml", image: MiloImg },
    { name: "Kist Jam Mixed Fruit 510g", image: KistJamImg },
    { name: "Krest Chicken Sausages Bockwurst 400g", image: KrestSausageImg },
  ];

  /**
   * Initiates drag operation for an item in the inventory
   * Sets up drag state and data transfer for drop handling
   * @param e - Drag event
   * @param itemInfo - Information about the item
   */
  const handleItemDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    itemInfo: { name: string; image: string }
  ) => {
    const draggedItem: Item = {
      id: uuidv4(), // or any method to generate unique ids
      name: itemInfo.name,
      row: 0,
      col: 0,
      index: 0,
    };

    setDragging({ edge: "", row: 0, col: 0, index: 0 });
    e.dataTransfer.setData("source", "sidebar");
    e.dataTransfer.setData("application/json", JSON.stringify(draggedItem));
  };

  return (
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "12px",
        }}
      >
        Drag items to add to your layout
      </p>
      {/* Grid layout for inventory items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        {inventoryItems.map((selectedFixture, index) => (
          // Individual draggable inventory item
          <div
            key={index}
            draggable
            onDragStart={(e) => handleItemDragStart(e, selectedFixture)}
            onDragEnd={() => setDragging(null)}
            style={{
              padding: "10px",
              backgroundColor: "white",
              color: "#333",
              borderRadius: "8px",
              cursor: "grab",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #eee",
              fontSize: "14px",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={selectedFixture.image}
              alt={selectedFixture.name}
              style={{
                width: "100%",
                height: "80px",
                objectFit: "contain",
                marginBottom: "6px",
              }}
            />
            {selectedFixture.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemMapEditorSidebar;
