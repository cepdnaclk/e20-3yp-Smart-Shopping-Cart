import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FixtureProvider } from "./context/FixtureContext";
import { EdgeProvider } from "./context/EdgeContext";
import { NodeProvider } from "./context/NodeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";
import EditorPage from "./pages/EditorPage";
import AuthPage from "./pages/AuthPage";
import { EditorProvider } from "./context/EditorContext";
import DashboardPage from "./pages/DashboardPage";
import { useAuthContext } from "./hooks/context/useAuthContext";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <EditorProvider>
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
                                                    <EditorPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/dashboard"
                                            element={
                                                <ProtectedRoute>
                                                    <DashboardPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        {/* <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <EditorPage />
                        </ProtectedRoute>
                      }
                    /> */}
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </NodeProvider>
                            </EdgeProvider>
                        </FixtureProvider>
                    </SidebarProvider>
                </EditorProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
