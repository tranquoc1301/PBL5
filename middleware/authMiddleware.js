const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Forbidden: Admin access required." });
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res
      .status(403)
      .json({ error: "Forbidden: User access required." });
  }
  next();
};
