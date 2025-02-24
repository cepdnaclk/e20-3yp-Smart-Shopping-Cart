// App.tsx
import React from "react";
import LayoutEditor from "./features/editor/LayoutEditor";
import { FixtureProvider } from "./context/FixtureContext";
import { EdgeProvider } from "./context/EdgeContext";
import { NodeProvider } from "./context/NodeContext";

const App: React.FC = () => {
  return (
    <div>
      <FixtureProvider>
        <EdgeProvider>
          <NodeProvider>
            <LayoutEditor />
          </NodeProvider>
        </EdgeProvider>
      </FixtureProvider>
    </div>
  );
};

export default App;
