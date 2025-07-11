import React from "react";
import { saveLayoutData } from "../../utils/SaveData";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEdgeContext } from "../../hooks/context/useEdgeContext";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useItemContext } from "../../hooks/context/useItemContext";
import { useNodeContext } from "../../hooks/context/useNodeContext";

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
					border: "2px solid #ddd",
					borderRadius: "6px",
					color: "rgb(102, 102, 102)",
					backgroundColor: "rgb(255, 255, 255)",
					cursor: "pointer",
					fontSize: "14px",
					fontWeight: 500,
					marginRight: "10px",
					transition: "background-color 0.2s",
					display: "flex",
					alignItems: "center",
				}}
				title="Add Fixture"
			>
				<Plus size={16} color="rgb(102, 102, 102)" strokeWidth={2} />
			</button>

			{/* Delete fixture button - disabled when no fixture selected */}
			<button
				onClick={deleteFixture}
				disabled={selectedFixtureId === null}
				style={{
					backgroundColor:
						selectedFixtureId === null
							? "rgb(224, 224, 224)"
							: "rgb(255, 255, 255)",
					color: selectedFixtureId === null ? "rgba(153, 153, 153, 1)" : "rgb(102, 102, 102)",
					border: "2px solid #ddd",
					borderRadius: "6px",
					cursor: selectedFixtureId === null ? "not-allowed" : "pointer",
					fontSize: "14px",
					fontWeight: 500,
					marginRight: "10px",
					transition: "background-color 0.2s",
				}}
				title="Delete Selected"
			>
				<Trash2
					size={15}
					color={selectedFixtureId === null ? "rgba(153, 153, 153, 1)" : "rgb(102, 102, 102)"}
					strokeWidth={2}
				/>
			</button>

			{/* Mode selection dropdown for Object/Edit mode switching */}
			<select
				title="Select Mode"
				disabled={selectedFixtureId === null}
				value={mode}
				onChange={handleModeChange}
				style={{
					padding: "10px 12px",
					fontSize: "14px",
					fontWeight: 500,
					border: "2px solid #ddd",
					borderRadius: "6px",
					color: "rgb(102, 102, 102)",
					backgroundColor:
						selectedFixtureId === null
							? "rgb(224, 224, 224)"
							: "rgb(255, 255, 255)",
					cursor: selectedFixtureId === null ? "not-allowed" : "pointer",
					marginRight: "10px",
				}}
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
        title="Clear All Fixtures and Items"
        onClick={() => {
          clearStoredData();
        }}
        style={{
          padding: "10px 12px",
          fontSize: "14px",
          fontWeight: 500,
          border: "2px solid #ddd",
          borderRadius: "6px",
          color: "rgb(102, 102, 102)",
          backgroundColor: "rgb(255, 255, 255)",
          cursor: "pointer",
        }}
      >
        Clear All
      </button> */}
		</div>
	);
};

export default LayoutEditorToolbar;
