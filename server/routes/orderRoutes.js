import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createOrder);

router.get("/", auth, getMyOrders);

export default router;
