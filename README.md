# FreeForms --- Multi-Tenant Contact Form SaaS

FreeForms is a contact-form service built with **FastAPI, MongoDB Atlas,
PyMongo, and React**. A customer can register, create a form, and place
its generated public submission endpoint in a website's HTML form.
Visitors can submit messages without creating a FreeForms account.
FreeForms validates and classifies submissions, stores them against the
correct customer and form, and can email legitimate submissions to the
form's configured notification address.

The project is being developed as a SaaS MVP. Features described as **in
progress**, **planned**, or requiring verification should not be
considered production-ready until they have been tested and secured.

## Product Flow

1.  A business registers for FreeForms and logs in.
2.  The authenticated customer creates a form and provides a
    notification email address.
3.  FreeForms generates a unique public form ID and returns a submission
    endpoint.
4.  The customer copies the endpoint into their website's HTML form.
5.  A website visitor submits the form without needing a FreeForms
    account.
6.  The API looks up the form by public ID, validates and classifies the
    message, and stores it with the owning `user_id` and `form_id`.
7.  For messages classified as legitimate, the application can send an
    email using FreeForms' configured SMTP credentials to the form's
    notification email.
8.  The customer logs in to view their forms and submissions in the
    dashboard.

## Features

### Authentication and Accounts

-   User registration and login endpoints.
-   JWT bearer-token authentication for protected endpoints.
-   Password hashing using the project's existing security utilities.
-   Authenticated `/auth/me` endpoint for retrieving the logged-in
    user's profile.
-   React authentication wizard/modal with login and registration modes.
-   Forgot-password and reset-password UI flow is present in the
    frontend work; test the complete backend and email flow end-to-end
    before treating it as production-ready.
-   The development frontend currently stores the access token in
    browser `sessionStorage`.

### Multi-Tenant Forms

-   Authenticated form creation.
-   Unique public form IDs generated with Python's `uuid` module.
-   Form ownership stored using the owning MongoDB user's `_id` as
    `user_id`.
-   Per-form `notification_email` stored in MongoDB.
-   Endpoint for listing the current customer's own forms.
-   Public submission endpoint: `POST /forms/{public_id}/submit`.
-   Visitors do not need a FreeForms JWT to submit a public form.
-   Dashboard **My Forms** panel shows the form name and notification
    email.
-   The endpoint is masked by default in the dashboard and can be
    revealed or hidden using a Show/Hide control.
-   The Copy endpoint action copies the actual endpoint even when it is
    masked in the UI.

### Submissions

-   Contact fields validated with Pydantic, including email validation.
-   Submissions stored in MongoDB with `form_id`, `user_id`,
    spam-classification details, and a submission timestamp.
-   Authenticated endpoint for listing submissions belonging to the
    current customer.
-   Search and pagination are available in the submission-list
    implementation where configured.
-   Dashboard **Form Submissions** table displays Name, Email, Subject,
    and Message instead of exposing the spam status as a table column.
-   Dashboard submission filters:
    -   **Legitimate** is the default view.
    -   **Spam** displays submissions classified as spam.
    -   Filter buttons show counts based on the submissions currently
        loaded in the dashboard.
-   Selecting a submission row opens a details modal.
-   The details modal is intended to show user-facing fields such as
    Name, Email, Subject, Message, and submission time. Internal fields
    such as record ID, form ID, user ID, spam score, spam status, and
    spam reasons are excluded from this UI.
-   The current dashboard request uses `/submissions/?page=1&limit=10`;
    unless pagination is extended, dashboard filters apply only to the
    records returned by that request.
-   Tenant isolation must be enforced in every authenticated read,
    update, and delete operation. Review legacy `/contacts` endpoints
    before deployment to ensure they cannot return or modify records
    belonging to another customer.

### Spam Classification

### Spam Classification

FreeForms uses a **machine learning-based spam classifier** built with **TF-IDF (Term Frequency–Inverse Document Frequency) and Logistic Regression** to classify contact-form submissions.

The classification pipeline works as follows:

