
import { useEffect, useState } from "react";
import "./ProfileWizard.css";

const API_URL = import.meta.env.VITE_API_URL;

function ProfileWizard({ onClose, onProfileUpdated, onLogout }) {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function apiRequest(path, options = {}) {
        const token = sessionStorage.getItem("access_token");

        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(options.body
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...options.headers,
            },
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            onLogout?.();
            throw new Error("Your session has expired. Please log in again.");
        }

        if (!response.ok) {
            throw new Error(
                data.detail || data.message || "Something went wrong."
            );
        }

        return data;
    }

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            setLoading(true);
            setError("");

            try {
                const data = await apiRequest("/auth/me");

                if (!cancelled) {
                    setName(data.name || "");
                    setEmail(data.email || "");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    async function saveProfile(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim()) {
            setError("Name and email are required.");
            return;
        }

        setSaving(true);

        try {
            const data = await apiRequest("/auth/update-profile", {
                method: "PATCH",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                }),
            });

            setName(data.name || name.trim());
            setEmail(data.email || email.trim().toLowerCase());
            setSuccess(data.message || "Profile updated successfully.");
            onProfileUpdated?.({
                name: data.name || name.trim(),
                email: data.email || email.trim().toLowerCase(),
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function changePassword(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please complete all password fields.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Your new password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        setSaving(true);

        try {
            const data = await apiRequest("/auth/change-password", {
                method: "POST",
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            setSuccess(data.message || "Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    function switchTab(tab) {
        setActiveTab(tab);
        setError("");
        setSuccess("");
    }

    return (
        <div className="profile-backdrop" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}>
            <section
                className="profile-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-title"
            >
                <header className="profile-header">
                    <div className="profile-heading">
                        <div className="profile-icon">
                            {name.trim().charAt(0).toUpperCase() || "U"}
                        </div>

                        <div>
                            <h2 id="profile-title">Account Settings</h2>
                            <p>Manage your profile and security</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="profile-close"
                        onClick={onClose}
                        aria-label="Close account settings"
                    >
                        &times;
                    </button>
                </header>

                <nav className="profile-tabs">
                    <button
                        type="button"
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => switchTab("profile")}
                    >
                        <span>Profile</span>
                    </button>

                    <button
                        type="button"
                        className={activeTab === "security" ? "active" : ""}
                        onClick={() => switchTab("security")}
                    >
                        <span>Security</span>
                    </button>
                </nav>

                <div className="profile-content">
                    {loading ? (
                        <p className="profile-message">
                            Loading your profile...
                        </p>
                    ) : (
                        <>
                            {error && (
                                <div className="profile-alert error">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="profile-alert success">
                                    {success}
                                </div>
                            )}

                            {activeTab === "profile" ? (
                                <form onSubmit={saveProfile}>
                                    <div className="profile-section-title">
                                        <h3>Personal information</h3>
                                        <p>Update your account details below.</p>
                                    </div>

                                    <label className="profile-label">
                                        Full name
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </label>

                                    <label className="profile-label">
                                        Email address
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </label>

                                    <div className="profile-actions">
                                        <button
                                            type="button"
                                            className="profile-secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="profile-primary"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save changes"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={changePassword}>
                                    <div className="profile-section-title">
                                        <h3>Change password</h3>
                                        <p>
                                            Choose a strong password with at
                                            least 8 characters.
                                        </p>
                                    </div>

                                    <label className="profile-label">
                                        Current password
                                        <input
                                            type="password"
                                            autoComplete="current-password"
                                            value={currentPassword}
                                            onChange={(e) =>
                                                setCurrentPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>

                                    <label className="profile-label">
                                        New password
                                        <input
                                            type="password"
                                            autoComplete="new-password"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            minLength={8}
                                            required
                                        />
                                    </label>

                                    <label className="profile-label">
                                        Confirm new password
                                        <input
                                            type="password"
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            minLength={8}
                                            required
                                        />
                                    </label>

                                    <div className="profile-actions">
                                        <button
                                            type="button"
                                            className="profile-secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="profile-primary"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Updating..."
                                                : "Update password"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ProfileWizard;
