# FreeForms — Multi-Tenant Contact Form SaaS

FreeForms is a contact-form service built with **FastAPI, MongoDB Atlas, PyMongo, and React**. A customer can register, create a form, and place the generated public submission endpoint in a website's HTML form. Visitors can submit messages without creating a FreeForms account. FreeForms validates and classifies submissions, stores them against the correct customer and form, and can email legitimate submissions to the form's configured notification address.

The project is being developed as a SaaS MVP. Features described as *in progress* or *planned* below should not be considered production-ready until they have been tested and secured.

## Product Flow

1. A business registers for FreeForms and logs in.
2. The authenticated customer creates a form and provides a notification email address.
3. FreeForms generates a unique public form ID and returns a submission endpoint.
4. The customer puts that endpoint in their website's HTML `<form action="...">`.
5. A website visitor submits the form without needing a FreeForms account.
6. The API looks up the form by public ID, validates and classifies the message, and stores it with the owning `user_id` and `form_id`.
7. For messages classified as legitimate, the application sends an email using FreeForms' configured SMTP credentials to the notification email saved for that form.
8. The customer logs in to view their own forms and submissions in the dashboard.

## Features

### Authentication and Accounts

- User registration and login endpoints.
- JWT bearer-token authentication for protected endpoints.
- Password hashing using the project's existing security utilities.
- Authenticated `/auth/me` endpoint for retrieving the logged-in user's profile.
- Password-reset flow is being developed and must be tested end-to-end before being treated as production-ready.

### Multi-Tenant Forms

- Authenticated form creation.
- Unique public form IDs generated with Python's `uuid` module.
- Form ownership stored using the owning MongoDB user's `_id` as `user_id`.
- Per-form `notification_email` stored in MongoDB.
- Endpoint for listing the current customer's own forms.
- Public submission endpoint: `POST /forms/{public_id}/submit`.
- Visitors do not need a FreeForms JWT to submit a public form.

### Submissions

- Contact fields validated with Pydantic, including email validation.
- Submissions stored in MongoDB with `form_id`, `user_id`, spam classification details, and a submission timestamp.
- Authenticated endpoint for listing submissions belonging to the current customer.
- Search and pagination are available in the submission-list implementation where configured.
- Tenant isolation must be enforced in every authenticated read, update, and delete operation. Review legacy `/contacts` endpoints before deployment to ensure they cannot return or modify records belonging to another customer.

### Spam Classification

The current contact-form pipeline uses a **rule-based spam classifier**, not the trained Transformer model.

Rules in the existing classifier may evaluate signals such as:

- URLs in the message.
- Suspicious keywords.
- Excessive capitalization.
- Repeated characters.
- A combined spam score and classification (`legitimate`, `review`, or `spam`, depending on the configured rules).
- Explanations/reasons saved alongside a submission.

The exact labels and scoring behavior are determined by the implementation in `app/spam/`.

### Email Notifications

- SMTP configuration is loaded by the backend from environment variables.
- Notifications are sent using FreeForms' configured sending account.
- Each form supplies its own destination through `notification_email`; customers do not need to provide their SMTP password for the basic notification flow.
- Notifications are scheduled with FastAPI `BackgroundTasks` and are sent only when the classifier marks the submission as legitimate.
- The visitor's email should be used as `Reply-To` so the customer can reply to the visitor, while `From` remains the configured FreeForms sender.

### Frontend

- React application bootstrapped with Vite.
- Dark glassmorphism login and registration screens with red accents.
- Login/register toggle.
- JWT is currently stored in browser `sessionStorage` for the development frontend.
- Dashboard UI displaying the customer's profile, forms, recent submissions, and spam status.
- Create Form wizard/modal component is part of the current frontend work.
- Dashboard calls the backend endpoints using the bearer token.

### Rate Limiting

- Visitor rate limiting is being integrated using SlowAPI.
- The proposed key combines the visitor IP address with the public form ID, so each IP/form pair has its own counter.
- The in-memory store is suitable for local development only. Production should use shared storage such as Redis and correctly configured trusted-proxy handling.
- IP-based limiting is approximate: several people can share an IP, and a visitor can change networks or use a VPN.

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- PyMongo / BSON
- Python-JOSE for JWT functionality
- Passlib / BCrypt for password hashing (as configured by the project)
- SlowAPI for rate limiting (in progress)
- Python `smtplib` and `email.message.EmailMessage`
- Python `logging`
- `python-dotenv`

