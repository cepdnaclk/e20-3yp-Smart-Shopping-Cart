import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/smart_shopping_cart_logo-Photoroom.png";

// Define types for our forms
interface LoginFormData {
  storeName: string;
  branch: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  confirmPassword: string;
}

// Hardcoded credentials for login without backend
const DEMO_CREDENTIALS = [
  { storeName: "Cargills", branch: "Angunawela", password: "abcd" },
];

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  // State to toggle between login and signup
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // State for form data
  const [loginData, setLoginData] = useState<LoginFormData>({
    storeName: "",
    branch: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    storeName: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });

  // State for showing errors
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signup form changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  // Handle login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if credentials match any in our hardcoded list
    const validCredential = DEMO_CREDENTIALS.find(
      (cred) =>
        cred.storeName.toLowerCase() === loginData.storeName.toLowerCase() &&
        cred.branch.toLowerCase() === loginData.branch.toLowerCase() &&
        cred.password === loginData.password
    );

    if (validCredential) {
      // Store authentication state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("storeName", validCredential.storeName);
      localStorage.setItem("branch", validCredential.branch);

      setSuccess(
        `Welcome back, ${validCredential.storeName} (${validCredential.branch})!`
      );

      // Navigate to layout editor after successful login
      setTimeout(() => {
        navigate("/editor");
      }, 1000);
    } else {
      setError("Invalid store name, branch, or password.");
    }
  };

  // Handle signup submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if store already exists with the same branch
    const storeExists = DEMO_CREDENTIALS.some(
      (cred) =>
        cred.storeName.toLowerCase() === signupData.storeName.toLowerCase() &&
        cred.branch.toLowerCase() === signupData.branch.toLowerCase()
    );

    if (storeExists) {
      setError("A store with this name and branch already exists.");
      return;
    }

    // Success message
    setSuccess("Store registered successfully! You can now log in.");

    // Switch to login view after successful signup
    setTimeout(() => {
      setIsLogin(true);
      setLoginData({
        storeName: signupData.storeName,
        branch: signupData.branch,
        password: "",
      });
    }, 1000);
  };

  return (
    <div
      style={{
        width: "100vw", // Ensure full screen width
        height: "100vh", // Ensure full screen height
        display: "flex",
        backgroundColor: "#f0f4f8",
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Left panel with image/branding */}
      <div
        style={{
          flex: "1",
          backgroundColor: "#2a41e8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          color: "white",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // center the group
            marginBottom: "20px",
            whiteSpace: "nowrap", // prevent title wrapping
            gap: "12px", // space between image and title
          }}
        >
          <img
            src={Logo}
            alt={"logo"}
            style={{
              width: "100%",
              height: "80px",
              objectFit: "contain",
              marginBottom: "6px",
            }}
          />
          <span
            style={{
              fontSize: "35px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Smart Shopping Cart
          </span>
        </div>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "30px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Design your store layout to enhance the shopping experience with smart
          navigation.
        </p>

        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "25px",
            borderRadius: "10px",
            marginTop: "20px",
            width: "80%",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            Why use Smart Shopping Cart?
          </h3>
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
              margin: "0",
            }}
          >
            <li
              style={{
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: "#4cd964",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              Optimize customer navigation
            </li>
            <li
              style={{
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: "#4cd964",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              Reduce shopping time
            </li>
            <li
              style={{
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: "#4cd964",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              Improve customer satisfaction
            </li>
            <li
              style={{
                marginBottom: "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: "#4cd964",
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
              Increase sales through smart product placement
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel with form */}
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            {isLogin ? "Store Login" : "Register Your Store"}
          </h2>

          {/* Error and success messages */}
          {error && (
            <div
              style={{
                backgroundColor: "#ffebee",
                color: "#e53935",
                padding: "12px 15px",
                borderRadius: "5px",
                marginBottom: "20px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: "#e8f5e9",
                color: "#43a047",
                padding: "12px 15px",
                borderRadius: "5px",
                marginBottom: "20px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {success}
            </div>
          )}

          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={loginData.storeName}
                  onChange={handleLoginChange}
                  placeholder="Enter your store name"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Location/Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={loginData.branch}
                  onChange={handleLoginChange}
                  placeholder="Enter branch or location"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#2a41e8",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  marginTop: "10px",
                }}
              >
                Login
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={signupData.storeName}
                  onChange={handleSignupChange}
                  placeholder="Enter your store name"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Location/Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={signupData.branch}
                  onChange={handleSignupChange}
                  placeholder="Enter branch or location"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Create a password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#555",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm your password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "16px",
                    border: "1px solid #dde2e5",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#2a41e8",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  marginTop: "10px",
                }}
              >
                Register Store
              </button>
            </form>
          )}

          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              fontSize: "14px",
              color: "#666",
            }}
          >
            {isLogin
              ? "Don't have a store account?"
              : "Already have a store account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#2a41e8",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "0 5px",
                fontSize: "14px",
              }}
            >
              {isLogin ? "Register Now" : "Login Now"}
            </button>
          </div>

          {/* Demo credentials */}
          {isLogin && (
            <div
              style={{
                marginTop: "25px",
                padding: "15px",
                backgroundColor: "#e3f2fd",
                borderRadius: "5px",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#1976d2",
                }}
              >
                Demo Credentials:
              </div>
              {DEMO_CREDENTIALS.map((cred, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom:
                      index === DEMO_CREDENTIALS.length - 1 ? "0" : "5px",
                  }}
                >
                  <strong>Store:</strong> {cred.storeName},{" "}
                  <strong>Branch:</strong> {cred.branch},{" "}
                  <strong>Password:</strong> {cred.password}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
