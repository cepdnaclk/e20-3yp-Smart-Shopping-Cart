/**
 * SidebarManager - Context-Sensitive Sidebar Component
 *
 * Manages sidebar visibility and content based on the current editor mode.
 * Provides different interfaces for layout editing (properties) and item management (inventory).
 *
 * @component
 */

import React from "react";
import { useSidebarContext } from "../../hooks/useSidebarContext";
import LayoutEditorSidebar from "./LayoutEditorSidebar";
import ItemMapEditorSidebar from "./ItemMapEditorSidebar";
import { useEditorContext } from "../../hooks/useEditorContext";
import InventoryEditorSidebar from "./InventoryEditorSidebar";

const SidebarManager: React.FC = () => {
	const { closeSidebar } = useSidebarContext();

	const { activeEditor } = useEditorContext();
	return (
		<div
			style={{
				width: "280px",
				backgroundColor: "#f8f9fa",
				boxShadow: "0 4px 15px rgba(0, 0, 0, 0.28)",
				padding: "16px",
				position: "absolute",
				top: "0",
				left: "0",
				bottom: "0",
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
				color: "#333",
				borderRadius: "0 8px 8px 0",
				overflow: "hidden",
			}}
		>
			{/* Sidebar header with dynamic title and close button */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "20px",
				}}
			>
				<h2
					style={{
						margin: 0,
						fontSize: "18px",
						fontWeight: 600,
					}}
				>
					{activeEditor === "inventory" && "Categories"}

					{activeEditor === "layout" && "Properties"}

					{activeEditor === "itemMap" && "Inventory"}
				</h2>
				<button
					onClick={closeSidebar}
					style={{
						background: "none",
						border: "none",
						color: "rgba(153, 153, 153, 1)",
						cursor: "pointer",
						fontSize: "18px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "32px",
						height: "32px",
						borderRadius: "6px",
						transition: "background-color 0.2s",
					}}
					onMouseOver={(e) =>
						(e.currentTarget.style.backgroundColor = "#f0f0f0")
					}
					onMouseOut={(e) =>
						(e.currentTarget.style.backgroundColor = "transparent")
					}
				>
					✕
				</button>
			</div>

			{/* Dynamic content area - switches between Layout Editor and Item Map Editor sidebar contents */}
			<div style={{ flex: 1 }}>
				{activeEditor === "inventory" && <InventoryEditorSidebar />}

				{activeEditor === "layout" && <LayoutEditorSidebar />}

				{activeEditor === "itemMap" && <ItemMapEditorSidebar />}
			</div>
		</div>
	);
};

export default SidebarManager;
