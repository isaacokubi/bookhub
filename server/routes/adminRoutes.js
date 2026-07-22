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
  deleteSeller,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";


const router = express.Router();


// =====================================
// APPLY AUTHENTICATION + ADMIN CHECK
// =====================================

router.use(protect);
router.use(adminOnly);



// =====================================
// DASHBOARD
// =====================================

router.get(
  "/dashboard",
  getDashboard
);



// =====================================
// USERS MANAGEMENT
// =====================================

// Get all users
router.get(
  "/users",
  getUsers
);


// Delete user
router.delete(
  "/users/:id",
  deleteUser
);



// =====================================
// BOOK MANAGEMENT
// =====================================

// Get all books
router.get(
  "/books",
  getBooks
);


// Delete book
router.delete(
  "/books/:id",
  deleteBook
);



// =====================================
// ORDER MANAGEMENT
// =====================================

// Get all orders
router.get(
  "/orders",
  getOrders
);


// Update order status
// Example body:
// {
//   "status": "completed"
// }
//
// Allowed examples:
// pending
// processing
// completed
// cancelled

router.put(
  "/orders/:id",
  updateOrderStatus
);



// =====================================
// SELLER MANAGEMENT
// =====================================

// Get all sellers

router.get(
  "/sellers",
  getSellers
);


// Delete seller

router.delete(
  "/sellers/:id",
  deleteSeller
);



export default router;