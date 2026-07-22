// server/middleware/adminMiddleware.js

const adminOnly = (req, res, next) => {
  // Make sure user exists (authMiddleware should attach req.user)
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Check admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

export default adminOnly;
