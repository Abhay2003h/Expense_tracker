const expenseService = require("../services/expenseService");

/**
 * Controller layer — handles HTTP requests and responses.
 * Each method pulls userId from req.user (set by auth middleware)
 * so users only interact with their own expenses.
 */

/** POST /api/expenses — add a new expense */
const addExpense = async (req, res) => {
  try {
    const { amount, category, date } = req.body;
    const userId = req.user.id;

    if (!amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: amount, category, date",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const expense = await expenseService.createExpense({ amount, category, date, userId });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("Error adding expense:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/** GET /api/expenses — list all expenses with pagination */
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await expenseService.getAllExpenses(userId, page, limit);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/** GET /api/expenses/filter — filter by category and/or date range */
const filterExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await expenseService.filterExpenses(
      userId,
      { category, startDate, endDate },
      page,
      limit
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error filtering expenses:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/** GET /api/expenses/summary — category-wise totals */
const getExpenseSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const summary = await expenseService.getExpenseSummary(userId);

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Error fetching summary:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/** DELETE /api/expenses/:id — remove an expense */
const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const deleted = await expenseService.deleteExpense(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/** GET /api/expenses/categories — distinct category list */
const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await expenseService.getCategories(userId);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  filterExpenses,
  getExpenseSummary,
  deleteExpense,
  getCategories,
};
