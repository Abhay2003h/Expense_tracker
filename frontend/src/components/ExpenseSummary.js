import React from "react";
import { formatCurrency } from "../utils/helpers";

/**
 * Shows a quick breakdown of spending per category.
 * The data comes pre-aggregated from the backend (GROUP BY query).
 */
const ExpenseSummary = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="loading-spinner">Loading summary...</div>
      </div>
    );
  }

  if (!summary || summary.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Summary</h2>
        <p className="empty-state">No data yet — add some expenses first.</p>
      </div>
    );
  }

  // grand total across all categories
  const grandTotal = summary.reduce(
    (sum, item) => sum + parseFloat(item.totalAmount),
    0
  );

  return (
    <div className="card">
      <h2 className="card-title">Expense Summary</h2>

      <div className="summary-grid">
        {summary.map((item) => {
          const percentage = ((parseFloat(item.totalAmount) / grandTotal) * 100).toFixed(1);
          return (
            <div key={item.category} className="summary-item">
              <div className="summary-header">
                <span className="category-tag">{item.category}</span>
                <span className="summary-count">{item.count} expenses</span>
              </div>
              <div className="summary-amount">
                {formatCurrency(item.totalAmount)}
              </div>
              {/* visual bar showing how much this category contributes */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="summary-percent">{percentage}%</span>
            </div>
          );
        })}
      </div>

      <div className="grand-total">
        <span>Grand Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
};

export default ExpenseSummary;
