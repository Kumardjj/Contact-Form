
import { useState } from "react";
import "./ForgotPasswordWizard.css";

const API_URL = "http://127.0.0.1:8000";

function ForgotPasswordWizard({ onClose, onBackToLogin }) {
    const tokenFromUrl = new URLSearchParams(
        window.location.search
    ).get("token");

    const [resetToken] = useState(tokenFromUrl || "");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleForgotPassword(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.detail ||
                    data?.message ||
                    "Unable to process your request."
                );
            }

            setSuccess(
                data?.message ||
                "If an account with that email exists, a password reset link has been sent."
            );
        } catch (err) {
            setError(
                err?.message || "Could not connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!resetToken) {
            setError("The reset link is missing its token.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Your new password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: resetToken,
                        new_password: newPassword,
                        confirm_password: confirmPassword,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to reset your password."
                );
            }

            setSuccess(
                data.message || "Password reset successfully."
            );
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(
                err.message || "Could not connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    const isResetMode = Boolean(resetToken);

    return (
        <div className="forgot-backdrop">
            <section
                className="forgot-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="forgot-title"
            >
                <button
                    type="button"
                    className="forgot-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                <div className="forgot-icon">
                    {isResetMode ? "🔐" : "✉"}
                </div>

                <h2 id="forgot-title">
                    {isResetMode
                        ? "Create a new password"
                        : "Forgot your password?"}
                </h2>

                <p className="forgot-description">
                    {isResetMode
                        ? "Choose a new password for your FreeForms account."
                        : "Enter your account email and we'll send you a password reset link if the account exists."}
                </p>

                {error && (
                    <div className="forgot-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="forgot-message success">
                        {success}
                    </div>
                )}

                {isResetMode ? (
                    <form onSubmit={handleResetPassword}>
                        <label className="forgot-label">
                            New password
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                                minLength={8}
                                required
                                placeholder="At least 8 characters"
                            />
                        </label>

                        <label className="forgot-label">
                            Confirm new password
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                minLength={8}
                                required
                                placeholder="Enter password again"
                            />
                        </label>

                        <button
                            type="submit"
                            className="forgot-primary"
                            disabled={loading || Boolean(success)}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset password"}
                        </button>

                        {success && (
                            <button
                                type="button"
                                className="forgot-secondary"
                                onClick={onBackToLogin}
                            >
                                Back to login
                            </button>
                        )}
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <label className="forgot-label">
                            Email address
                            <input
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                                placeholder="you@example.com"
                            />
                        </label>

                        <button
                            type="submit"
                            className="forgot-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send reset link"}
                        </button>
                    </form>
                )}

                {!isResetMode && (
                    <button
                        type="button"
                        className="forgot-secondary"
                        onClick={onBackToLogin}
                    >
                        Back to login
                    </button>
                )}
            </section>
        </div>
    );
}

export default ForgotPasswordWizard;
