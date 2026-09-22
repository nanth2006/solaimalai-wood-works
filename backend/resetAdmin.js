import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

dotenv.config();

const resetAndSeedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas successfully ✅");

    // 1. Delete all existing users
    const deleteResult = await User.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing user(s) from database.`);

    // 2. Create the new Admin user
    const adminEmail = "nanthakumar2006geetha02@gmail.com";
    const defaultPassword = "admin123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newAdmin = new User({
      name: "Nanthakumar (Admin)",
      email: adminEmail.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    await newAdmin.save();
    console.log("New Admin User created successfully in Atlas ✅");
    console.log({
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: newAdmin.status,
      defaultPassword: defaultPassword,
    });

    // Check all users in collection now
    const allUsers = await User.find({}, "-password");
    console.log("Current users in database:", allUsers);

    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Atlas Operation Error ❌:", error);
    process.exit(1);
  }
};

resetAndSeedAdmin();
