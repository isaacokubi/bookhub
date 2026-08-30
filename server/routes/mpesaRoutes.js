import express from "express";

import {
  initiatePayment,
  getPaymentStatus,
  mpesaCallback,
} from "../controllers/mpesaController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/stkpush", auth, initiatePayment);
router.get("/status/:orderId", auth, (req, res, next) => {
  req.params.orderId = req.params.orderId;
  return getPaymentStatus(req, res, next);
});
router.post("/callback", mpesaCallback);

export default router;
