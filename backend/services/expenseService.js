const { Op, fn, col } = require("sequelize");
const Expense = require("../models/Expense");

/**
 * Service layer — all the database logic lives here,
 * keeping our controllers thin and focused on HTTP stuff.
 * Every query is scoped to a specific userId so users
 * only ever see their own data.
 */

/**
 * Create a new expense record.
 * @param {Object} data - { amount, category, date, userId }
 * @returns {Promise<Object>} newly created expense
 */
const createExpense = async (data) => {
  return await Expense.create(data);
};

/**
 * Fetch all expenses for a specific user, newest first.
 * Supports optional pagination via page/limit params.
 * @param {number} userId - the logged-in user's ID
 * @param {number} page - which page (1-based)
 * @param {number} limit - items per page
 * @returns {Promise<Object>} { rows, count, totalPages, currentPage }
 */
const getAllExpenses = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Expense.findAndCountAll({
    where: { userId },
    order: [["date", "DESC"]],
    limit,
    offset,
  });

  return {
    expenses: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

/**
 * Filter expenses by category and/or date range for a specific user.
 * All filter params are optional — pass what you need.
 * @param {number} userId
 * @param {Object} filters - { category, startDate, endDate }
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<Object>}
 */
const filterExpenses = async (userId, filters, page = 1, limit = 10) => {
  const where = { userId };

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date[Op.gte] = filters.startDate;
    if (filters.endDate) where.date[Op.lte] = filters.endDate;
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Expense.findAndCountAll({
    where,
    order: [["date", "DESC"]],
    limit,
    offset,
  });

  return {
    expenses: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

/**
 * Get total spending grouped by category for a specific user.
 * @param {number} userId
 * @returns {Promise<Array>} [{ category, totalAmount }, ...]
 */
const getExpenseSummary = async (userId) => {
  const summary = await Expense.findAll({
    attributes: [
      "category",
      [fn("SUM", col("amount")), "totalAmount"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: { userId },
    group: ["category"],
    order: [[fn("SUM", col("amount")), "DESC"]],
    raw: true,
  });

  return summary;
};

/**
 * Delete a single expense — only if it belongs to the given user.
 * @param {number} id
 * @param {number} userId
 * @returns {Promise<boolean>} true if deleted, false if not found
 */
const deleteExpense = async (id, userId) => {
  const deleted = await Expense.destroy({ where: { id, userId } });
  return deleted > 0;
};

/**
 * Grab all unique categories for a specific user.
 * @param {number} userId
 * @returns {Promise<Array<string>>}
 */
const getCategories = async (userId) => {
  const results = await Expense.findAll({
    attributes: [[fn("DISTINCT", col("category")), "category"]],
    where: { userId },
    order: [["category", "ASC"]],
    raw: true,
  });

  return results.map((r) => r.category);
};

module.exports = {
  createExpense,
  getAllExpenses,
  filterExpenses,
  getExpenseSummary,
  deleteExpense,
  getCategories,
};
