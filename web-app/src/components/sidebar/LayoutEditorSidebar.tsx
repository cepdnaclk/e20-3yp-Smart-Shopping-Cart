import React, { useEffect, useState } from "react";
import { useEdgeContext } from "../../hooks/useEdgeContext";
import { useFixtureContext } from "../../hooks/useFixtureContext";
import { useNodeContext } from "../../hooks/useNodeContext";
import { useEditorContext } from "../../hooks/useEditorContext";

/**
 * LayoutEditorSidebar - Properties Panel for Layout Editing
 *
 * Context-sensitive sidebar panel that shows properties and controls
 * relevant to the current selection in the layout editor.
 *
 * Features:
 * - Edit fixture properties (name, position, color)
 * - Edit selected node position within fixture
 * - Perform advanced operations like adding or deleting nodes on edges
 * - Toggle between editors (Item Map, Inventory)
 *
 * @component
 */

const LayoutEditorSidebar: React.FC = () => {
    // Node-related data and functions from NodeContext
    const { selectedNode, deleteNode, nodePosition, setNodePosition } =
        useNodeContext();

    // Edge-related data and operations from EdgeContext
    const { selectedEdge, handleAddNodeToEdge } = useEdgeContext();

    // Fixture data and handlers from FixtureContext
    const {
        selectedFixtureId,
        fixtures,
        fixtureName,
        fixturePosition,
        setFixtures,
        handleFixtureNameChange,
        handleFixtureColorChange,
        handleFixturePositionChange,
    } = useFixtureContext();

    // Local color state to sync fixture color input with context state
    const [color, setColor] = useState("#ffffff");

    // Editor state and toggling method from EditorContext
    const { activeEditor, toggleEditor } = useEditorContext();

    // Synchronize local color state with selected fixture's color on changes
    useEffect(() => {
        if (selectedFixtureId && fixtures[selectedFixtureId]?.color) {
            setColor(fixtures[selectedFixtureId].color);
        } else {
            setColor("#ffffff");
        }
    }, [selectedFixtureId, fixtures]);

    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-evenly",
            }}
        >
            <div style={{ flex: 1 }}>
                {/* Fixture name input field */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                    }}
                >
                    <label
                        style={{
                            alignSelf: "center",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "rgba(153, 153, 153, 1)",
                        }}
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        value={fixtureName}
                        onChange={(e) => handleFixtureNameChange(e.target.value)}
                        style={{
                            padding: "6px 6px",
                            backgroundColor: "rgb(255, 255, 255)",
                            color: "rgb(0, 0, 0)",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                        }}
                        placeholder="Enter name"
                    />
                </div>

                {/* X Coordinate Input: adapts to selected node or fixture */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                    }}
                >
                    <label
                        style={{
                            alignSelf: "center",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "rgba(153, 153, 153, 1)",
                        }}
                    >
                        X Coordinate
                    </label>
                    <input
                        title="x coordinate of the selected object"
                        style={{
                            padding: "6px 6px",
                            backgroundColor: "rgb(255, 255, 255)",
                            color: "rgb(0, 0, 0)",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                        }}
                        type="number"
                        value={selectedNode != null ? nodePosition.x : fixturePosition.x}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            if (isNaN(newValue)) return; // Prevent updates with NaN

                            if (selectedNode != null && selectedFixtureId != null) {
                                // Update the nodePosition state for sidebar display
                                setNodePosition((prev) => ({ ...prev, x: newValue }));

                                // Update the fixture's points array
                                setFixtures((prevFixtures) => {
                                    const selectedFixture = prevFixtures[selectedFixtureId];
                                    if (!selectedFixture) return prevFixtures;

                                    const relativeX = newValue - selectedFixture.x;

                                    return {
                                        ...prevFixtures,
                                        [selectedFixtureId]: {
                                            ...selectedFixture,
                                            points: selectedFixture.points.map((p, i) =>
                                                i === selectedNode * 2 ? relativeX : p
                                            ),
                                        },
                                    };
                                });
                            } else {
                                handleFixturePositionChange("x", newValue);
                            }
                        }}
                    />
                </div>

                {/* Y Coordinate Input: adapts to selected node or fixture */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                    }}
                >
                    <label
                        style={{
                            alignSelf: "center",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "rgba(153, 153, 153, 1)",
                        }}
                    >
                        Y Coordinate
                    </label>
                    <input
                        title="y coordinate of the selected object"
                        style={{
                            padding: "6px 6px",
                            backgroundColor: "rgb(255, 255, 255)",
                            color: "rgb(0, 0, 0)",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                        }}
                        type="number"
                        value={selectedNode != null ? nodePosition.y : fixturePosition.y}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            if (isNaN(newValue)) return; // Prevent updates with NaN

                            if (selectedNode != null && selectedFixtureId != null) {
                                // Update the nodePosition state for sidebar display
                                setNodePosition((prev) => ({ ...prev, y: newValue }));

                                // Update the fixture's points array
                                setFixtures((prevFixtures) => {
                                    const selectedFixture = prevFixtures[selectedFixtureId];
                                    if (!selectedFixture) return prevFixtures;

                                    const relativeY = newValue - selectedFixture.y;

                                    return {
                                        ...prevFixtures,
                                        [selectedFixtureId]: {
                                            ...selectedFixture,
                                            points: selectedFixture.points.map((p, i) =>
                                                i === selectedNode * 2 + 1 ? relativeY : p
                                            ),
                                        },
                                    };
                                });
                            } else {
                                handleFixturePositionChange("y", newValue);
                            }
                        }}
                    />
                </div>

                {/* Color picker for fixture appearance */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                    }}
                >
                    <label
                        style={{
                            alignSelf: "center",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "rgba(153, 153, 153, 1)",
                        }}
                    >
                        Color
                    </label>
                    <input
                        title="color_picker"
                        type="color"
                        value={color}
                        onChange={(e) => {
                            setColor(e.target.value);
                            handleFixtureColorChange(e.target.value);
                        }}
                        style={{
                            backgroundColor: "rgb(255, 255, 255)",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                        }}
                    />
                </div>

                {/* Advanced operations section */}
                <div style={{ marginBottom: "8px" }}>
                    {/* Add node to selected edge button */}
                    <button
                        onClick={() => {
                            if (selectedEdge !== null) {
                                handleAddNodeToEdge(selectedEdge);
                            }
                        }}
                        disabled={selectedEdge === null}
                        style={{
                            width: "100%",
                            padding: "10px 0",
                            backgroundColor: selectedEdge === null ? "rgb(224, 224, 224)" : "rgba(0, 111, 222, 0.8)",
                            color: selectedEdge === null ? "rgba(153, 153, 153, 1)" : "rgb(255, 255, 255)",
                            border: "none",
                            borderRadius: "6px",
                            cursor: selectedEdge === null ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: 500,
                            marginBottom: "10px",
                            transition: "background-color 0.2s",
                        }}
                    >
                        Add Node to Edge
                    </button>

                    {/* Delete selected node button */}
                    <button
                        onClick={() => {
                            if (selectedNode !== null && selectedFixtureId != null) {
                                deleteNode(selectedFixtureId, setFixtures);
                            }
                        }}
                        disabled={selectedNode === null || selectedFixtureId === null}
                        style={{
                            width: "100%",
                            padding: "10px 0",
                            backgroundColor:
                                selectedNode === null || selectedFixtureId === null
                                    ? "rgb(224, 224, 224)"
                                    : "rgba(0, 111, 222, 0.8)",
                            color:
                                selectedNode === null || selectedFixtureId === null
                                    ? "rgba(153, 153, 153, 1)"
                                    : "rgb(255, 255, 255)",
                            border: "none",
                            borderRadius: "6px",
                            cursor:
                                selectedNode === null || selectedFixtureId === null
                                    ? "not-allowed"
                                    : "pointer",
                            fontSize: "14px",
                            fontWeight: 500,
                            marginBottom: "10px",
                            transition: "background-color 0.2s",
                        }}
                    >
                        Delete Node
                    </button>
                </div>
            </div>

            {/* Footer with buttons to toggle editors */}
            <div
                style={{
                    flex: 1,
                    flexDirection: "column",
                    alignContent: "flex-end",
                }}
            >
                {/* Button to open Layout Editor */}
                <button
                    onClick={() => toggleEditor("itemMap")}
                    disabled={selectedEdge === null}
                    style={{
                        width: "100%",
                        padding: "10px 0",
                        backgroundColor:
                            selectedEdge === null ? "rgb(224, 224, 224)" : "rgb(3, 160, 222)",
                        color: selectedEdge === null ? "rgba(153, 153, 153, 1)" : "rgb(255, 255, 255)",
                        borderRadius: "6px",
                        cursor: selectedEdge === null ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "10px",
                        transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = selectedEdge === null
                            ? "rgb(224, 224, 224)"
                            : "rgb(2, 141, 196)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = selectedEdge === null
                            ? "rgb(224, 224, 224)"
                            : "rgb(3, 160, 222)";
                    }}
                >
                    {"Open Item Map Editor"}
                </button>

                {/* Button to open Inventory Editor */}
                <button
                    onClick={() => toggleEditor("inventory")}
                    style={{
                        width: "100%",
                        padding: "10px 0",
                        color: "rgb(255, 255, 255)",
                        backgroundColor: "rgb(3, 160, 222)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgb(2, 141, 196)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "rgb(3, 160, 222)";
                    }}
                >
                    {"Open Inventory Editor"}
                </button>
            </div>
        </div>
    );
};

export default LayoutEditorSidebar;
