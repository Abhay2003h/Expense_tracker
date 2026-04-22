const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * Sets up the Sequelize connection to our MySQL database.
 * Reads credentials from environment variables so we never
 * hard-code passwords into the source code.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // turn off SQL query logging in console (set to console.log to debug)
  }
);

/**
 * Quick check to make sure we can actually talk to the database.
 * Called once when the server boots up.
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ MySQL connection established successfully.");
  } catch (error) {
    console.error("✗ Unable to connect to MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
