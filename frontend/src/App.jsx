
import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import CreateFormWizard from "./CreateFormWizard";
import ProfileWizard from "./ProfileWizard";
import ForgotPasswordWizard from "./ForgotPasswordWizard";
import LandingPage from "./LandingPage";
import AuthWizard from "./AuthWizard";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(sessionStorage.getItem("access_token")));
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showAuth, setShowAuth] = useState(
    new URLSearchParams(window.location.search).has("token")
  );
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showWizard, setShowWizard] = useState(false);
  const [dashboardVersion, setDashboardVersion] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");


  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const endpoint = isRegister
      ? "/auth/register"
      : "/auth/login";

    const payload = isRegister
      ? {
        name,
        email,
        password,
        cnf_password: confirmPassword,
      }
      : {
        email,
        password,
      };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Something went wrong. Please try again."
        );
        return;
      }

      if (isRegister) {
        setMessage("Account created successfully. Please sign in.");
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      sessionStorage.setItem(
        "access_token",
        data.access_token
      );

      setIsAuthenticated(true);
      return;
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  }


  if (isAuthenticated) {
    const handleLogout = () => {
      sessionStorage.removeItem("access_token");
      setIsAuthenticated(false);
      setIsRegister(false);
      setPassword("");
      setConfirmPassword("");
      setCurrentPage("dashboard");
      setShowWizard(false);
    };


    return (
      <>
        <Dashboard
          key={dashboardVersion}
          onLogout={handleLogout}
          onCreateForm={() => setShowWizard(true)}
          onProfileClick={() => setShowProfile(true)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        {/* Create Form Wizard */}
        {showWizard && (
          <CreateFormWizard
            onClose={() => setShowWizard(false)}
            onCreated={() => {
              setShowWizard(false);
              setDashboardVersion((version) => version + 1);
            }}
          />
        )}

        {/* Profile Wizard */}
        {showProfile && (
          <ProfileWizard
            onClose={() => setShowProfile(false)}
            onLogout={handleLogout}
            onProfileUpdated={() => {
              setDashboardVersion((version) => version + 1);
            }}
          />
        )}
      </>
    );

  }

  return (
    <>
      <LandingPage
        onGetStarted={() => {
          setIsRegister(true);
          setMessage("");
          setShowAuth(true);
        }}
        onSignIn={() => {
          setIsRegister(false);
          setMessage("");
          setShowAuth(true);
        }}
      />

      {showAuth && (
        <AuthWizard
          key={isRegister ? "register" : "login"}
          initialMode={isRegister ? "register" : "login"}
          onClose={() => setShowAuth(false)}
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            setShowAuth(false);
          }}
          onForgotPassword={() => {
            setShowAuth(false);
            setShowForgotPassword(true);
          }}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordWizard
          onClose={() => setShowForgotPassword(false)}
          onBackToLogin={() => {
            setShowForgotPassword(false);
            setIsRegister(false);
            setShowAuth(true);
          }}
        />
      )}
    </>
  );
}
export default App;