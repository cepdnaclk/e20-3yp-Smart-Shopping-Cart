import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FixtureProvider } from "./context/FixtureContext";
import { EdgeProvider } from "./context/EdgeContext";
import { NodeProvider } from "./context/NodeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UIManager from "./components/UIManager";
import AuthPage from "./AuthPage";
import { EditorProvider } from "./context/EditorContext";

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
      <EditorProvider>
        <SidebarProvider>
          <FixtureProvider>
            <EdgeProvider>
              <NodeProvider>
                <AuthProvider>
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
                    {/* <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <UIManager />
                        </ProtectedRoute>
                      }
                    /> */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AuthProvider>
              </NodeProvider>
            </EdgeProvider>
          </FixtureProvider>
        </SidebarProvider>
      </EditorProvider>
    </BrowserRouter>
  );
};

export default App;
