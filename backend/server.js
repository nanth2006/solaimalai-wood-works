import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productroutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Product from "./models/product.js";
import { defaultProducts } from "./controller/productcontroller.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allowed Origins List for Vercel production and local development
const allowedOrigins = [
  "http://solaimalai-wood-works-14a5-rho.vercel.app",
  "https://solaimalai-wood-works-14a5-rho.vercel.app",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

// Flexible CORS Configuration supporting Vercel preview/production domains & local dev
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.toLowerCase().trim().replace(/\/$/, "");

      // Check against explicit list, custom CLIENT_URL, localhost, or any vercel.app domain
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        (process.env.CLIENT_URL &&
          process.env.CLIENT_URL.toLowerCase().trim().replace(/\/$/, "") === normalizedOrigin) ||
        normalizedOrigin.includes("localhost") ||
        normalizedOrigin.includes("127.0.0.1") ||
        normalizedOrigin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }

      // Allow request but log warning if unknown origin
      console.warn(`[CORS] Request from origin: ${origin}`);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads directory serving (if local image storage is used)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.get("/", (req, res) => {
  res.send("Solaimalai Wood Works Backend is Running");
});

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
