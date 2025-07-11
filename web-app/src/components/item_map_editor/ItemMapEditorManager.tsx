import React, { useEffect } from "react";
import ItemContainer from "./ItemContainer";
import { useEdgeContext } from "../../hooks/context/useEdgeContext";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { useItemContext } from "../../hooks/context/useItemContext";
import { loadItemMap } from "../../utils/LoadData";

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
            if (profile?.storeName != undefined && profile.role === "MANAGER") {
                try {
                    const savedMap = await loadItemMap(profile.storeName);
                    console.log("Initial item map loaded:", savedMap);
                    setItemMap(savedMap || {});
                } catch (error) {
                    console.error("Error loading item map:", error);
                }
            }
        };
        loadItems();
    }, [isAuthenticated]);

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                background: "rgb(255, 255, 255)",
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                zIndex: 998,
                color: "#333",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Main content area with top margin and scroll capability */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    marginTop: "50px",
                    padding: "20px",
                    background: "rgb(255, 255, 255)",
                    borderRadius: "10px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#aaaaaa #f0f0f0",
                }}
            >
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
