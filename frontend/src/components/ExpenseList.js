import React from "react";
import { deleteExpense } from "../services/expenseService";
import { formatCurrency, formatDate } from "../utils/helpers";
import { toast } from "react-toastify";

/**
 * Displays expenses in a responsive table.
 * Handles delete with a confirmation prompt so the user doesn't
 * accidentally remove something they meant to keep.
 */
const ExpenseList = ({ expenses, loading, onRefresh, pagination, onPageChange }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-spinner">Loading expenses...</div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Expenses</h2>
        <p className="empty-state">
          No expenses found. Start by adding one above!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">
        Expenses
        {pagination && (
          <span className="badge">{pagination.total} total</span>
        )}
      </h2>

      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{formatDate(expense.date)}</td>
                <td>
                  <span className="category-tag">{expense.category}</span>
                </td>
                <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(expense.id)}
                    title="Delete this expense"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
