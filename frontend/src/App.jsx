
import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import CreateFormWizard from "./CreateFormWizard";
import ProfileWizard from "./ProfileWizard";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(sessionStorage.getItem("access_token")));
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
        `http://127.0.0.1:8000${endpoint}`,
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
    <main className="login-page">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <nav className="top-nav">
        <a className="brand" href="/">
          <span className="brand-icon">F</span>
          <span>free<span className="brand-highlight">forms</span></span>
        </a>


        <div className="nav-text">
          {isRegister ? "Already have an account?" : "New to FreeForms?"}

          <button
            type="button"
            className="text-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setPassword("");
              setConfirmPassword("");
            }}
          >
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </div>
      </nav>

      <section className="login-container">
        <div className="welcome-text">
          <span className="eyebrow">
            <span className="status-dot"></span>
            YOUR FORMS. SIMPLIFIED.
          </span>

          <h1>
            Forms made
            <br />
            <span>effortless.</span>
          </h1>

          <p className="welcome-description">
            Collect messages, manage submissions, and
            keep your business connected — all in one place.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span className="feature-check">✓</span>
              Simple form integration
            </div>
            <div className="feature">
              <span className="feature-check">✓</span>
              Smart spam protection
            </div>
            <div className="feature">
              <span className="feature-check">✓</span>
              Email notifications
            </div>
          </div>

          <div className="mini-card">
            <div className="mini-card-icon">↗</div>
            <div>
              <strong>One endpoint. Endless possibilities.</strong>
              <p>Connect your website in minutes.</p>
            </div>
            <span className="mini-card-arrow">→</span>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-heading">
            <div className="card-symbol">↗</div>
            <div className="card-label">YOUR WORKSPACE</div>
          </div>

          <h2>{isRegister ? "Create Your Account" : "Welcome back"}</h2>
          <p className="card-description">
            {isRegister
              ? "Join FreeForms and simplify your contact forms."
              : "Sign in to access your FreeForms dashboard."}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </>
            )}
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  className="text-link small-link"
                  onClick={() =>
                    setMessage("Forgot-password UI is coming next.")
                  }
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {isRegister && (
              <>
                <label htmlFor="confirmPassword" style={{ marginTop: 20 }}>
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                />
              </>
            )}

            <button className="login-button" type="submit">
              {isRegister ? "Create account" : "Sign in"}
              <span>→</span>
            </button>

            <p className="auth-switch">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                {isRegister ? "Sign in" : "Create account"}
              </button>
            </p>

            {message && (
              <p className="form-message" role="status">
                {message}
              </p>
            )}
          </form>

          <div className="card-footer">
            <span className="footer-lock">◇</span>
            Your workspace is protected by secure authentication.
          </div>
        </div>
      </section>

      <footer className="page-footer">
        <span>© 2026 FreeForms</span>
        <span>Built for businesses that move forward.</span>
      </footer>
    </main>
  );
}

export default App;