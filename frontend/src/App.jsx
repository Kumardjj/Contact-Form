
import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // We will connect this form to FastAPI next.
    setMessage("Login API integration is our next step.");
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
          New to FreeForms?
          <button
            className="text-link"
            onClick={() => setMessage("Registration UI is coming next.")}
          >
            Create account
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

          <h2>Welcome back</h2>
          <p className="card-description">
            Sign in to access your FreeForms dashboard.
          </p>

          <form onSubmit={handleSubmit}>
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
              <button
                type="button"
                className="text-link small-link"
                onClick={() =>
                  setMessage("Forgot-password UI is coming next.")
                }
              >
                Forgot password?
              </button>
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

            <button className="login-button" type="submit">
              Sign in <span>→</span>
            </button>

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