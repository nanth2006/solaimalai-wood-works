import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  trackOrder,
  getAllOrders,
  updateWorkingProcess,
  deleteOrder,
} from "../controller/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Public / Customer routes
router.post("/", createOrder);
router.get("/track/:identifier", trackOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin-only routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/process", protect, adminOnly, updateWorkingProcess);
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;
