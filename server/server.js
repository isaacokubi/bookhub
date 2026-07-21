import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDatabase from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";

import sanitize from "./middleware/sanitize.js";
import { securityMiddleware } from "./middleware/security.js";
import errorHandler from "./middleware/errorHandler.js";

import setupSocket from "./sockets/socket.js";


// ===============================
// ENVIRONMENT DEBUG CHECKS
// ===============================

console.log(
  "RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "Loaded" : "Missing",
);

console.log("MPESA ENV CHECK:", {
  consumerKey: process.env.MPESA_CONSUMER_KEY ? "Loaded" : "Missing",

  consumerSecret: process.env.MPESA_CONSUMER_SECRET ? "Loaded" : "Missing",

  shortcode: process.env.MPESA_SHORTCODE || "Missing",

  passkey: process.env.MPESA_PASSKEY ? "Loaded" : "Missing",

  callback: process.env.MPESA_CALLBACK_URL || "Missing",
});

const app = express();

// ===============================
// DATABASE
// ===============================

connectDatabase();

// ===============================
// SECURITY
// ===============================

securityMiddleware(app);

// ===============================
// ALLOWED FRONTEND URLS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",

  "https://bookhub-swart.vercel.app",
];

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

app.use(cookieParser());

// ===============================
// MIDDLEWARE
// ===============================

app.use(sanitize);

app.use(morgan("dev"));

// ===============================
// REQUEST LOGGER
// ===============================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
});

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "BookHub Kenya API Running",

    status: "success",
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",

    server: "BookHub Kenya API",

    time: new Date(),
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/mpesa", mpesaRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/wallet", walletRoutes);

app.use("/api/withdrawals", withdrawalRoutes);

app.use("/api/seller", sellerRoutes);

// ===============================
// ERROR HANDLER
// MUST BE LAST
// ===============================

app.use(errorHandler);

// ===============================
// HTTP SERVER
// ===============================

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// ===============================
// SOCKET.IO
// ===============================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,

    credentials: true,

    methods: ["GET", "POST"],
  },
});

setupSocket(io);

// ===============================
// START SERVER
// ===============================

httpServer.listen(PORT, () => {
  console.log(`BookHub API running on port ${PORT}`);
});
