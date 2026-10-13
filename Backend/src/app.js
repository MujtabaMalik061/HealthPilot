import { PORT, FRONTEND_URL } from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
import servicesRoute from "./routes/service.routes.js";
import usersRoute from "./routes/users.routes.js";
import reportsRoute from "./routes/reports.routes.js";
import appointmentsRoute from "./routes/appointments.routes.js";
import reviewsRoute from "./routes/reviews.routes.js";

import connectToDB from "./database/mongodb.js";
import { startMailScheduler } from "./utils/mail.scheduler.js";

const app = express();
const allowedOrigins = [
  "https://healthpilot-system.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  ...(FRONTEND_URL ? [new URL(FRONTEND_URL).origin] : []),
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Initialize the database after CORS, so connection errors retain its headers.
app.use("/api", async (req, res, next) => {
  try {
    await connectToDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({ message: "Database temporarily unavailable" });
  }
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoute);
app.use("/api/users", usersRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/reviews", reviewsRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT || 3000, () => {
    startMailScheduler();
    console.log(`Server is running on http://localhost:${PORT || 3000}`);
  });
}

export default app;
