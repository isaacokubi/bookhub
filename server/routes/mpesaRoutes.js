import express from "express";

import {
  initiatePayment,
  getPaymentStatus,
  mpesaCallback,
} from "../controllers/mpesaController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/stkpush", auth, initiatePayment);
router.get("/status/:orderId", auth, getPaymentStatus);
router.post("/callback", mpesaCallback);

export default router;
