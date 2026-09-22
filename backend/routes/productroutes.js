import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productcontroller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only protected routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;