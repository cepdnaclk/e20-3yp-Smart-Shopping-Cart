import React, { useState } from "react";
import { useItemContext } from "../../hooks/useItemContext";
import { Trash2 } from "lucide-react";
import Item from "../../types/Item";

interface ItemContainerProps {
  rows?: number;
  cols?: number;
  edge: string;
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  rows = 0,
  cols = 0,
  edge,
}) => {
  const {
    itemMap,
    handleDropOnCell,
    handleDragStart,
    dragging,
    handleRemoveItem,
    handleDragOver,
    addRow,
    addColumn,
    removeRow,
    removeColumn,
  } = useItemContext();

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Get the items for this edge, or create an empty structure if not found
  const cells =
    itemMap[edge] ||
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => []));

  return (
    <div style={{ width: "100%" }}>
      {/* === Grid Controls Section === */}
      <div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  }}
>
  {[
    { label: "Add Row", onClick: () => addRow(edge), disabled: false },
    {
      label: "Add Column",
      onClick: () => selectedCell && addColumn(edge, selectedCell.row),
      disabled: !selectedCell,
    },
    {
      label: "Remove Row",
      onClick: () => selectedCell && removeRow(edge, selectedCell.row),
      disabled: !selectedCell,
    },
    {
      label: "Remove Column",
      onClick: () =>
        selectedCell &&
        removeColumn(edge, selectedCell.row, selectedCell.col),
      disabled: !selectedCell,
    },
  ].map((btn, index) => (
    <button
      key={index}
      onClick={btn.onClick}
      disabled={btn.disabled}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: btn.disabled ? "#e0e0e0" : "#4A90E2",
        color: btn.disabled ? "#9e9e9e" : "#fff",
        fontWeight: 500,
        fontSize: "14px",
        cursor: btn.disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s, transform 0.2s",
        boxShadow: btn.disabled ? "none" : "0 2px 6px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        if (!btn.disabled) e.currentTarget.style.backgroundColor = "#357ABD";
      }}
      onMouseLeave={(e) => {
        if (!btn.disabled) e.currentTarget.style.backgroundColor = "#4A90E2";
      }}
      onMouseDown={(e) => {
        if (!btn.disabled) e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        if (!btn.disabled) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {btn.label}
    </button>
  ))}
</div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: "16px",
        }}
      >
       {cells.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "16px" }}>
           {row.map((_, colIndex) => {
              const isSelected =
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex;

              const cellItems = cells[rowIndex]?.[colIndex] || [];

              return (
                <div
                  key={colIndex}
                  onClick={() =>
                    setSelectedCell({ row: rowIndex, col: colIndex })
                  }
                  style={{
                    width: "100%",
                    backgroundColor: isSelected ? "#e6f7ff" : "#ffffff",
                    color: "#333",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow:
                      "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${isSelected ? "#1890ff" : "#e8e8e8"}`,
                    flexDirection: "column",
                    padding: "16px",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      console.log(
                        `Drop event on cell: (${rowIndex}, ${colIndex})`
                      );
                      handleDropOnCell(e, edge, rowIndex, colIndex);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row", // Changed from column to row for horizontal layout
                      flexWrap: "wrap", // Allow wrapping if too many items for one row
                      gap: "8px",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "flex-start", // Align items to the start
                      padding: "12px",
                      borderRadius: "6px",
                      backgroundColor: dragging ? "#f0f7ff" : "#f9f9f9",
                      border: `1px dashed ${dragging ? "#1890ff" : "#d9d9d9"}`,
                      transition: "all 0.2s",
                      overflowX: "auto", // Allow horizontal scrolling if needed
                    }}
                    data-row={rowIndex}
                    data-col={colIndex}
                  >
                    {cellItems.length > 0 ? (
                      cellItems.map((item: Item, itemIndex: number) => (
                        <div
                          key={`${item.id}_${itemIndex}`}
                          draggable
                          onDragStart={(e) => {
                            console.log("Starting drag:", {
                              edge,
                              rowIndex,
                              colIndex,
                              itemIndex,
                              id: item.id,
                            });
                            handleDragStart(
                              edge,
                              rowIndex,
                              colIndex,
                              itemIndex,
                              e
                            );
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            backgroundColor: "rgb(0, 192, 226)",
                            color: "white",
                            borderRadius: "6px",
                            fontSize: "14px",
                            cursor: "grab",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            maxWidth: "200px", // Set a max width to prevent one item from taking too much space
                            minWidth: "120px", // Minimum width for better appearance
                            userSelect: "none",
                            transition:
                              "transform 0.15s ease, box-shadow 0.15s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 6px rgba(0, 0, 0, 0.1)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 4px rgba(0, 0, 0, 0.1)";
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              maxWidth: "80%", // Allow text to take most of the space
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap", // Prevent text from wrapping
                            }}
                          >
                            <span>{item.name}</span>
                          </div>
                          <Trash2
                            size={16}
                            onClick={(e) =>
                              handleRemoveItem(
                                edge,
                                rowIndex,
                                colIndex,
                                itemIndex,
                                e
                              )
                            }
                            style={{ cursor: "pointer", flexShrink: 0 }}
                          />
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "#aaa", fontSize: "14px" }}>
                        Drop items here
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemContainer;
