import React from "react";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { clearStoredData, saveData } from "../../utils/SaveLocal";
import { useItemContext } from "../../hooks/useItemContext";

/**
 * ItemMapEditorToolbar - Item Map Editor Action Bar
 *
 * Simplified toolbar for item map editing operations.
 * Provides data persistence functionality with save and clear operations.
 *
 * @component
 */

const ItemMapEditorToolbar: React.FC = () => {
  const { fixtures } = useFixtureContext();

  const { itemMap } = useItemContext();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Save changes button with data persistence */}
      <button
        onClick={() => {
          saveData(itemMap, fixtures);
        }}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "6px",
          backgroundColor: "#2ecc71",
          color: "white",
          marginRight: "10px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#27ae60")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2ecc71")}
      >
        Save Changes
      </button>

      {/* Clear all data button with confirmation styling */}
      <button
        onClick={() => {
          clearStoredData();
        }}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: 500,
          border: "none",
          borderRadius: "6px",
          backgroundColor: "rgb(238, 56, 0)",
          color: "white",
          cursor: "pointer",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(208, 49, 0)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(238, 56, 0)")
        }
      >
        Clear All
      </button>
    </div>
  );
};

export default ItemMapEditorToolbar;
