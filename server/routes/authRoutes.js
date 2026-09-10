import express from "express";
import rateLimit from "express-rate-limit";

import { register, login, profile, registerSeller } from "../controllers/authController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many registration attempts. Please try again later." },
});

router.post("/register", registrationLimiter, register);

router.post("/login", loginLimiter, login);

router.post("/seller/register", registrationLimiter, registerSeller);

router.get(
  "/profile",

  auth,

  profile,
);

export default router;
