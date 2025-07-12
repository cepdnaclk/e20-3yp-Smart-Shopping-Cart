import React from "react";
import { ItemProvider } from "../context/ItemContext";
import DashboardManager from "../components/dashboard/DashboardManager";

/**
 * DashboardPage - Grid-Based Item Organization Interface
 *
 * Full-screen overlay interface for organizing items within fixture edges.
 * Only renders when an edge is selected and item map editor is active.
 *
 * @component
 */

const DashboardPage: React.FC = () => {
    return (
        <ItemProvider>
            <DashboardManager />
        </ItemProvider>
    );
};

export default DashboardPage;
