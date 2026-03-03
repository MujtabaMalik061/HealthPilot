import { PORT } from "./config/env.js";

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
connectToDB();

app.use(cors()); // allow all without credentials like header and auth

app.use(cors({ origin: "https://healthpilot-system.vercel.app", credentials: true })); // allow only added origin with credentials like header and auth

app.use(cors({origin: (origin, callback) => {callback(null, true)},credentials: true})); // allow all origin with credentials like header and auth

app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

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

app.listen(PORT, async () => {
  await connectToDB();
  startMailScheduler();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
