import axios from "axios";
import { getToken } from "./authService";

// Base URL for our backend
const API_URL = "http://localhost:5000/api/expenses";

// helper — builds an Authorization header from the stored token
const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

/**
 * Add a new expense to the database.
 * @param {Object} expenseData - { amount, category, date }
 */
export const addExpense = async (expenseData) => {
  const response = await axios.post(API_URL, expenseData, authHeader());
  return response.data;
};

/**
 * Fetch all expenses with pagination.
 * @param {number} page
 * @param {number} limit
 */
export const getExpenses = async (page = 1, limit = 10) => {
  const response = await axios.get(API_URL, {
    params: { page, limit },
    ...authHeader(),
  });
  return response.data;
};

/**
 * Filter expenses by category and/or date range.
 */
export const filterExpenses = async (filters, page = 1, limit = 10) => {
  const params = { page, limit };
  if (filters.category) params.category = filters.category;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  const response = await axios.get(`${API_URL}/filter`, {
    params,
    ...authHeader(),
  });
  return response.data;
};

/**
 * Get category-wise expense totals.
 */
export const getExpenseSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`, authHeader());
  return response.data;
};

/**
 * Delete an expense by ID.
 * @param {number} id
 */
export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader());
  return response.data;
};

/**
 * Get the list of unique categories from the backend.
 */
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`, authHeader());
  return response.data;
};