- **Text preprocessing:** Prepares the submitted message text for feature extraction.
- **TF-IDF vectorization:** Converts text into numerical features based on the importance of words and terms within the text.
- **Logistic Regression:** Uses the features learned during training to predict whether a submission is spam or legitimate.
- **Spam classification:** Assigns a predicted class based on the trained model.
- **Submission storage:** Saves the classification result alongside the submission so it can be reviewed in the dashboard.

The model learns patterns from labeled training data rather than relying solely on manually defined rules. Its performance depends on the quality and representativeness of the training dataset.

**Technologies used:** TF-IDF vectorization and Logistic Regression.

### Email Notifications

-   SMTP configuration is loaded by the backend from environment
    variables.
-   Notifications are sent using FreeForms' configured sending account.
-   Each form supplies its own destination through `notification_email`;
    customers do not need to provide their SMTP password for the basic
    notification flow.
-   Notifications are scheduled with FastAPI `BackgroundTasks` and are
    intended to be sent only when the classifier marks the submission as
    legitimate.
-   The visitor's email should be used as `Reply-To` so the customer can
    reply to the visitor, while `From` remains the configured FreeForms
    sender.

### Frontend and Dashboard

-   React application bootstrapped with Vite.
-   Dark UI with black/charcoal surfaces and red/pink accents.
-   Landing page with Get Started and Sign In actions.
-   Reusable authentication wizard/modal with login and registration
    modes.
-   Dashboard displaying the customer's profile, forms, and recent
    submissions.
-   Create Form wizard/modal.
-   Profile wizard/modal.
-   Submission list with Legitimate and Spam filters.
-   Clickable submission rows and a submission-details modal.
-   My Forms endpoint visibility toggle and Copy endpoint action.
-   Dashboard calls backend endpoints using the bearer token.
-   Loading, empty, and error states are implemented in the dashboard
    work; continue testing these states against real API responses.

### Rate Limiting

-   Visitor rate limiting is being integrated using SlowAPI.
-   The proposed key combines the visitor IP address with the public
    form ID, so each IP/form pair has its own counter.
-   The in-memory store is suitable for local development only.
    Production should use shared storage such as Redis and correctly
    configured trusted-proxy handling.
-   IP-based limiting is approximate: several people can share an IP,
    and a visitor can change networks or use a VPN.

## Tech Stack

### Backend

-   Python
-   FastAPI
-   Uvicorn
-   Pydantic
-   PyMongo / BSON
-   Python-JOSE for JWT functionality
-   Passlib / BCrypt for password hashing, as configured by the project
-   SlowAPI for rate limiting, in progress
-   Python `smtplib` and `email.message.EmailMessage`
-   Python `logging`
-   `python-dotenv`

### Database

-   MongoDB Atlas
-   MongoDB collections for users, forms, submissions, and legacy
    contact records

### Frontend

-   React
-   Vite
-   JavaScript / JSX
-   CSS with custom dark styling and red/pink accents

### Spam Filtering

-   Python rules and regular expressions
-   Trained ML models are not yet part of the confirmed request-time
    classifier integration

## Project Structure

The exact files can evolve as the project develops. The current
structure is broadly similar to:

``` text
D:\\Contact-Form\\
├── app\\
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   ├── auth_routes.py
│   ├── dependencies.py
│   ├── security.py
│   ├── formroutes.py
│   ├── submissionroutes.py
│   ├── submission_service.py
│   ├── dashboardroutes.py
│   ├── dashboard_service.py
│   ├── contact_service.py
│   ├── routes.py
│   ├── spam\\
│   │   ├── models.py
│   │   ├── rules.py
│   │   └── spam_service.py
│   └── notification\\
│       ├── email.py
│       └── service.py
├── frontend\\
│   ├── src\\
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── CreateFormWizard.jsx
│   │   ├── ProfileWizard.jsx
│   │   ├── ForgotPasswordWizard.jsx
│   │   ├── AuthWizard.jsx
│   │   └── LandingPage.jsx
│   ├── package.json
│   └── ...
├── test_form.html
├── .env
├── .gitignore
└── requirements.txt
```

> Update this tree to match the actual filenames in the repository. Some
> router and service files listed above may be named differently or may
> not be registered in the current application.

