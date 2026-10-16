
import { useState } from "react";
import "./CreateFormWizard.css";

const API_URL = import.meta.env.VITE_API_URL;

const steps = ["Details", "Fields", "Integration"];

function CreateFormWizard({ onClose, onCreated }) {
  const [step, setStep] = useState(0);
  const [formName, setFormName] = useState("Contact Form");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [createdForm, setCreatedForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const endpoint = createdForm
    ? `${API_URL}${createdForm.submit_path}`
    : "";

  async function createForm() {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(`${API_URL}/forms/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: formName.trim(),
          notification_email: notificationEmail.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to create the form."
        );
      }

      setCreatedForm(data);
      setStep(2);
    } catch (err) {
      setError(err.message || "Unable to connect to FreeForms.");
    } finally {
      setLoading(false);
    }
  }

  async function copyEndpoint() {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
    } catch {
      setError(
        "Could not copy the endpoint. Please copy it manually."
      );
    }
  }

  function finish() {
    onCreated?.(createdForm);
    onClose();
  }

  return (
    <div
      className="wizard-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        className="wizard-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        <header className="wizard-header">
          <div>
            <span className="wizard-eyebrow">
              FREEFORMS WORKSPACE
            </span>
            <h2 id="wizard-title">Create a new form</h2>
            <p>Build your form and connect it to your website.</p>
          </div>

          <button
            type="button"
            className="wizard-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close wizard"
          >
            ×
          </button>
        </header>

        <nav className="wizard-steps" aria-label="Creation steps">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`wizard-step ${
                index === step ? "active" : ""
              } ${index < step ? "completed" : ""}`}
            >
              <span className="wizard-step-number">
                {index < step ? "✓" : index + 1}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="wizard-content">
          {error && (
            <div className="wizard-error" role="alert">
              {error}
            </div>
          )}

          {step === 0 && (
            <div className="wizard-page">
              <h3>Let's start with the basics</h3>
              <p className="wizard-description">
                Give your form a name and choose where notifications
                should be sent.
              </p>

              <label className="wizard-label" htmlFor="form-name">
                Form name
              </label>
              <input
                id="form-name"
                className="wizard-input"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="e.g. Contact Form"
                maxLength={100}
                required
              />

              <label
                className="wizard-label"
                htmlFor="notification-email"
              >
                Notification email
              </label>
              <input
                id="notification-email"
                className="wizard-input"
                type="email"
                value={notificationEmail}
                onChange={(event) =>
                  setNotificationEmail(event.target.value)
                }
                placeholder="you@company.com"
                required
              />

              <div className="wizard-note">
                <strong>What happens next?</strong>
                <p>
                  FreeForms will generate a unique endpoint for this
                  form. You can connect it to your existing website.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wizard-page">
              <h3>Your contact form fields</h3>
              <p className="wizard-description">
                This version uses the standard fields currently
                supported by your backend.
              </p>

              <div className="wizard-field-list">
                {[
                  ["Name", "text", "name"],
                  ["Email", "email", "email"],
                  ["Subject", "text", "subject"],
                  ["Message", "textarea", "message"],
                ].map(([label, type, key], index) => (
                  <div className="wizard-field" key={key}>
                    <span className="wizard-field-number">
                      {index + 1}
                    </span>
                    <div className="wizard-field-info">
                      <strong>{label}</strong>
                      <span>{key}</span>
                    </div>
                    <span className="wizard-field-type">{type}</span>
                    <span className="wizard-required">Required*</span>
                  </div>
                ))}
              </div>

              <div className="wizard-note">
                <strong>About custom fields</strong>
                <p>
                  These fields are a preview, not saved configuration.
                  Adding or removing fields requires a backend update
                  because your current submission endpoint expects
                  ContactCreate.
                </p>
              </div>
            </div>
          )}

          {step === 2 && createdForm && (
            <div className="wizard-page">
              <div className="wizard-success-icon">✓</div>
              <h3>You're all set!</h3>
              <p className="wizard-description">
                <strong>{createdForm.form_name}</strong> has been
                created. Use its endpoint in your website's HTML form.
              </p>

              <label className="wizard-label">
                Your unique submission endpoint
              </label>
              <div className="wizard-endpoint">
                <code>{endpoint}</code>
                <button
                  type="button"
                  className="wizard-secondary-button"
                  onClick={copyEndpoint}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <label className="wizard-label">
                HTML integration example
              </label>
              <pre className="wizard-code"><code>{`<form
  action="${endpoint}"
  method="POST"
>
  <input name="name" required />
  <input name="email" type="email" required />
  <input name="subject" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send Message</button>
</form>`}</code></pre>

              <div className="wizard-note">
                <strong>Before going live</strong>
                <p>
                  Replace the local API address with your deployed
                  HTTPS address. Ensure your backend accepts the
                  form submission's content type and that rate limiting
                  and spam protection are configured.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="wizard-footer">
          <button
            type="button"
            className="wizard-secondary-button"
            onClick={() => {
              setError("");
              if (step === 0) {
                onClose();
              } else if (step === 1) {
                setStep(0);
              }
            }}
            disabled={loading}
          >
            {step === 0 ? "Cancel" : step === 1 ? "Back" : " "}
          </button>

          {step === 0 && (
            <button
              type="button"
              className="wizard-primary-button"
              onClick={() => {
                setError("");

                if (!formName.trim()) {
                  setError("Please enter a form name.");
                  return;
                }

                if (
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    notificationEmail.trim()
                  )
                ) {
                  setError("Please enter a valid notification email.");
                  return;
                }

                setStep(1);
              }}
            >
              Continue →
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              className="wizard-primary-button"
              onClick={createForm}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create form →"}
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              className="wizard-primary-button"
              onClick={finish}
            >
              Done
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

export default CreateFormWizard;
