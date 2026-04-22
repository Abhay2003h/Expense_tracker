import React, { useState } from "react";
import { addExpense } from "../services/expenseService";
import { toast } from "react-toastify";

// some common categories to get started — user can also type custom ones
const SUGGESTED_CATEGORIES = [
  "Food", "Transport", "Entertainment", "Shopping",
  "Bills", "Health", "Education", "Other",
];

/**
 * Form component for adding a new expense.
 * Handles its own validation and shows toast notifications on success/error.
 */
const ExpenseForm = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // run through basic checks before submitting
  const validate = () => {
    const newErrors = {};
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Enter a valid positive amount";
    }
    if (!category.trim()) {
      newErrors.category = "Category is required";
    }
    if (!date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await addExpense({
        amount: parseFloat(amount),
        category: category.trim(),
        date,
      });
      toast.success("Expense added!");
      // reset the form
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setErrors({});
      // tell the parent component to refresh its data
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add expense";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        {/* Amount field */}
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g. 250.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={errors.amount ? "input-error" : ""}
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        {/* Category — pick from suggestions or type your own */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            list="category-suggestions"
            placeholder="e.g. Food, Transport"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={errors.category ? "input-error" : ""}
          />
          <datalist id="category-suggestions">
            {SUGGESTED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Date picker */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={errors.date ? "input-error" : ""}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