## Local Development Setup

### Prerequisites

-   Python and a virtual environment.
-   Node.js and npm.
-   A MongoDB Atlas cluster and database user.
-   An SMTP account/app password for sending email notifications.

### 1. Clone or open the repository

Open a terminal in the project root (for example, `D:\Contact-Form`).

### 2. Create and activate a Python virtual environment

Windows PowerShell example:

``` powershell
python -m venv formvenv
.\formvenv\Scripts\Activate.ps1
```

Install the backend requirements:

``` powershell
pip install -r requirements.txt
```

If the requirements file has a different name in your checkout, use that
filename. The public endpoint uses HTML form fields, so
`python-multipart` must be installed:

``` powershell
pip install python-multipart
```

If SlowAPI is used by the current code, install it as well and record it
in the dependency file:

``` powershell
pip install slowapi
```

### 3. Configure environment variables

Create a local `.env` in the project root. Use your own values; never
commit real credentials.

``` dotenv
MONGO_URL="mongodb+srv://<db_username>:<url_encoded_db_password>@<cluster-host>/contact_db?retryWrites=true&w=majority"
SECRET_KEY="<long-random-secret>"
ALGORITHM="HS256"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="<your-freeforms-sender-email>"
SMTP_PASSWORD="<your-email-app-password>"

FRONTEND_RESET_URL="http://localhost:5173/reset-password"
```

The names must match the variables actually read by `app/security.py`
and other configuration modules. `MONGO_URL` must use the MongoDB
**database user's** credentials, not the Atlas website login. URL-encode
reserved characters in the username/password portion of a MongoDB URI
when necessary. Use a strong, private `SECRET_KEY`.

Ensure `.env` is included in `.gitignore`.

### 4. Start the backend

From the project root, activate the virtual environment and run:

``` powershell
uvicorn app.main:app --reload
```

FastAPI should be available at `http://127.0.0.1:8000`. Interactive API
documentation is normally available at `http://127.0.0.1:8000/docs`.

### 5. Start the frontend

Open a second terminal:

``` powershell
cd frontend
npm install
npm run dev
```

Vite normally serves the development frontend at
`http://localhost:5173`.

### 6. Configure CORS for local development

Because Vite and FastAPI use different origins, configure FastAPI's
`CORSMiddleware` in `app/main.py` for the actual development origins,
such as `http://localhost:5173` and, if used, `http://127.0.0.1:5173`.
In production, allow only the origins that should access the API. CORS
is a browser permission mechanism, not authentication or authorization.

## API Overview

The following routes are part of the intended/current application flow;
verify the registered route paths in `/docs`, because route prefixes and
trailing slashes depend on `main.py`.

  ---------------------------------------------------------------------------------------
  Method            Route                             Purpose           Authentication
  ----------------- --------------------------------- ----------------- -----------------
  `POST`            `/auth/register`                  Register a        Public
                                                      customer          

  `POST`            `/auth/login`                     Authenticate and  Public
                                                      receive a JWT     

  `GET`             `/auth/me`                        Get the current   JWT required
                                                      user's profile    

  `POST`            `/auth/forgot-password`           Request a         Public;
                                                      password-reset    end-to-end
                                                      email             testing required

  `POST`            `/auth/reset-password`            Set a new         Public;
                                                      password with a   end-to-end
                                                      reset token       testing required

  `POST`            `/forms/`                         Create a form for JWT required
                                                      the current       
                                                      customer          

  `GET`             `/forms/`                         List the current  JWT required
                                                      customer's forms  

  `POST`            `/forms/{public_id}/submit`       Receive an        Public; public ID
                                                      anonymous website identifies the
                                                      form submission   form

  `GET`             `/submissions/?page=1&limit=10`   List the current  JWT required;
                                                      customer's        verify route
                                                      submissions       registration and
                                                                        tenant filter

  `GET`             `/dashboard/stats`                Dashboard totals  Planned or in
                                                      by date/period    progress; verify
                                                                        implementation
                                                                        before use
  ---------------------------------------------------------------------------------------

