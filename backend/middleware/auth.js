const authService = require("../services/authService");
const User = require("../models/User");

/**
 * Middleware that checks for a valid JWT token in the Authorization header.
 * If valid, attaches the user object to req.user and calls next().
 * If missing or invalid, returns 401.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated — please log in",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = authService.verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
