const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the user to req
exports.protect = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "User no longer exists" });
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based access control: allow("hr", "manager")
exports.allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: "Access denied for your role" });
