import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "nanthakumar2006geetha02@gmail.com";

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role || "user",
      email: user.email,
    },
    process.env.JWT_SECRET || "secret123",
    {
      expiresIn: "30d",
    }
  );
};

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({
        message: "An account with this email already exists ❌",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    // If email is nanthakumar2006geetha02@gmail.com, auto-assign role as admin
    const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();
    const role = isAdmin ? "admin" : "user";

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hash,
      role,
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: "User Registered Successfully ✅",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server registration error: " + error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User account not found ❌",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Account has been blocked. Contact workshop admin ❌",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid email or password ❌",
      });
    }

    // Ensure nanthakumar2006geetha02@gmail.com is always updated to role: admin
    if (
      normalizedEmail === ADMIN_EMAIL.toLowerCase() &&
      user.role !== "admin"
    ) {
      user.role = "admin";
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server login error: " + error.message,
    });
  }
};

// GET CURRENT USER PROFILE
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};