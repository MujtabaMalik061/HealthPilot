# HealthPilot

A full-stack healthcare management system that connects patients, doctors, and administrators through a centralized platform for managing medical appointments, reports, services, and reviews.

## Live Demo

- **Frontend:** https://healthpilot-system.vercel.app
- **Backend API:** https://health-pilot-backend.vercel.app

---

## Features

### Patient Portal
- Browse and search doctors by specialty
- Book, reschedule, and cancel appointments
- View medical reports
- Leave reviews and ratings for doctors
- Access healthcare services

### Doctor Dashboard
- Manage availability and schedules
- View and manage patient appointments
- Create and manage medical reports
- Track patient history

### Admin Panel
- Approve/reject doctor registrations
- Manage users, doctors, and services
- View system-wide appointment and report analytics
- Monitor platform activity

### General
- Role-based access control (Admin, Doctor, Patient)
- OTP-based password reset via email
- Automated appointment reminder emails (via node-cron)
- Integrated AI chatbot for user assistance
- Responsive UI with light/dark theme support

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 6 | Build tool |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Analytics charts |
| React Calendar | Appointment scheduling |
| Sonner | Toast notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email (Gmail SMTP) |
| node-cron | Scheduled email reminders |
| Multer | File uploads |
| Zod | Input validation |
| Jest + Supertest | Testing |

---

## Project Structure

```
HealthPilot/
├── Backend/
│   ├── src/
│   │   ├── config/        # Env config, mailer setup
│   │   ├── controllers/   # Route handlers
│   │   ├── database/      # MongoDB connection
│   │   ├── middlewares/   # Auth, upload middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routes
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helpers, JWT, scheduler
│   ├── tests/             # Integration tests
│   ├── uploads/           # Uploaded files
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── assets/        # Static images
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (Auth, Theme)
│   │   ├── pages/         # Page components
│   │   └── services/      # API service calls
│   ├── public/
│   └── package.json
└── package.json           # Root — runs both concurrently
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HealthPilot.git
   cd HealthPilot
   ```

2. Install all dependencies:
   ```bash
   npm install
   cd Backend && npm install
   cd ../Frontend && npm install
   ```

3. Configure environment variables:

   **Backend** — create `Backend/.env.development.local`:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_strong_jwt_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** — create `Frontend/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   VITE_IMAGE_BACKEND=your_image_upload_service_url
   ```

4. Run the full stack (both Frontend and Backend concurrently):
   ```bash
   npm run local
   ```

   Or run individually:
   ```bash
   # Backend only
   cd Backend && npm run dev

   # Frontend only
   cd Frontend && npm run dev
   ```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/reset-password` | Request password reset OTP |
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/:id` | Get user profile |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/services` | List healthcare services |
| GET | `/api/reports` | View medical reports |
| GET | `/api/reviews` | View reviews |
| GET | `/api/dashboard` | Dashboard analytics (admin) |

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `DB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password (not account password) |
| `FRONTEND_URL` | URL of the frontend (for CORS) |
| `PORT` | Backend server port (default: 3000) |

> **Never commit `.env` files.** See `.gitignore`.

---

## Running Tests

```bash
cd Backend
npm run test
```

---

## Deployment

Both services are deployed on **Vercel**:

- Frontend uses `Frontend/vercel.json` for SPA routing configuration
- Backend is deployed as a serverless Node.js function

---

## Security Notes

- All passwords are hashed with bcryptjs before storage
- JWT tokens are used for stateless session management
- Route-level middleware enforces role-based access control
- Rate limiting is applied to auth endpoints
- File uploads are validated and stored in `/Backend/uploads/`
- **Never commit `.env` files** — rotate any credentials that may have been exposed

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is for educational and portfolio purposes.
