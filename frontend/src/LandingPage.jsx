
import "./LandingPage.css";

const features = [
  {
    number: "01",
    icon: "⌘",
    title: "Simple HTML forms",
    description:
      "Connect your existing HTML form to an endpoint and start collecting submissions without building your own backend.",
    tag: "HTML",
  },
  {
    number: "02",
    icon: "{ }",
    title: "JavaScript forms",
    description:
      "Use JavaScript to submit data, handle responses, and create the form experience your project needs.",
    tag: "JAVASCRIPT",
  },
  {
    number: "03",
    icon: "⚛",
    title: "Built for React",
    description:
      "Build interactive forms with your components and connect them to your submission workflow.",
    tag: "REACT",
  },
];

const integrations = [
  { icon: "✉", name: "Email" },
  { icon: "↗", name: "Webhooks" },
  { icon: "▦", name: "Google Sheets" },
  { icon: "◉", name: "Slack" },
  { icon: "◈", name: "Discord" },
];

const steps = [
  {
    number: "01",
    title: "Connect your form",
    description:
      "Use your own HTML, JavaScript, or React code to create the form you want.",
  },
  {
    number: "02",
    title: "Submit your data",
    description:
      "Send form submissions to your FreeForms endpoint for processing.",
  },
  {
    number: "03",
    title: "Manage submissions",
    description:
      "View submissions in your workspace and organize the messages you receive.",
  },
];