### Database

- MongoDB Atlas
- MongoDB collections for users, forms, submissions, and legacy contact records

### Frontend

- React
- Vite
- JavaScript / JSX
- CSS (custom glassmorphism styling)

### Spam Filtering

- Python rules and regular expressions
- Trained ML models are not yet part of the confirmed request-time classifier integration

## Project Structure

The exact files can evolve as the project develops. The current structure is broadly similar to:

```text
D:\Contact-Form\
├── app\
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   ├── auth_routes.py       # Name may differ in the project
│   ├── dependencies.py
│   ├── security.py
│   ├── formroutes.py
│   ├── submissionroutes.py  # If registered in main.py
│   ├── submission_service.py
│   ├── dashboardroutes.py   # If implemented and registered
│   ├── dashboard_service.py # If implemented
│   ├── contact_service.py
│   ├── routes.py            # Legacy contact endpoints
│   ├── spam\
│   │   ├── models.py
│   │   ├── rules.py
│   │   └── spam_service.py
│   └── notification\
│       ├── email.py
│       └── service.py
├── frontend\
│   ├── src\
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   └── CreateFormWizard.jsx
│   ├── package.json
│   └── ...
├── test_form.html
├── .env
├── .gitignore
└── requirements.txt         # May be named requirement.txt locally
```

> Update this tree to match the actual filenames in the repository. Router names shown in comments may differ from the files in your checkout.

## Local Development Setup

### Prerequisites

- Python and a virtual environment.
- Node.js and npm.
- A MongoDB Atlas cluster and database user.
- An SMTP account/app password for sending email notifications.

### 1. Clone or open the repository

Open a terminal in the project root (for example, `D:\Contact-Form`).

### 2. Create and activate a Python virtual environment

Windows PowerShell example:

```powershell
python -m venv formvenv
.\formvenv\Scripts\Activate.ps1
```

Install the backend requirements:

```powershell
pip install -r requirements.txt
```

If the requirements file has a different name in your checkout, use that filename. The public endpoint uses HTML form fields, so `python-multipart` must be installed:

```powershell
pip install python-multipart
```

If SlowAPI is used by the current code, install it as well and record it in the dependency file:

```powershell
pip install slowapi
```

### 3. Configure environment variables

Create a local `.env` in the project root. Use your own values; never commit real credentials.

```dotenv
MONGO_URL="mongodb+srv://<db_username>:<url_encoded_db_password>@<cluster-host>/contact_db?retryWrites=true&w=majority"
SECRET_KEY="<long-random-secret>"
ALGORITHM="HS256"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="<your-freeforms-sender-email>"
SMTP_PASSWORD="<your-email-app-password>"

FRONTEND_RESET_URL="http://localhost:5173/reset-password"
```

The names must match the variables actually read by `app/security.py` and other configuration modules. `MONGO_URL` must use the MongoDB **database user's** credentials, not the Atlas website login. URL-encode reserved characters in the username/password portion of a MongoDB URI when necessary. Use a strong, private `SECRET_KEY`.

Ensure `.env` is included in `.gitignore`.

### 4. Start the backend

From the project root, activate the virtual environment and run:

```powershell
uvicorn app.main:app --reload
```

FastAPI should be available at `http://127.0.0.1:8000`. Interactive API documentation is normally available at `http://127.0.0.1:8000/docs`.

### 5. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite normally serves the development frontend at `http://localhost:5173`.

### 6. Configure CORS for local development

Because Vite and FastAPI use different origins, configure FastAPI's `CORSMiddleware` in `app/main.py` for the actual development origin(s), such as `http://localhost:5173` and, if used, `http://127.0.0.1:5173`. In production, allow only the origins that should access the API. CORS is a browser permission mechanism, not authentication or authorization.

## API Overview

The following routes are part of the intended/current application flow; verify the registered route paths in `/docs`, because route prefixes and trailing slashes depend on `main.py`.

