import React from "react";
import { saveLayoutData } from "../../utils/SaveData";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEdgeContext } from "../../hooks/context/useEdgeContext";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useItemContext } from "../../hooks/context/useItemContext";
import { useNodeContext } from "../../hooks/context/useNodeContext";

import styles from './LayoutEditorToolbar.module.css';

/**
 * LayoutEditorToolbar - Layout Editor Action Bar
 *
 * Provides fixture management controls and mode switching for the layout editor.
 * Includes add/delete fixture operations, edit mode toggle, and data persistence.
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

	const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMode = e.target.value;
		setMode(newMode);
		setSelectedEdge(null);
		toggleModes(newMode);
		setSelectedNode(null);
	};

	return (
		<div className={styles.toolbarContainer}>
			{/* Add fixture button */}
			<button
				onClick={addFixture}
				className={styles.addButton}
				title="Add Fixture"
			>
				<Plus size={16} color="rgb(102, 102, 102)" strokeWidth={2} />
			</button>

			{/* Delete fixture button */}
			<button
				onClick={deleteFixture}
				disabled={selectedFixtureId === null}
				className={`${styles.deleteButton} ${selectedFixtureId === null ? styles.disabled : ''}`}
				title="Delete Selected"
			>
				<Trash2
					size={15}
					color={selectedFixtureId === null ? "rgba(153, 153, 153, 1)" : "rgb(102, 102, 102)"}
					strokeWidth={2}
				/>
			</button>

			{/* Mode selection dropdown */}
			<select
				title="Select Mode"
				disabled={selectedFixtureId === null}
				value={mode}
				onChange={handleModeChange}
				className={`${styles.modeSelect} ${selectedFixtureId === null ? styles.disabled : ''}`}
			>
				<option id="Object Mode" value="Object Mode">
					Object Mode
				</option>
				<option id="Edit Mode" value="Edit Mode">
					Edit Mode
				</option>
			</select>

			{/* Save changes button */}
			<button
				title="save"
				onClick={() => {
					saveLayoutData(itemMap, fixtures);
				}}
				className={styles.saveButton}
			>
				<Save size={17} color="rgb(102, 102, 102)" strokeWidth={2} />
			</button>
		</div>
	);
};

export default LayoutEditorToolbar;
