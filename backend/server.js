const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, testConnection } = require("./utils/db");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());                     // allow frontend to call us
app.use(express.json());             // parse JSON request bodies

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// simple health check so we can verify the server is alive
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running 🚀" });
});

// --- Start the server ---
const startServer = async () => {
  await testConnection();

  // sync() creates the table if it doesn't exist yet.
  // In production you'd use migrations instead, but this is fine for dev.
  await sequelize.sync({ alter: true });
  console.log("✓ Database tables synced.");

  app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
  });
};

startServer();
