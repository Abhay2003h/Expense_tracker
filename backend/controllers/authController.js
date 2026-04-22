const authService = require("../services/authService");

/** POST /api/auth/register — create a new account */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const result = await authService.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    // handle duplicate email
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/** POST /api/auth/login — sign in */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    // "No account found" or "Incorrect password" from our service
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
};

/** GET /api/auth/me — get current user from token */
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

module.exports = { register, login, getMe };
