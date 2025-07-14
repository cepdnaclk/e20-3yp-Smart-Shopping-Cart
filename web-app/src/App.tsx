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
import { ModalProvider } from "./context/ModalContext";
import { ItemProvider } from "./context/ItemContext";
import CartEntryPage from "./pages/CartEntryPage";

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
                                                    <ItemProvider>
                                                        <ModalProvider>
                                                            <EditorPage />
                                                        </ModalProvider>
                                                    </ItemProvider>
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
                                        <Route
                                            path="/counter"
                                            element={
                                                <ProtectedRoute>
                                                    <CartEntryPage />
                                                </ProtectedRoute>
                                            }
                                        />
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