| Method | Route | Purpose | Authentication |
|---|---|---|---|
| `POST` | `/auth/register` | Register a customer | Public |
| `POST` | `/auth/login` | Authenticate and receive a JWT | Public |
| `GET` | `/auth/me` | Get the current user's profile | JWT required |
| `POST` | `/auth/forgot-password` | Request a password-reset email | Public; implementation needs end-to-end testing |
| `POST` | `/auth/reset-password` | Set a new password with a reset token | Public; implementation needs end-to-end testing |
| `POST` | `/forms/` | Create a form for the current customer | JWT required |
| `GET` | `/forms/` | List the current customer's forms | JWT required |
| `POST` | `/forms/{public_id}/submit` | Receive an anonymous website form submission | Public; public ID identifies the form |
| `GET` | `/submissions/` | List the current customer's submissions | JWT required; verify route registration and tenant filter |
| `GET` | `/dashboard/stats` | Dashboard totals by date/period | Planned or in progress; verify implementation before use |

Legacy `/contacts` routes may also be available. Review them separately before exposing the application as a multi-tenant SaaS.

## Example: Add FreeForms to a Website

After creating a form in FreeForms, copy its generated public endpoint and place it in your website's HTML form. Use the exact URL returned by your API and the field names expected by `ContactCreate`.

```html
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

The local URL above is for development only. After deployment, customers must use the public HTTPS API URL. A normal HTML form submission does not require the visitor to log in. JavaScript `fetch()` forms may require appropriate CORS configuration to read the API response.

## Data Model Concepts

MongoDB automatically supplies an `_id` for each document. FreeForms uses additional fields to connect records:

- **User**: account/profile fields and password hash.
- **Form**: `user_id`, unique `public_id`, `form_name`, `notification_email`, and creation timestamp.
- **Submission**: `form_id`, `user_id`, submitted fields, spam results, and submission timestamp.

The `public_id` identifies which form received a public submission. The form's `user_id` identifies the owning customer. Saving `user_id` on the submission makes customer-specific filtering direct, but the backend must still enforce that filter on every authenticated data-access route.

## Security and Production Readiness Checklist

Before calling FreeForms production-ready, verify and complete the following:

- [ ] Fix and test MongoDB Atlas connectivity and credentials.
- [ ] Confirm all authenticated form and submission routes filter by the verified `current_user` identity.
- [ ] Review legacy contact GET/update/delete routes for cross-customer access.
- [ ] Test registration, login, JWT expiry, logout, password reset, expiry, and reset-token reuse.
- [ ] Confirm the email sender domain/provider is suitable for production transactional mail; personal Gmail SMTP is useful for development but may not suit a SaaS sending workload.
- [ ] Test SMTP failures and background-task error logging.
- [ ] Finish and test SlowAPI rate limiting. Replace in-memory storage with shared storage (for example Redis) when running multiple workers/instances.
- [ ] Configure CORS for only trusted frontend origins.
- [ ] Use HTTPS in production and keep secrets out of source control and frontend bundles.
- [ ] Add MongoDB indexes for frequently queried fields such as `forms.public_id`, `forms.user_id`, and `submissions.user_id` / `submissions.submitted_at` as appropriate. Create the `public_id` index as unique.
- [ ] Add abuse controls such as a honeypot or CAPTCHA where appropriate.
- [ ] Add automated tests for tenant isolation and public submission behavior.
- [ ] Add accurate dashboard statistics and monthly submission quotas before using dashboard counts for subscription enforcement.
- [ ] Add backups, monitoring, request-size limits, and operational error handling.

## Roadmap

1. Finish and verify public form submission and dynamic notification email end-to-end.
2. Complete the React dashboard, Create Form wizard, and submission views against the live API.
3. Confirm tenant isolation and rate limiting.
4. Finish and test forgot-password UI and backend flow.
5. Deploy the application with production configuration and logging.
6. Integrate the trained ML spam classifier (TF-IDF + Logistic Regression or Transformer) behind a dedicated service interface.
7. Add customer-level monthly quotas, subscription plans, payment processing and provider webhooks.

## Contributing / Development Notes

- Keep backend secrets in `.env`; do not put them in React source or expose them through `VITE_*` variables.
- Update the dependency file when installing new packages.
- Test changes using at least two separate customer accounts to validate tenant isolation.
- Treat this README as an evolving description of the codebase and update route names and project structure as implementation changes.
