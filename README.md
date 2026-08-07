# KaamSetu

KaamSetu is a full-stack marketplace for discovering, booking, and managing local home services. It connects customers with service professionals, gives vendors a workspace to manage their business, and provides administrators with tools for verification, catalog moderation, operations, and settlements.

> **Project status:** The application has the core marketplace flows in place and is suitable for local development and demos. Before a public production launch, complete the hardening checklist in [Production readiness](#production-readiness).

## Highlights

- Browse service categories, service listings, and professional profiles without an account.
- Customer authentication with email/password, email verification, password reset, Google sign-in, and Facebook sign-in.
- Customer booking lifecycle: create, track, cancel, pay online or by cash, and review completed work.
- Razorpay order creation, signature verification, webhook handling, transaction records, and configurable commission calculation.
- Vendor onboarding with business/KYC documents and an admin approval gate.
- Vendor dashboards for services, bookings, reviews and replies, earnings, transactions, profile, and notifications.
- Admin dashboards for vendors, customers, categories, services, reviews, bookings, transactions/settlements, and broadcast notifications.
- Cloudinary-backed image uploads for profiles and service media.

## Technology

| Area | Stack |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS, Axios, Framer Motion, Recharts |
| Backend | Node.js, Express 5, Mongoose, JWT, bcrypt |
| Database | MongoDB |
| Integrations | Razorpay, Cloudinary, Nodemailer (SMTP), Google OAuth |

## Repository layout

```text
kaamSetu/
├── frontend/                 # React + Vite single-page application
│   └── src/
│       ├── pages/            # Customer, vendor, admin, and auth screens
│       ├── components/       # Reusable UI components
│       ├── services/         # API clients and payment helpers
│       ├── context/          # Authentication, vendor, and theme state
│       └── routes/           # Role-aware route definitions
├── Backend/                  # Express API
│   ├── controllers/          # HTTP request handlers
│   ├── services/             # Payment-domain logic
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API route modules
│   ├── middleware/           # JWT, role, approval, and upload guards
│   ├── config/               # Database, mail, and Cloudinary configuration
│   └── seed.js               # Development/demo data seed
└── README.md
```

## Prerequisites

- Node.js 20 LTS or later
- npm 10 or later
- MongoDB 7+ (local instance or Atlas cluster)
- A Cloudinary account for image uploads
- A Gmail SMTP account/app password, or compatible SMTP credentials
- Razorpay test credentials for online payment testing
- A Google OAuth web client for Google sign-in

Facebook sign-in is implemented in the client/server flow. Configure its application credentials and SDK settings before enabling it for a deployed environment.

## Local setup

1. Clone the repository and install dependencies.

   ```bash
   git clone <repository-url>
   cd kaamSetu
   npm install --prefix Backend
   npm install --prefix frontend
   ```

2. Create `Backend/.env` with the required backend settings.

   ```dotenv
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/kaamsetu
   JWT_SECRET=replace-with-a-long-random-secret

   EMAIL_USER=your-smtp-email@example.com
   EMAIL_PASS=your-smtp-app-password
   SUPPORT_EMAIL=support@example.com

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   GOOGLE_CLIENT_ID=your-google-oauth-client-id

   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
   COMMISSION_RATE=10
   ```

3. Create `frontend/.env`.

   ```dotenv
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. Start both applications in separate terminals.

   ```bash
   # Terminal 1
   npm run dev --prefix Backend

   # Terminal 2
   npm run dev --prefix frontend
   ```

The frontend is served by Vite (normally `http://localhost:5173`) and the API listens on `http://localhost:3000` by default. Confirm the API is running at `GET /` before using the UI.

## Demo data

To populate MongoDB with representative categories, users, vendors, services, bookings, reviews, transactions, and notifications:

```bash
cd Backend
node seed.js
```

The seed script clears and recreates the collections it owns. Only run it against a disposable local/development database. It prints demo credentials on completion; every seeded account uses the password `Test@1234`.

## Roles and capabilities

| Role | Core capabilities |
| --- | --- |
| Visitor | Browse categories, services, featured experts, and public vendor profiles |
| Customer | Manage profile, place/track/cancel bookings, pay, review services, receive notifications, and contact support |
| Vendor | Complete onboarding, manage profile/services/bookings/reviews, view earnings and transactions, receive notifications |
| Admin | Approve/reject/suspend vendors, manage customers/categories/services/reviews/bookings, manage transaction status/settlements, and broadcast notifications |

Vendor-only endpoints require both a valid JWT and the `vendor` role. Changes that publish services or update booking status additionally require an **approved** vendor profile. Admin and customer route groups are likewise protected by JWT and role checks.

## API overview

All API routes are prefixed with `/api`. Protected routes expect:

```http
Authorization: Bearer <jwt>
```

| Base path | Purpose | Access |
| --- | --- | --- |
| `/auth` | Registration, login, OTP verification, password reset, social login, account deactivation | Public unless noted |
| `/public` | Categories, listings, vendors, and featured experts | Public |
| `/customer` | Customer profile, bookings, and reviews | Customer |
| `/vendor` | Vendor profile, services, bookings, reviews, earnings, transactions | Vendor |
| `/admin` | Marketplace dashboards and moderation/operations | Admin |
| `/payment` | Razorpay order creation, verification, and webhook | JWT for checkout; webhook is signature-validated |
| `/notifications` | List, read, and delete in-app notifications | Authenticated user |
| `/support/contact` | Support contact request | Public |

For the source-of-truth endpoint definitions, see [`Backend/routes`](Backend/routes).

## Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `Backend` | `npm run dev` | Run the API with Nodemon |
| `Backend` | `npm start` | Run the API with Node.js |
| `frontend` | `npm run dev` | Run the Vite development server |
| `frontend` | `npm run build` | Create a production frontend bundle |
| `frontend` | `npm run preview` | Preview the built frontend locally |
| `frontend` | `npm run lint` | Run ESLint |

## Payments and webhooks

Online checkout uses Razorpay in INR. The application creates an order server-side, verifies the checkout signature server-side, and also handles `payment.captured` webhooks. For a deployed environment:

1. Register `POST https://<api-domain>/api/payment/webhook` in Razorpay.
2. Configure the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
3. Use Razorpay test keys outside production and live keys only in the production secret store.
4. Ensure MongoDB supports transactions (use a replica set or MongoDB Atlas), because payment finalization uses Mongoose transactions.

## Production readiness

The codebase already includes role-based authorization, JWT verification, Cloudinary upload restrictions, payment signature checks, and separate frontend/backend environment configuration. The following work remains recommended before a production release:

- Add startup environment validation and commit sanitized `.env.example` files.
- Restrict CORS to environment-specific frontend origins; the current allowlist is defined in `Backend/Server.js`.
- Add Helmet, rate limiting, request payload limits, validation/sanitization, and centralized error handling.
- Remove sensitive diagnostic logging from authentication flows and use structured logs with monitoring/alerting.
- Add health/readiness endpoints, graceful shutdown, backups, and operational runbooks.
- Add unit, integration, and end-to-end tests plus CI checks for linting, build, and tests.
- Add deployment configuration (container/process manager/hosting) and separate dev, staging, and production secrets.
- Review frontend bundle size and split/lazy-load large routes where useful.

## Security notes

- Never commit `.env` files, service-account credentials, Razorpay secrets, or SMTP passwords.
- Keep `JWT_SECRET` high-entropy and unique per environment.
- Treat Razorpay webhooks as an authoritative payment signal only after HMAC verification.
- Use Cloudinary credentials with the minimum permissions necessary, and rotate compromised credentials immediately.
- Run the included seed script only with non-production data.

## Contributing

1. Create a focused branch.
2. Keep API and UI changes aligned with the existing role and authorization model.
3. Run `npm run lint --prefix frontend` and `npm run build --prefix frontend` before opening a pull request.
4. Include tests when introducing test infrastructure or changing business-critical payment/authentication behavior.

## License

No license is currently declared in the repository. Add an explicit license before distributing or accepting external contributions.
