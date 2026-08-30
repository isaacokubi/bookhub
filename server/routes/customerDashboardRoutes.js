import express from "express";
import auth from "../middleware/auth.js";
import { getCustomerDashboard } from "../controllers/customerDashboardController.js";

const router = express.Router();
router.get("/", auth, getCustomerDashboard);
export default router;
