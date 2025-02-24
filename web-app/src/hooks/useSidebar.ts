import { useState } from "react";

const useSidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return {
    isSidebarVisible,
    toggleSidebar,
    closeSidebar,
  };
};

export default useSidebar;
