import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

const requiredEnv = ["MONGODB_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const email = normalizeEmail(process.env.ADMIN_EMAIL);
    const password = String(process.env.ADMIN_PASSWORD);

    if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD must be at least 12 characters long");
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
        throw new Error(`A non-admin user already exists with ${email}`);
      }
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: process.env.ADMIN_NAME || "BookHub Admin",
      email,
      phone: process.env.ADMIN_PHONE || "0700000000",
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin();
