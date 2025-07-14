import React from "react";
import { saveLayoutData } from "../../utils/SaveData";
import { Save } from "lucide-react";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useItemContext } from "../../hooks/context/useItemContext";

import styles from './ItemMapEditorToolbar.module.css';

/**
 * ItemMapEditorToolbar - Item Map Editor Action Bar
 *
 * Simplified toolbar for item map editing operations.
 * Provides data persistence functionality with save and clear operations.
 */

const ItemMapEditorToolbar: React.FC = () => {
  const { fixtures } = useFixtureContext();
  const { itemMap } = useItemContext();

  return (
    <div className={styles.toolbarContainer}>
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

      {/* Uncomment to add Clear All button */}
      {/*
      <button
        onClick={() => {
          clearStoredData();
        }}
        className={styles.clearButton}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(208, 49, 0)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "rgb(238, 56, 0)")
        }
      >
        Clear All
      </button>
      */}
    </div>
  );
};

export default ItemMapEditorToolbar;
