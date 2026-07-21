import express from "express";
import dotenv from "dotenv";
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

dotenv.config();

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

const app = express();

connectDatabase();

securityMiddleware(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://bookhub-swart.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(sanitize);
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "BookHub Kenya API Running",
  });
});

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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

setupSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
