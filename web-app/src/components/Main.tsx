import React from "react";
import Toolbar from "./toolbar/Toolbar";
import Sidebar from "./sidebar/Sidebar";
import { useSidebarContext } from "../hooks/useSidebarContext";
import { useFixtureContext } from "../hooks/useFixtureContext";
import LayoutEditor from "./layout_editor/LayoutEditor";
import InventoryEditor from "./inventory_editor/InventoryEditor";
import { ItemProvider } from "../context/ItemContext";

const Main: React.FC = () => {
  const { toggleEditMode } = useFixtureContext();
  const { isSidebarVisible, isInventoryOpen } = useSidebarContext();

  return (
    <ItemProvider>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Toolbar onToggleMode={toggleEditMode} />

        {isSidebarVisible && <Sidebar />}

        <LayoutEditor />

        {isInventoryOpen && <InventoryEditor />}
      </div>
    </ItemProvider>
  );
};

export default Main;
