const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

/**
 * Expense model — maps directly to the `expenses` table in MySQL.
 *
 * Columns:
 *  - id: auto-incrementing primary key
 *  - amount: how much was spent (up to 99,999,999.99)
 *  - category: what it was spent on (e.g. "Food", "Transport")
 *  - date: when it happened
 *  - created_at: auto-filled timestamp for record-keeping
 */
const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Amount is required" },
        isDecimal: { msg: "Amount must be a valid number" },
        min: { args: [0.01], msg: "Amount must be greater than zero" },
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: { msg: "Category is required" },
        notEmpty: { msg: "Category cannot be empty" },
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "Date is required" },
        isDate: { msg: "Date must be a valid date" },
      },
    },
  },
  {
    tableName: "expenses",
    timestamps: true,        // let Sequelize manage createdAt / updatedAt
    createdAt: "created_at",
    updatedAt: false,        // we only care about creation time
  }
);

module.exports = Expense;
