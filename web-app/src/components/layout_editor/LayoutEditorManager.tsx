import React, { useState, useEffect } from "react";
import { Stage, Layer, Text, Arrow } from "react-konva";
import FixtureComp from "./canvas/FixtureComp";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { loadFixtureLayout } from "../../utils/LoadData";

/**
 * LayoutEditorManager - Canvas-Based Layout Editor
 *
 * Provides a Konva.js-powered canvas for creating and manipulating geometric fixtures.
 * Handles responsive canvas sizing and renders coordinate system visualization.
 *
 * Features:
 * - Real-time canvas resizing
 * - X/Y axis coordinate system
 * - Interactive fixture rendering
 * - Scale-based measurements (40px = 1 meter)
 *
 *  @component
 */

const LayoutEditorManager: React.FC = () => {

    const { profile, isAuthenticated } = useAuthContext();
    const { fixtures, setFixtures } = useFixtureContext();

    useEffect(() => {
        const loadFixtures = async () => {
            if (profile?.storeName != undefined && profile.role === "MANAGER") {
                try {
                    const loadedLayout = await loadFixtureLayout(profile.storeName);
                    console.log("Initial fixtures loaded:", loadedLayout);
                    setFixtures(loadedLayout || {});
                } catch (error) {
                    console.error("Error loading fixtures:", error);
                }
            }
        };

        loadFixtures();
    }, [isAuthenticated]);

    const [dimensions, setDimensions] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 800,
        height: typeof window !== "undefined" ? window.innerHeight - 50 : 600,
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 50,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Main canvas container with top margin to account for fixed toolbar */}
            <div style={{ marginTop: "50px", flex: 1 }}>
                <Stage
                    key={Object.keys(fixtures).length}
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{
                        borderRadius: "10px",
                        background: "rgb(255, 255, 255)",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    {/* Coordinate system layer - X and Y axis arrows for reference */}
                    <Layer>
                        {/* x-Axis Arrow */}
                        <Arrow
                            points={[5, 15, 100, 15]}
                            stroke="rgb(228, 99, 0)"
                            fill="rgb(228, 99, 0)"
                            pointerWidth={8}
                            pointerLength={10}
                            strokeWidth={2}
                        />
                        {/* Y-Axis Arrow */}
                        <Arrow
                            points={[5, 15, 5, 100]}
                            stroke="rgb(0, 228, 30)"
                            fill="rgb(0, 228, 30)"
                            pointerWidth={8}
                            pointerLength={10}
                            strokeWidth={2}
                        />

                        {/* X Label */}
                        <Text
                            x={105}
                            y={11}
                            text="X"
                            fontSize={12}
                            fontStyle="bold"
                            fill="rgba(0, 0, 0, 0.64)"
                        />
                        {/* Y Label */}
                        <Text
                            x={1}
                            y={105}
                            text="Y"
                            fontSize={12}
                            fontStyle="bold"
                            fill="rgba(0, 0, 0, 0.64)"
                        />
                    </Layer>

                    {/* Fixture rendering layer - displays all active fixtures */}
                    <Layer>
                        {Object.values(fixtures).map((fixture) => (
                            <FixtureComp key={fixture.id} fixture={fixture} />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default LayoutEditorManager;
