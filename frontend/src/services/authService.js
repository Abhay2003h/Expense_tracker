import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

/**
 * Register a new user account.
 * @param {Object} data - { name, email, password }
 */
export const register = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  if (response.data.success) {
    // save the token and user info so they stay logged in
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }
  return response.data;
};

/**
 * Login with email and password.
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.success) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }
  return response.data;
};

/**
 * Clear local storage and log the user out.
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Check if a user is currently signed in.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get the current user's info from local storage.
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Get the stored JWT token.
 */
export const getToken = () => {
  return localStorage.getItem("token");
};
