import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productroutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Product from "./models/product.js";
import { defaultProducts } from "./controller/productcontroller.js";

dotenv.config();

const app = express();

// Flexible CORS for all local dev environments and networks
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost / 127.0.0.1 or undefined (like curl/postman)
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Solaimalai Wood Works Backend API",
    time: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

// Seed products if collection is empty
const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(defaultProducts);
      console.log("🪵 Default solid teak products seeded into MongoDB ✅");
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully ✅");
    await seedProductsIfEmpty();
    app.listen(PORT, () => {
      console.log(`🪵 Solaimalai Wood Works backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err.message);
  });