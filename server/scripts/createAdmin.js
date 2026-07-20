import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      email: "admin@bookhub.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");

      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin12345", 10);

    const admin = await User.create({
      name: "BookHub Admin",

      email: "admin@bookhub.com",

      phone: "0700000000",

      password: hashedPassword,

      role: "admin",
    });

    console.log("Admin created successfully", admin.email);

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

createAdmin();
