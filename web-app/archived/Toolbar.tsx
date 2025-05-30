import React from "react";
import { useEdgeContext } from "../src/hooks/useEdgeContext";
import { useFixtureContext } from "../src/hooks/useFixtureContext";
import { useSidebarContext } from "../src/hooks/useSidebarContext";
import { Menu } from "lucide-react"; // Import icons
import {
  clearStoredData,
  saveData,
} from "../src/utils/SaveLocal";
import { useItemContext } from "../src/hooks/useItemContext";
import { useNodeContext } from "../src/hooks/useNodeContext";

interface ToolbarProps {
  onToggleModes: (mode: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleModes }) => {
  const { setSelectedEdge } = useEdgeContext();
  const { setSelectedNode } = useNodeContext();
  const {
    fixtures,
    selectedFixtureId,
    addFixture,
    deleteFixture,
    mode,
    setMode,
  } = useFixtureContext();
  const { toggleSidebar, isItemMapEditorOpen } = useSidebarContext();
  const { itemMap } = useItemContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value;
    setMode(newMode);
    setSelectedEdge(null);
    onToggleModes(newMode);
    setSelectedNode(null);
  };

  return (
    <div
      style={{
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        height: "40px",
        zIndex: 999,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#333",
      }}
    >
      {/* Left Side: Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        style={{
          padding: "10px",
          backgroundColor: "transparent",
          color: "#333",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 500,
          transition: "background-color 0.2s",
        }}
        title="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Center: Dynamic Title */}
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
        {isItemMapEditorOpen ? "Item Map Editor" : "Layout Editor"}
      </h2>

      {/* Right Side: Dynamic Buttons */}
      {isItemMapEditorOpen ? (
        // Inventory Editor Header Actions
        <div style={{ display: "flex", alignItems: "center" }}>
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
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#27ae60")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#2ecc71")
            }
          >
            Save Changes
          </button>
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
      ) : (
        // Layout Editor Toolbar Actions
        <div style={{ display: "flex", alignItems: "center" }}>
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

          {/* Mode Dropdown */}
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
      )}
    </div>
  );
};

export default Toolbar;
