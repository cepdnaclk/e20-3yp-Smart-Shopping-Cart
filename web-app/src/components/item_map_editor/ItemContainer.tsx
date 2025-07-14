import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Item, ItemContainerProps } from "../../types/Item";
import { useItemContext } from "../../hooks/context/useItemContext";
import styles from "./ItemContainer.module.css"; // Import the CSS Module

/**
 * ItemContainer - Grid-Based Item Organization Component
 *
 * Provides a dynamic grid interface for organizing items within fixture edges.
 * Supports drag-and-drop operations, grid manipulation, and cell selection.
 *
 * Features:
 * - Dynamic row/column management
 * - Drag-and-drop item organization
 * - Cell selection and highlighting
 * - Item removal functionality
 *
 * @component
 * @param {ItemContainerProps} props - Component props
 */

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
        setDragging,
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

    // Get items for this edge or create empty grid structure
    const cells =
        itemMap[edge] ||
        Array.from({ length: rows }, () => Array.from({ length: cols }, () => []));

    return (
        <div className={styles.itemContainerWrapper}>
            {/* Grid control buttons section */}
            <div className={styles.gridControls}>
                {[
                    { label: "Add Row", onClick: () => addRow(edge), disabled: false },
                    {
                        label: "Add Column",
                        onClick: () => selectedCell && addColumn(edge, selectedCell.row),
                        disabled: !selectedCell,
                    },
                    {
                        label: "Remove Row",
                        onClick: () => {
                            if (selectedCell) {
                                removeRow(edge, selectedCell.row);
                                setSelectedCell(null);
                            }
                        },
                        disabled: !selectedCell,
                    },
                    {
                        label: "Remove Column",
                        onClick: () => {
                            if (selectedCell) {
                                removeColumn(edge, selectedCell.row, selectedCell.col);
                                setSelectedCell(null);
                            }
                        },
                        disabled: !selectedCell,
                    },
                ].map((btn, index) => (
                    <button
                        key={index}
                        onClick={btn.onClick}
                        disabled={btn.disabled}
                        className={`${styles.controlButton} ${btn.disabled ? styles.controlButtonDisabled : ''}`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Main grid container with dynamic row sizing */}
            <div
                className={styles.mainGrid}
                style={{
                    // This remains inline because `rows` is a dynamic prop value.
                    gridTemplateRows: `repeat(${cells.length}, 1fr)`,
                }}
            >
                {/* Row iteration with flex layout for columns */}
                {cells.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.gridRow}>
                        {row.map((_, colIndex) => {
                            const isSelected =
                                selectedCell?.row === rowIndex &&
                                selectedCell?.col === colIndex;

                            const cellItems = cells[rowIndex]?.[colIndex] || [];

                            return (
                                // Individual cell with selection highlighting
                                <div
                                    key={colIndex}
                                    onClick={() =>
                                        setSelectedCell({ row: rowIndex, col: colIndex })
                                    }
                                    className={`${styles.gridCell} ${dragging ? styles.gridCellDragging : ''} ${isSelected ? styles.gridCellSelected : ''}`}
                                >
                                    {/* Drop zone for drag-and-drop operations */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => {
                                            console.log(
                                                `Drop event on cell: (${rowIndex}, ${colIndex})`
                                            );
                                            handleDropOnCell(e, edge, rowIndex, colIndex);
                                        }}
                                        className={styles.dropZone}
                                        data-row={rowIndex}
                                        data-col={colIndex}
                                    >
                                        {cellItems.length > 0 ? (
                                            cellItems.map((item: Item, itemIndex: number) => (
                                                // Individual item rendering with drag capabilities
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
                                                            e,
                                                            edge,
                                                            rowIndex,
                                                            colIndex,
                                                            itemIndex
                                                        );
                                                    }}
                                                    onDragEnd={() => setDragging(null)}
                                                    className={styles.gridItem}
                                                >
                                                    <div className={styles.itemName}>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <Trash2
                                                        size={16}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent cell selection when clicking trash
                                                            handleRemoveItem(
                                                                e,
                                                                edge,
                                                                rowIndex,
                                                                colIndex,
                                                                itemIndex
                                                            );
                                                        }}
                                                        className={styles.removeItemIcon}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <span className={styles.dropPlaceholder}>
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