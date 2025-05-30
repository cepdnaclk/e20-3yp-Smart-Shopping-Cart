import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FixtureProvider } from "./context/FixtureContext";
import { EdgeProvider } from "./context/EdgeContext";
import { NodeProvider } from "./context/NodeContext";
import { SidebarProvider } from "./context/SidebarContext";
import UIManager from "./components/UIManager";
import AuthPage from "./AuthPage";

// Simple authentication check
const useAuth = () => {
  // In a real app, you would check localStorage/sessionStorage or a state management store
  // This is just a simple example for demonstration
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return { isAuthenticated };
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <FixtureProvider>
          <EdgeProvider>
            <NodeProvider>
              <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route 
                  path="/editor" 
                  element={
                    <ProtectedRoute>
                      <UIManager />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </NodeProvider>
          </EdgeProvider>
        </FixtureProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;