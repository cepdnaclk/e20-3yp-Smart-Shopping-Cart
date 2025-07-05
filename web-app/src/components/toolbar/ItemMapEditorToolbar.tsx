import React from "react";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { saveLayoutData } from "../../utils/SaveData";
import { useItemContext } from "../../hooks/useItemContext";
import { Save } from "lucide-react";

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
        title="save"
        onClick={() => {
          saveLayoutData(itemMap, fixtures);
        }}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: 500,
          border: "2px solid #ddd",
          borderRadius: "6px",
          color: "rgb(102, 102, 102)",
          backgroundColor: "rgb(255, 255, 255)",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        <Save size={17} color="rgb(102, 102, 102)" strokeWidth={2} />
      </button>

      {/* Clear all data button with confirmation styling */}
      {/* <button
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
      </button> */}
    </div>
  );
};

export default ItemMapEditorToolbar;
