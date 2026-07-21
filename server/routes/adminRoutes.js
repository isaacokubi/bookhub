import express from "express";

import {
  getDashboard,
  getUsers,
  getBooks,
  getOrders,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.use(adminMiddleware);

router.get("/dashboard", getDashboard);

router.get("/users", getUsers);

router.get("/books", getBooks);

router.get("/orders", getOrders);

export default router;
