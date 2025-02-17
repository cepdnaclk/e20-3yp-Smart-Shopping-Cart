import { useState } from "react";
import Fixture from "../src/types/Fixture";
import { v4 } from "uuid";

// This is the non optimized version
const useFixture = () => {
    const [items, setItems] = useState<Fixture[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [name, setName] = useState<string>("");

    const addFixture = () => {
        console.log(`Adding fixture`);
        setItems((prevItems) => {
            const newId = v4();
            let newFixture: Fixture;

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

            newFixture = {
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
            return [...prevItems, newFixture];
        });
    };

    const handleFixtureNameChange = (newName: string) => {
        if (selectedId !== null) {
            setName(newName);
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === selectedId ? { ...item, name: newName } : item
                )
            );
        }
    };

    const handlePositionChange = (axis: "x" | "y", value: number) => {
        if (!isNaN(value) && selectedId !== null) {
            setPosition((prevPosition) => {
                const newPosition = { ...prevPosition, [axis]: value };
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === selectedId ? { ...item, [axis]: value } : item
                    )
                );
                return newPosition;
            });
        }
    };    

    const handleDragMoveFixture = (e: any, id: string) => {
        const newX = e.target.x();
        const newY = e.target.y();
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, x: newX, y: newY } : item
            )
        );

        if (id === selectedId) {
            setPosition({ x: newX, y: newY });
        }
    };

    const handleSelectFixture = (id: string) => {
        setSelectedId(id);
        setItems((prevItems) => {
            const selectedItem = prevItems.find((item) => item.id === id);
            if (selectedItem) {
                setPosition({ x: selectedItem.x, y: selectedItem.y });
                setName(selectedItem.name);
            }
            return prevItems;
        });
    };

    const handleDeleteFixture = () => {
        if (selectedId !== null) {
            setItems((prevItems) => prevItems.filter((item) => item.id !== selectedId));
            setSelectedId(null);
            setPosition({ x: 0, y: 0 });
            setName("");
        }
    }; 

    return {
        items,
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