function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <main className="landing-page">
      {/* Navigation */}
      <header className="landing-nav">
        <a className="landing-brand" href="#home" aria-label="FreeForms home">
          <span className="landing-brand-icon">F</span>
          <span>
            free<span className="landing-brand-highlight">forms</span>
          </span>
        </a>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#integrations">Integrations</a>
        </nav>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="landing-signin"
            onClick={onSignIn || onGetStarted}
          >
            Sign in
          </button>
          <button
            type="button"
            className="landing-primary-button nav-cta"
            onClick={onGetStarted}
          >
            Get started <span>↗</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow">
            <span className="landing-status-dot" />
            FOR DEVELOPERS
          </div>

          <h1>
            The form solution
            <br />
            for <span>every developer.</span>
          </h1>

          <p className="landing-hero-description">
            Use your own frontend code. Submit to our API.
            <br className="desktop-break" />
            We’ll handle the rest.
          </p>

          <div className="landing-hero-actions">
            <button
              type="button"
              className="landing-primary-button"
              onClick={onGetStarted}
            >
              Get started <span>→</span>
            </button>

            <a className="landing-secondary-button" href="#how-it-works">
              See how it works <span>↓</span>
            </a>
          </div>

          <div className="landing-hero-note">
            <span>✓</span>
            Simple setup. Your frontend. Your workflow.
          </div>
        </div>

        {/* Code preview */}
        <div className="landing-code-card">
          <div className="landing-code-header">
            <div className="landing-window-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="landing-code-filename">contact.html</span>
            <span className="landing-code-badge">HTML</span>
          </div>

          <div className="landing-code-body">
            <div className="landing-code-line">
              <span className="line-number">01</span>
              <code>
                <span className="code-purple">&lt;form</span>{" "}
                <span className="code-blue">action</span>=
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">02</span>
              <code className="code-indent">
                <span className="code-green">
                  "YOUR_FORM_ENDPOINT"
                </span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">03</span>
              <code>
                <span className="code-blue">method</span>=
                <span className="code-green">"post"</span>
                <span className="code-purple">&gt;</span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">04</span>
              <code>
                {"  "}
                <span className="code-purple">&lt;label</span>{" "}
                <span className="code-blue">for</span>=
                <span className="code-green">"email"</span>
                <span className="code-purple">&gt;</span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">05</span>
              <code className="code-indent">
                Your email address
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">06</span>
              <code>
                <span className="code-purple">&lt;/label&gt;</span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">07</span>
              <code>
                {"  "}
                <span className="code-purple">&lt;input</span>{" "}
                <span className="code-blue">type</span>=
                <span className="code-green">"email"</span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">08</span>
              <code className="code-indent">
                <span className="code-blue">name</span>=
                <span className="code-green">"email"</span>{" "}
                <span className="code-blue">required</span>{" "}
                <span className="code-purple">/&gt;</span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">09</span>
              <code>
                {"  "}
                <span className="code-purple">&lt;button&gt;</span>
                Send message
                <span className="code-purple">&lt;/button&gt;</span>
              </code>
            </div>
            <div className="landing-code-line">
              <span className="line-number">10</span>
              <code>
                <span className="code-purple">&lt;/form&gt;</span>
              </code>
            </div>
          </div>

          <div className="landing-code-footer">
            <span className="landing-code-ready">
              <span className="landing-status-dot" />
              Simple to integrate
            </span>
            <span>HTML · HTTP</span>
          </div>
        </div>
      </section>

      {/* Integration strip */}
      <section className="landing-integrations" id="integrations">
        <p>FITS INTO YOUR WORKFLOW</p>
        <div className="landing-integration-list">
          {integrations.map((item) => (
            <div className="landing-integration" key={item.name}>
              <span>{item.icon}</span>
              {item.name}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features">
        <div className="landing-section-heading">
          <span className="landing-section-label">FLEXIBLE BY DESIGN</span>
          <h2>
            Build forms <span>your way.</span>
          </h2>
          <p>
            Keep your preferred frontend tools. Let FreeForms help
            you manage the submissions.
          </p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature) => (
            <article className="landing-feature-card" key={feature.number}>
              <div className="landing-feature-top">
                <span className="landing-feature-icon">{feature.icon}</span>
                <span className="landing-feature-number">
                  {feature.number}
                </span>
              </div>

              <span className="landing-feature-tag">{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <a href="#how-it-works" className="landing-feature-link">
                Learn more <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        className="landing-section landing-process-section"
        id="how-it-works"
      >
        <div className="landing-section-heading">
          <span className="landing-section-label">THREE SIMPLE STEPS</span>
          <h2>
            From form to <span>inbox.</span>
          </h2>
          <p>
            A straightforward workflow for collecting and managing
            messages from your website.
          </p>
        </div>

        <div className="landing-steps">
          {steps.map((step, index) => (
            <article className="landing-step" key={step.number}>
              <div className="landing-step-number">{step.number}</div>
              {index !== steps.length - 1 && (
                <div className="landing-step-connector" />
              )}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="landing-benefits">
        <div className="landing-benefits-copy">
          <span className="landing-section-label">LESS BACKEND BOILERPLATE</span>
          <h2>
            Spend less time on plumbing.
            <br />
            <span>Focus on building.</span>
          </h2>
          <p>
            Bring your forms into one workflow. Review submissions,
            identify flagged messages, and keep your incoming data organized.
          </p>
        </div>

        <div className="landing-benefit-list">
          <div>
            <span className="landing-benefit-check">✓</span>
            <div>
              <h3>Submission management</h3>
              <p>Review incoming messages from your workspace.</p>
            </div>
          </div>
          <div>
            <span className="landing-benefit-check">✓</span>
            <div>
              <h3>Spam status</h3>
              <p>See submissions flagged by your spam detection workflow.</p>
            </div>
          </div>
          <div>
            <span className="landing-benefit-check">✓</span>
            <div>
              <h3>Email notifications</h3>
              <p>Configure notifications for supported form workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta" id="get-started">
        <span className="landing-section-label">READY WHEN YOU ARE</span>
        <h2>
          Your next form starts <span>here.</span>
        </h2>
        <p>
          Create your workspace and start building your form workflow.
        </p>
        <button
          type="button"
          className="landing-primary-button"
          onClick={onGetStarted}
        >
          Get started with FreeForms <span>→</span>
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <a className="landing-brand" href="#home">
          <span className="landing-brand-icon">F</span>
          <span>
            free<span className="landing-brand-highlight">forms</span>
          </span>
        </a>

        <p>Forms made simple for developers.</p>

        <div className="landing-footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#integrations">Integrations</a>
        </div>

        <span className="landing-copyright">© 2026 FreeForms</span>
      </footer>
    </main>
  );
}

export default LandingPage;
