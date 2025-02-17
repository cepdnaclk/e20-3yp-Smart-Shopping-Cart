import { useState } from "react";
import Fixture from "../types/Fixture";
import { v4 } from "uuid";

const useFixture = () => {
    const [items, setItems] = useState<Record<string, Fixture>>({});
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [name, setName] = useState<string>("");

    const addFixture = () => {
        console.log(`Adding fixture`);
        const newId = v4();

        let points = [0, 0, 60, 200, 200, 0];

        // Compute centroid
        let sumX = 0,
            sumY = 0,
            pointCount = points.length / 2;
        for (let i = 0; i < points.length; i += 2) {
            sumX += points[i];
            sumY += points[i + 1];
        }
        const centerX = sumX / pointCount;
        const centerY = sumY / pointCount;

        // Adjust points relative to centroid
        points = points.map((p, i) => p - (i % 2 === 0 ? centerX : centerY));

        const newFixture: Fixture = {
            id: newId,
            x: 500,
            y: 500,
            points,
            fill: "lightgreen",
            name: "Fixture",
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        };

        setItems((prevItems) => ({ ...prevItems, [newId]: newFixture }));
    };

    const handleFixtureNameChange = (newName: string) => {
        if (selectedId !== null) {
            setName(newName);
            setItems((prevItems) => ({
                ...prevItems,
                [selectedId]: { ...prevItems[selectedId], name: newName },
            }));
        }
    };

    const handlePositionChange = (axis: "x" | "y", value: number) => {
        if (!isNaN(value) && selectedId !== null) {
            setPosition((prevPosition) => ({ ...prevPosition, [axis]: value }));
            setItems((prevItems) => ({
                ...prevItems,
                [selectedId]: { ...prevItems[selectedId], [axis]: value },
            }));
        }
    };

    const handleDragMoveFixture = (e: any, id: string) => {
        const newX = e.target.x();
        const newY = e.target.y();

        setItems((prevItems) => ({
            ...prevItems,
            [id]: { ...prevItems[id], x: newX, y: newY },
        }));

        if (id === selectedId) {
            setPosition({ x: newX, y: newY });
        }
    };

    const handleSelectFixture = (id: string) => {
        setSelectedId(id);
        setPosition({ x: items[id].x, y: items[id].y });
        setName(items[id].name);
    };

    const handleDeleteFixture = () => {
        if (selectedId !== null) {
            setItems((prevItems) => {
                const newItems = { ...prevItems };
                delete newItems[selectedId];
                return newItems;
            });
            setSelectedId(null);
            setPosition({ x: 0, y: 0 });
            setName("");
        }
    };

    return {
        items: Object.values(items), // Convert back to array for rendering
        setItems,
        selectedId,
        position,
        name,
        addFixture,
        handleFixtureNameChange,
        handlePositionChange,
        handleDragMoveFixture,
        handleSelectFixture,
        handleDeleteFixture,
    };
};

export default useFixture;
