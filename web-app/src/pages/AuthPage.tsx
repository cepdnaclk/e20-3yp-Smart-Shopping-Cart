import React from "react";
import AuthBranding from "../components/auth/AuthBranding";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import NotificationBanner from "../components/banners/NotificationBanner";
import { useAuthForm } from "../hooks/UI/useAuthForm";

const AuthPage: React.FC = () => {
  const {
    authMode,
    isLoading,
    error,
    success,
    loginData,
    forgotPasswordData,
    handleLoginChange,
    handleForgotPasswordChange,
    handleLoginSubmit,
    handleForgotPasswordSubmit,
    toggleAuthMode,
  } = useAuthForm();

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#f0f4f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <AuthBranding />
      {/* Right panel with form */}
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0px 8px 32px rgba(0,0,0,0.1)",
            margin: "20px 0",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            {authMode === "login"
              ? "Welcome Back"
              : authMode === "forgot"
              ? "Forgot Password"
              : "Reset Password"}
          </h2>

          {error && <NotificationBanner message={error} type="error" />}
          {success && <NotificationBanner message={success} type="success" />}

          {authMode === "login" && (
            <LoginForm
              formData={loginData}
              onChange={handleLoginChange}
              onSubmit={handleLoginSubmit}
              onForgotPassword={() => toggleAuthMode("forgot")}
              isLoading={isLoading}
            />
          )}

          {authMode === "forgot" && (
            <ForgotPasswordForm
              formData={forgotPasswordData}
              onChange={handleForgotPasswordChange}
              onSubmit={handleForgotPasswordSubmit}
              isLoading={isLoading}
            />
          )}

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              fontSize: "15px",
              color: "rgba(153, 153, 153, 1)",
            }}
          >
            {authMode === "forgot" && (
              <>
                Remembered your password?
                <button
                  onClick={() => toggleAuthMode("login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2a41e8",
                    fontWeight: "600",
                    cursor: "pointer",
                    padding: "0 8px",
                    fontSize: "15px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#1e30c2";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#2a41e8";
                  }}
                >
                  Back to login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
