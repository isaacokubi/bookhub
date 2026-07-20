import express from "express";

import auth from "../middleware/auth.js";

import {
  requestWithdrawal,
  myWithdrawals,
} from "../controllers/withdrawalController.js";

const router = express.Router();

router.post(
  "/",

  auth,

  requestWithdrawal,
);

router.get(
  "/",

  auth,

  myWithdrawals,
);

export default router;
