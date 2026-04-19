import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";
import websiteRouter from "./routes/websiteroute.js";
import billingRouter from "./routes/billroutes.js";
import {stripeWebhook}  from "./controllers/stripewebhookcontroller.js";
dotenv.config();

const app = express();
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }),
  stripeWebhook
);
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// //  Fix COOP issue for Firebase popup auth
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   next();
// });

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use('/api/billing', billingRouter);
// Start server after DB connects
const startServer = async () => {
  try {
    await connectdb();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();