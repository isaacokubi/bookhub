import express from "express";

import { register, login, profile, registerSeller } from "../controllers/authController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/seller/register", registerSeller);

router.get(
  "/profile",

  auth,

  profile,
);

export default router;
