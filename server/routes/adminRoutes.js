// server/routes/adminRoutes.js

import express from "express";

import {
  getDashboard,
  getUsers,
  getBooks,
  getOrders,
  deleteUser,
  deleteBook,
  updateOrderStatus,
  getSellers,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";


const router = express.Router();


// Apply authentication and admin authorization
router.use(protect);
router.use(adminOnly);


// =======================
// DASHBOARD
// =======================

router.get(
  "/dashboard",
  getDashboard
);


// =======================
// USERS MANAGEMENT
// =======================

router.get(
  "/users",
  getUsers
);


router.delete(
  "/users/:id",
  deleteUser
);


// =======================
// BOOK MANAGEMENT
// =======================

router.get(
  "/books",
  getBooks
);


router.delete(
  "/books/:id",
  deleteBook
);


// =======================
// ORDER MANAGEMENT
// =======================

router.get(
  "/orders",
  getOrders
);


router.put(
  "/orders/:id",
  updateOrderStatus
);


// =======================
// SELLER MANAGEMENT
// =======================

router.get(
  "/sellers",
  getSellers
);


export default router;