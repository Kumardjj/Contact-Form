
import { useEffect, useState } from "react";
import "./Dashboard.css";


const API_URL = "http://127.0.0.1:8000";

function Dashboard({ onLogout, onCreateForm, onProfileClick }) {
    const [user, setUser] = useState(null);
    const [forms, setForms] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            const token = sessionStorage.getItem("access_token");

            if (!token) {
                onLogout();
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            try {
                const [userResponse, formsResponse, submissionsResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/auth/me`, { headers }),
                        fetch(`${API_URL}/forms/`, { headers }),
                        fetch(
                            `${API_URL}/submissions/?page=1&limit=10`,
                            { headers }
                        ),
                    ]);

                if (
                    [userResponse, formsResponse, submissionsResponse].some(
                        (response) => response.status === 401
                    )
                ) {
                    onLogout();
                    return;
                }

                if (
                    !userResponse.ok ||
                    !formsResponse.ok ||
                    !submissionsResponse.ok
                ) {
                    throw new Error(
                        "Could not load dashboard data. Check your backend endpoints."
                    );
                }

                const [userData, formsData, submissionsData] =
                    await Promise.all([
                        userResponse.json(),
                        formsResponse.json(),
                        submissionsResponse.json(),
                    ]);

                setUser(userData);
                setForms(formsData);
                setSubmissions(submissionsData);
            } catch (err) {
                setError(err.message || "Unable to connect to FreeForms.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [onLogout]);

    if (loading) {
        return <div className="dashboard-loading">Loading FreeForms...</div>;
    }

    return (
        <div className="dashboard-shell">
            <aside className="dashboard-sidebar">
                <a className="brand" href="#">
                    <span className="brand-icon">F</span>
                    <span>
                        free<span className="brand-highlight">forms</span>
                    </span>
                </a>

                <p className="sidebar-label">WORKSPACE</p>

                <div className="sidebar-link active">
                    <span>▦</span> Dashboard
                </div>

                <div
                    className="sidebar-link active"
                    onClick={onCreateForm}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onCreateForm();
                        }
                    }}
                >
                    <span>▤</span> Create Form
                </div>

                <div className="sidebar-link active">
                    <span>◫</span> Submissions
                </div>


                <div className="sidebar-bottom">
                    <div
                        className="sidebar-profile-trigger"
                        onClick={onProfileClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onProfileClick?.();
                            }
                        }}
                        title="Open profile settings"
                    >
                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="sidebar-user">
                            <strong>{user?.name || "User"}</strong>
                            <span>{user?.email || ""}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>

            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
                        <h1>
                            Welcome back, {user?.name || "there"}.
                        </h1>
                        <p className="dashboard-subtitle">
                            Here's an overview of your FreeForms workspace.
                        </p>
                    </div>

                    <div className="online-status">
                        <span className="status-dot" />
                        Workspace
                    </div>
                </header>

                {error && (
                    <div className="dashboard-error" role="alert">
                        {error}
                    </div>
                )}

                <section className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">▤</span>
                        <p>Your Forms</p>
                        <h2>{forms.length}</h2>
                        <span className="stat-description">
                            Forms you have created
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-icon">◫</span>
                        <p>Recent Submissions</p>
                        <h2>{submissions.length}</h2>
                        <span className="stat-description">
                            Loaded from your latest 10 records
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-icon">◇</span>
                        <p>Spam Flagged</p>
                        <h2>
                            {
                                submissions.filter(
                                    (item) => item.spam_status === "spam"
                                ).length
                            }
                        </h2>
                        <span className="stat-description">
                            Among the loaded submissions
                        </span>
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-heading">
                        <div>
                            <h2>My Forms</h2>
                            <p>Your connected contact forms.</p>
                        </div>
                    </div>

                    {forms.length === 0 ? (
                        <p className="empty-state">
                            You haven't created a form yet.
                        </p>
                    ) : (
                        <div className="forms-list">
                            {forms.map((form) => (
                                <div className="form-row" key={form.id}>
                                    <div className="form-symbol">F</div>

                                    <div className="form-details">
                                        <strong>{form.form_name}</strong>
                                        <span>{form.notification_email}</span>
                                    </div>

                                    <button
                                        className="copy-button"
                                        onClick={async () => {
                                            const endpoint =
                                                `${API_URL}/forms/${form.public_id}/submit`;

                                            try {
                                                await navigator.clipboard.writeText(endpoint);
                                            } catch {
                                                setError(
                                                    "Could not copy endpoint. Check browser clipboard permissions."
                                                );
                                            }
                                        }}
                                    >
                                        Copy endpoint
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dashboard-panel">

                    <div className="panel-heading">
                        <div>
                            <h2>Form Submissions</h2>
                            <p>Your connected contact form submissions.</p>
                        </div>

                        <button
                            className="copy-button"
                            type="button"
                            onClick={onCreateForm}
                        >
                            + Create Form
                        </button>
                    </div>


                    {submissions.length === 0 ? (
                        <p className="empty-state">
                            No submissions to display yet.
                        </p>
                    ) : (

                        <div className="submissions-table-wrapper">
                            <table className="submissions-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {submissions.map((item) => (
                                        <tr key={item._id || item.id}>
                                            <td className="submission-name">
                                                {item.name || "—"}
                                            </td>

                                            <td>{item.email || "—"}</td>

                                            <td className="submission-message">
                                                {item.message || "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`submission-status ${item.spam_status === "spam"
                                                        ? "spam"
                                                        : "legitimate"
                                                        }`}
                                                >
                                                    {item.spam_status || "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;