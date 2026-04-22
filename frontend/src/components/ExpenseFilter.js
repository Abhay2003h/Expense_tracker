import React, { useState, useEffect } from "react";
import { getCategories } from "../services/expenseService";

/**
 * Filter bar — lets the user narrow down expenses by category and/or date range.
 * Fetches the list of available categories from the backend on mount.
 */
const ExpenseFilter = ({ onFilter, onClear }) => {
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState([]);

  // pull in the available categories once when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.data);
      } catch {
        // not a big deal if this fails — user can still type
      }
    };
    fetchCategories();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({ category, startDate, endDate });
  };

  const handleClear = () => {
    setCategory("");
    setStartDate("");
    setEndDate("");
    if (onClear) onClear();
  };

  return (
    <div className="card filter-card">
      <h2 className="card-title">Filter Expenses</h2>
      <form onSubmit={handleFilter} className="filter-form">
        <div className="form-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="filter-start">Start Date</label>
          <input
            id="filter-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="filter-end">End Date</label>
          <input
            id="filter-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn btn-primary btn-sm">
            Apply Filter
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseFilter;
