import React from "react";
import { useShelfContext } from "../../hooks/useShelfContext";
import { Plus, Trash2, Save } from "lucide-react";
import { useItemContext } from "../../hooks/useItemContextt";

const shelvesPerSide = 5;

const ShelfList: React.FC = () => {
  const { selectedSide, selectedShelf, setSelectedShelf } = useShelfContext();
  const {
    itemsPerShelf,
    handleDragStart,
    handleDropOnRow,
    dragging,
    setDragging,
    addRow,
    removeRow,
    saveConfiguration,
  } = useItemContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      {Array.from({ length: shelvesPerSide }, (_, shelfIndex) => (
        <div
          key={shelfIndex}
          onClick={() => setSelectedShelf(shelfIndex)}
          style={{
            width: "90%",
            padding: "12px",
            backgroundColor: selectedShelf === shelfIndex ? "#cce5ff" : "#ffffff",
            color: "#333333",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>Shelf {shelfIndex + 1}</h4>

          {itemsPerShelf[selectedSide][shelfIndex].map((row, rowIndex) => (
            <div
              key={rowIndex}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnRow(e, selectedSide, shelfIndex, rowIndex)}
              style={{
                display: "flex",
                gap: "8px",
                padding: "10px",
                marginTop: "8px",
                backgroundColor: dragging ? "#e6f7ff" : "#f5f5f5",
                borderRadius: "6px",
                minHeight: "40px",
                alignItems: "center",
                justifyContent: "flex-start",
                transition: "background 0.2s",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <strong style={{ color: "#333333" }}>Row {rowIndex + 1}:</strong>

              {row.length > 0 ? (
                row.map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    draggable
                    onDragStart={() => handleDragStart(shelfIndex, rowIndex, itemIndex)}
                    onDragEnd={() => setDragging(null)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#3498db",
                      color: "white",
                      borderRadius: "5px",
                      fontSize: "14px",
                      cursor: "grab",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span style={{ color: "#aaa" }}>Drop items here</span>
              )}

              {/* Remove Row Button */}
              <button
                onClick={() => removeRow(selectedSide, shelfIndex, rowIndex)}
                disabled={itemsPerShelf[selectedSide][shelfIndex].length <= 1}
                style={{
                  marginLeft: "auto",
                  padding: "5px",
                  fontSize: "14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: itemsPerShelf[selectedSide][shelfIndex].length <= 1 ? "#cccccc" : "#e74c3c",
                  transition: "color 0.2s",
                }}
                title="Remove Row"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {/* Add Row Button */}
          <button
            onClick={() => addRow(selectedSide, shelfIndex)}
            style={{
              marginTop: "10px",
              padding: "8px",
              fontSize: "14px",
              background: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.2s",
            }}
          >
            <Plus size={16} /> Add Row
          </button>
        </div>
      ))}

      {/* Save Configuration Button */}
      <button
        onClick={saveConfiguration}
        style={{
          marginTop: "20px",
          padding: "12px",
          fontSize: "16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "background 0.2s",
        }}
      >
        <Save size={18} /> Save Layout
      </button>
    </div>
  );
};

export default ShelfList;
