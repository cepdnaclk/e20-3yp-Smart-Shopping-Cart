import React, { useEffect } from "react";
import ItemContainer from "./ItemContainer";
import { useEdgeContext } from "../../hooks/context/useEdgeContext";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { useItemContext } from "../../hooks/context/useItemContext";
import { loadItemMap } from "../../utils/LoadData";
import styles from "./ItemMapEditorManager.module.css"; // Import the CSS Module

/**
 * ItemMapEditorManager - Grid-Based Item Organization Interface
 *
 * Full-screen overlay interface for organizing items within fixture edges.
 * Only renders when an edge is selected and item map editor is active.
 *
 * @component
 */

const ItemMapEditorManager: React.FC = () => {
    const { selectedEdge } = useEdgeContext();
    const { selectedFixtureId } = useFixtureContext();
    const { setItemMap } = useItemContext();

    const { profile, isAuthenticated } = useAuthContext();

    useEffect(() => {
        const loadItems = async () => {
            // Ensure profile and role are defined and match MANAGER
            if (profile?.role === "MANAGER") {
                try {
                    const savedMap = await loadItemMap(profile.storeName || '');
                    console.log("Initial item map loaded:", savedMap);
                    setItemMap(savedMap || {}); // Set the loaded map or an empty object
                } catch (error) {
                    console.error("Error loading item map:", error);
                }
            }
        };
        // Load items only if authenticated (prevents unnecessary calls)
        if (isAuthenticated) {
            loadItems();
        }
    }, [isAuthenticated, profile?.storeName, profile?.role, setItemMap]); // Add dependencies for useEffect

    return (
        <div className={styles.itemMapEditorOverlay}>
            {/* Main content area with top margin and scroll capability */}
            <div className={`${styles.itemMapContent} scrollable-area`}> {/* Apply the global scrollable-area class */}
                {/* Conditional rendering - only show when edge is selected */}
                {selectedEdge !== null && (
                    <ItemContainer
                        edge={`${selectedFixtureId}-edge-${selectedEdge / 2}`}
                    />
                )}
            </div>
        </div>
    );
};

export default ItemMapEditorManager;