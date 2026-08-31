import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDatabase from "./config/database.js";
import cartRoutes from "./routes/cartRoutes.js";
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
import categoryRoutes from "./routes/categoryRoutes.js";
import customerDashboardRoutes from "./routes/customerDashboardRoutes.js";
import { approveExistingSellerBooks } from "./scripts/approveExistingSellerBooks.js";
import { expireStalePendingPayments, getPaymentTimeoutMs } from "./services/paymentService.js";
import sanitize from "./middleware/sanitize.js";
import { securityMiddleware } from "./middleware/security.js";
import errorHandler from "./middleware/errorHandler.js";
import setupSocket from "./sockets/socket.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

// Render/ngrok and other reverse proxies forward the real client IP through
// X-Forwarded-For. Trust the first proxy hop so express-rate-limit can safely
// identify clients without the ERR_ERL_UNEXPECTED_X_FORWARDED_FOR warning.
app.set("trust proxy", 1);

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET is required and must be at least 32 characters long");
}

const allowedOrigins = String(process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

securityMiddleware(app);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(sanitize);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => res.json({ message: "BookHub Kenya API Running", status: "success" }));
app.get("/health", (req, res) => res.json({ status: "OK", server: "BookHub Kenya API", time: new Date() }));

app.use("/api/cart", cartRoutes);
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
app.use("/api/categories", categoryRoutes);
app.use("/api/customer/dashboard", customerDashboardRoutes);

app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, credentials: true, methods: ["GET", "POST"] },
});
setupSocket(io);

const startServer = async () => {
  await connectDatabase();

  await approveExistingSellerBooks();
  await expireStalePendingPayments();

  const paymentExpiryTimer = setInterval(() => {
    expireStalePendingPayments().catch((error) => {
      console.error("Payment expiry job failed:", error);
    });
  }, 10_000);
  paymentExpiryTimer.unref?.();

  httpServer.listen(port, () => {
    console.log(`BookHub API running on port ${port}`);
    console.log(`Allowed frontend origins: ${allowedOrigins.join(", ")}`);
    console.log(`M-Pesa pending timeout: ${Math.round(getPaymentTimeoutMs() / 60000)} minute(s)`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
