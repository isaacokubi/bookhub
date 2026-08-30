import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

// =======================
// Register Customer
// =======================
export const register = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email,
      phone: String(phone).trim(),
      password: hashedPassword,
      role: "buyer",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// Register Seller
// =======================
export const registerSeller = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const seller = await User.create({
      name: String(name).trim(),
      email,
      phone: String(phone).trim(),
      password: hashedPassword,
      role: "seller",
    });

    const token = jwt.sign(
      { id: seller._id, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      message: "Seller registered successfully",
      token,
      user: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        role: seller.role,
      },
    });
  } catch (error) {
    console.error("Seller register error:", error);
    res.status(500).json({ message: "Unable to register seller" });
  }
};

// =======================
// Login User / Seller / Admin
// =======================
export const login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =======================
// Get Profile
// =======================
export const profile = async (req, res) => {
  res.json(req.user);
};
