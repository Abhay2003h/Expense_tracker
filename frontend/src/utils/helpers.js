/**
 * Format a number as Indian/US currency style.
 * @param {number} amount
 * @returns {string} formatted like "₹1,234.56"
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

/**
 * Format a date string into something human-readable.
 * @param {string} dateStr - ISO date string or "YYYY-MM-DD"
 * @returns {string} like "17 Apr 2026"
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Pick a color from a predefined palette based on index.
 * Used for chart slices so each category gets a distinct color.
 */
const COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444", "#84cc16",
];

export const getChartColor = (index) => {
  return COLORS[index % COLORS.length];
};
