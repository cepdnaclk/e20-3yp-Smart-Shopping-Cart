import React from "react";
import { useEdgeContext } from "../../hooks/useEdgeContext";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { clearStoredData, saveData } from "../../utils/SaveLocal";
import { useItemContext } from "../../hooks/useItemContext";
import { useNodeContext } from "../../hooks/useNodeContext";

/**
 * LayoutEditorToolbar - Layout Editor Action Bar
 *
 * Provides fixture management controls and mode switching for the layout editor.
 * Includes add/delete fixture operations, edit mode toggle, and data persistence.
 *
 * @component
 */

const LayoutEditorToolbar: React.FC = () => {
  const {
    fixtures,
    selectedFixtureId,
    addFixture,
    deleteFixture,
    mode,
    setMode,
    toggleModes,
  } = useFixtureContext();
  const { setSelectedEdge } = useEdgeContext();
  const { setSelectedNode } = useNodeContext();
  const { itemMap } = useItemContext();

  /**
   * Resets selection states when switching modes
   * @param e - Event on selecting from the dropdown
   */
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value;
    setMode(newMode);
    setSelectedEdge(null);
    toggleModes(newMode);
    setSelectedNode(null);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Add fixture button */}
      <button
        onClick={addFixture}
        style={{
          padding: "10px 16px",
          backgroundColor: "rgb(3, 160, 222)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          marginRight: "10px",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
        }}
        title="Add Fixture"
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(2, 141, 196)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(3, 160, 222)")
        }
      >
        Add Fixture
      </button>

      {/* Delete fixture button - disabled when no fixture selected */}
      <button
        onClick={deleteFixture}
        disabled={selectedFixtureId === null}
        style={{
          padding: "10px 16px",
          backgroundColor:
            selectedFixtureId === null
              ? "rgb(224, 224, 224)"
              : "rgb(238, 56, 0)",
          color: selectedFixtureId === null ? "#999" : "white",
          border: "none",
          borderRadius: "6px",
          cursor: selectedFixtureId === null ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 500,
          marginRight: "10px",
          transition: "background-color 0.2s",
        }}
        title="Delete Selected"
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            selectedFixtureId === null
              ? "rgb(224, 224, 224)"
              : "rgb(208, 49, 0)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            selectedFixtureId === null
              ? "rgb(224, 224, 224)"
              : "rgb(238, 56, 0)")
        }
      >
        Delete Fixture
      </button>

      {/* Mode selection dropdown for Object/Edit mode switching */}
      <select
        name="mode-select"
        value={mode}
        onChange={handleModeChange}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: 500,
          border: "2px solid #ddd",
          borderRadius: "6px",
          color: "#676767",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          marginRight: "10px",
        }}
        title="Select Mode"
      >
        <option id="Object Mode" value="Object Mode">
          Object Mode
        </option>
        <option id="Edit Mode" value="Edit Mode">
          Edit Mode
        </option>
      </select>

      {/* Save changes button with data persistence */}
      <button
        onClick={() => {
          saveData(itemMap, fixtures);
        }}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: 500,
          border: "none",
          borderRadius: "6px",
          backgroundColor: "rgb(14, 222, 3)",
          color: "white",
          cursor: "pointer",
          marginRight: "10px",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(10, 195, 0)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(14, 222, 3)")
        }
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

export default LayoutEditorToolbar;
