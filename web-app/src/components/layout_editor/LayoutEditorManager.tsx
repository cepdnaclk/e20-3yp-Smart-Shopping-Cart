import React, { useState, useEffect } from "react";
import { Stage, Layer, Text, Arrow } from "react-konva";
import FixtureComp from "./canvas/FixtureComp";
import { useFixtureContext } from "../../hooks/context/useFixtureContext";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { loadFixtureLayout } from "../../utils/LoadData";
import styles from "./LayoutEditorManager.module.css"; // Import the CSS Module

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
 * @component
 */

const LayoutEditorManager: React.FC = () => {
    const { profile, isAuthenticated } = useAuthContext();
    const { fixtures, setFixtures } = useFixtureContext();

    // Load fixtures on component mount or authentication state change
    useEffect(() => {
        const loadFixtures = async () => {
            // Ensure profile and role are defined and match MANAGER
            if (profile?.role === "MANAGER") {
                try {
                    const loadedLayout = await loadFixtureLayout(profile.storeName || '');
                    console.log("Initial fixtures loaded:", loadedLayout);
                    setFixtures(loadedLayout || {});
                } catch (error) {
                    console.error("Error loading fixtures:", error);
                }
            }
        };

        // Load fixtures only if authenticated
        if (isAuthenticated) {
            loadFixtures();
        }
    }, [isAuthenticated, profile?.storeName, profile?.role, setFixtures]); // Added setFixtures to dependencies for completeness

    const [dimensions, setDimensions] = useState({
        // Initialize dimensions safely for SSR or initial render
        width: typeof window !== "undefined" ? window.innerWidth : 800,
        height: typeof window !== "undefined" ? window.innerHeight - 50 : 600,
    });

    // Handle window resize to update canvas dimensions
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 50, // Subtract 50px for toolbar/header
            });
        };

        window.addEventListener("resize", handleResize);
        // Clean up event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    return (
        <div className={styles.layoutEditorContainer}>
            {/* Main canvas container with top margin to account for fixed toolbar */}
            <div className={styles.canvasWrapper}>
                <Stage
                    // Keying stage by fixtures length forces re-render if fixtures count changes
                    key={Object.keys(fixtures).length}
                    width={dimensions.width}
                    height={dimensions.height}
                    className={styles.konvaStage} // Apply Konva stage specific styles
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