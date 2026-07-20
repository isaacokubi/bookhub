import express from "express";

import {
  createOrder,
  myOrders,
  sellerOrders,
} from "../controllers/orderController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createOrder);

router.get("/my", auth, myOrders);

router.get("/seller", auth, sellerOrders);

export default router;
