
import { useState } from "react";
import "./AuthWizard.css";

const API_URL = "http://127.0.0.1:8000";

function AuthWizard({
  initialMode = "register",
  onClose,
  onLoginSuccess,
  onForgotPassword,
}) {
  const [isRegister, setIsRegister] = useState(
    initialMode === "register"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(register) {
    setIsRegister(register);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

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

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Something went wrong. Please try again."
        );
        return;
      }

      if (isRegister) {
        setMessage("Account created successfully. Please sign in.");
        setPassword("");
        setConfirmPassword("");
        setIsRegister(false);
        return;
      }

      sessionStorage.setItem("access_token", data.access_token);
      onLoginSuccess();
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage("Unable to connect to FreeForms. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="auth-modal-backdrop"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close authentication"
        >
          ×
        </button>

        <div className="auth-modal-brand">
          <span className="auth-modal-brand-icon">F</span>
          <span>
            free<span>forms</span>
          </span>
        </div>

        <div className="auth-modal-heading">
          <span className="auth-modal-eyebrow">
            YOUR FORMS. SIMPLIFIED.
          </span>

          <h2 id="auth-modal-title">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>

          <p>
            {isRegister
              ? "Get started with your FreeForms workspace."
              : "Sign in to access your workspace."}
          </p>
        </div>

        <div className="auth-modal-tabs">
          <button
            type="button"
            className={!isRegister ? "active" : ""}
            onClick={() => switchMode(false)}
          >
            Sign in
          </button>

          <button
            type="button"
            className={isRegister ? "active" : ""}
            onClick={() => switchMode(true)}
          >
            Create account
          </button>
        </div>

        <form className="auth-modal-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
            </>
          )}

          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="auth-modal-password-heading">
            <label htmlFor="auth-password">Password</label>

            {!isRegister && (
              <button
                type="button"
                className="auth-modal-text-button"
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>
            )}
          </div>

          <div className="auth-modal-password-field">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={isRegister ? 8 : undefined}
              maxLength={128}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {isRegister && (
            <>
              <label htmlFor="auth-confirm-password">
                Confirm password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                maxLength={128}
                required
              />
            </>
          )}

          {message && (
            <p className="auth-modal-message" role="status">
              {message}
            </p>
          )}

          <button
            className="auth-modal-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Sign in"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <p className="auth-modal-switch">
          {isRegister
            ? "Already have an account?"
            : "New to FreeForms?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(!isRegister)}
          >
            {isRegister ? "Sign in" : "Create account"}
          </button>
        </p>

        <div className="auth-modal-footer">
          ◇ Your workspace is protected by secure authentication.
        </div>
      </section>
    </div>
  );
}

export default AuthWizard;