Legacy `/contacts` routes may also be available. Review them separately
before exposing the application as a multi-tenant SaaS.

## Example: Add FreeForms to a Website

After creating a form in FreeForms, copy its generated public endpoint
and place it in your website's HTML form. Use the exact URL returned by
your API and the field names expected by the backend model.

``` html
<form
  action="http://127.0.0.1:8000/forms/YOUR_PUBLIC_ID/submit"
  method="POST"
>
  <label for="name">Name</label>
  <input id="name" name="name" required />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <label for="subject">Subject</label>
  <input id="subject" name="subject" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Send message</button>
</form>
```

The local URL above is for development only. After deployment, customers
must use the public HTTPS API URL. A normal HTML form submission does
not require the visitor to log in. JavaScript `fetch()` forms may
require appropriate CORS configuration to read the API response.

## Data Model Concepts

MongoDB automatically supplies an `_id` for each document. FreeForms
uses additional fields to connect records:

-   **User:** account/profile fields and password hash.
-   **Form:** `user_id`, unique `public_id`, `form_name`,
    `notification_email`, and creation timestamp.
-   **Submission:** `form_id`, `user_id`, submitted fields, spam
    results, and submission timestamp.

The `public_id` identifies which form received a public submission. The
form's `user_id` identifies the owning customer. Saving `user_id` on the
submission makes customer-specific filtering direct, but the backend
must still enforce that filter on every authenticated data-access route.

## Security and Production Readiness Checklist

Before calling FreeForms production-ready, verify and complete the
following:

-   [ ] Fix and test MongoDB Atlas connectivity and credentials.
-   [ ] Confirm all authenticated form and submission routes filter by
    the verified `current_user` identity.
-   [ ] Review legacy contact GET/update/delete routes for
    cross-customer access.
-   [ ] Test registration, login, JWT expiry, logout, password reset,
    expiry, and reset-token reuse.
-   [ ] Confirm the email sender domain/provider is suitable for
    production transactional mail; personal Gmail SMTP is useful for
    development but may not suit a SaaS sending workload.
-   [ ] Test SMTP failures and background-task error logging.
-   [ ] Finish and test SlowAPI rate limiting. Replace in-memory storage
    with shared storage (for example Redis) when running multiple
    workers/instances.
-   [ ] Configure CORS for only trusted frontend origins.
-   [ ] Use HTTPS in production and keep secrets out of source control
    and frontend bundles.
-   [ ] Add MongoDB indexes for frequently queried fields such as
    `forms.public_id`, `forms.user_id`, and `submissions.user_id` /
    `submissions.submitted_at` as appropriate. Create the `public_id`
    index as unique.
-   [ ] Add abuse controls such as a honeypot or CAPTCHA where
    appropriate.
-   [ ] Add automated tests for tenant isolation and public submission
    behavior.
-   [ ] Verify the dashboard's Legitimate/Spam filters against backend
    classifications, including unknown or review statuses.
-   [ ] Verify endpoint visibility and clipboard behavior in supported
    browsers.
-   [ ] Add accurate dashboard statistics and monthly submission quotas
    before using dashboard counts for subscription enforcement.
-   [ ] Add backups, monitoring, request-size limits, and operational
    error handling.

## Roadmap

1.  Test public form submission and notification emails end-to-end.
2.  Test the dashboard, Create Form wizard, profile UI, and submission
    details against the live API.
3.  Confirm tenant isolation and rate limiting.
4.  Finish and test the forgot-password UI and backend flow.
5.  Deploy the application with production configuration, HTTPS, and
    logging.
6.  Integrate the trained ML spam classifier (TF-IDF + Logistic
    Regression or Transformer) behind a dedicated service interface, if
    still required.
7.  Add customer-level monthly quotas, subscription plans, payment
    processing, and provider webhooks.

## Contributing / Development Notes

-   Keep backend secrets in `.env`; do not put them in React source or
    expose them through `VITE_*` variables.
-   Update the dependency file when installing new packages.
-   Test changes using at least two separate customer accounts to
    validate tenant isolation.
-   Treat this README as an evolving description of the codebase and
    update route names and project structure as implementation changes.
