import jwt from "jsonwebtoken";
import User from "../models/user.js";

const ADMIN_EMAIL = "nanthakumar2006geetha02@gmail.com";

// Protect routes for logged in users
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret123"
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User account not found ❌" });
      }

      if (req.user.status === "blocked") {
        return res.status(403).json({ message: "Account is blocked ❌" });
      }

      next();
    } catch (error) {
      console.error("Auth token error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token ❌" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided ❌" });
  }
};

// Admin only access restriction
export const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" ||
      req.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())
  ) {
    next();
  } else {
    return res.status(403).json({
      message: "Access Denied: Only Admin (nanthakumar2006geetha02@gmail.com) can access this resource ❌",
    });
  }
};
