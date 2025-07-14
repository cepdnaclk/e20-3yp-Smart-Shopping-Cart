import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { InventoryItem } from "../../types/Item";
import { saveInventoryData } from "../../utils/SaveData";
import { useItemContext } from "../../hooks/context/useItemContext";

import styles from './InventoryEditorToolbar.module.css';
import { useModalContext } from "../../hooks/context/useModalContext";

/**
 * InventoryEditorToolbar - Item Map Editor Action Bar
 *
 * Simplified toolbar for item map editing operations.
 * Provides data persistence functionality with save and clear operations.
 */

const InventoryEditorToolbar: React.FC = () => {
 
    const {products} = useItemContext();

    const {
            openAddForm
        } = useModalContext();

    return (
        <div className={styles.toolbarContainer}>
            <button
                onClick={openAddForm}
                className={styles.addButton}
                title="Add Fixture"
            >
                <Plus size={16} color="rgb(102, 102, 102)" strokeWidth={2} />
            </button>

            <button
                title="save"
                onClick={() => {
                    saveInventoryData(products);
                }}
                className={styles.saveButton}
            >
                <Save size={17} color="rgb(102, 102, 102)" strokeWidth={2} />
            </button>

        </div>
    );
};

export default InventoryEditorToolbar;
