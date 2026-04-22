const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "expense-tracker-secret-key-2026";

/**
 * Register a new user.
 * @param {Object} data - { name, email, password }
 * @returns {Object} { user, token }
 */
const register = async (data) => {
  const user = await User.create(data);
  const token = generateToken(user.id);
  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

/**
 * Login with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Object} { user, token }
 */
const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("No account found with this email");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  const token = generateToken(user.id);
  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

/**
 * Create a JWT token that expires in 7 days.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Verify a JWT token and return the decoded payload.
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { register, login, verifyToken };
