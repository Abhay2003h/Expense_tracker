import React, { useState, useEffect, useCallback } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseFilter from "../components/ExpenseFilter";
import ExpenseSummary from "../components/ExpenseSummary";
import ChartComponent from "../components/ChartComponent";
import {
  getExpenses,
  filterExpenses,
  getExpenseSummary,
} from "../services/expenseService";
import { toast } from "react-toastify";

/**
 * Main dashboard page — brings together all the pieces:
 * form, list, filters, summary, and charts.
 */
const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // fetch all expenses (no filter)
  const fetchExpenses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getExpenses(page);
      if (res.success) {
        setExpenses(res.data.expenses);
        setPagination({
          total: res.data.total,
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
        });
      }
    } catch (error) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch category-wise summary
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await getExpenseSummary();
      if (res.success) setSummary(res.data);
    } catch (error) {
      toast.error("Failed to load summary");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [fetchExpenses, fetchSummary]);

  // called after a new expense is added — refresh everything
  const handleExpenseAdded = () => {
    if (isFiltered) {
      handleFilter(currentFilters, currentPage);
    } else {
      fetchExpenses(currentPage);
    }
    fetchSummary();
  };

  // apply filters
  const handleFilter = async (filters, page = 1) => {
    setLoading(true);
    setIsFiltered(true);
    setCurrentFilters(filters);
    setCurrentPage(page);
    try {
      const res = await filterExpenses(filters, page);
      if (res.success) {
        setExpenses(res.data.expenses);
        setPagination({
          total: res.data.total,
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
        });
      }
    } catch (error) {
      toast.error("Failed to filter expenses");
    } finally {
      setLoading(false);
    }
  };

  // clear filters and go back to showing everything
  const handleClearFilter = () => {
    setIsFiltered(false);
    setCurrentFilters({});
    setCurrentPage(1);
    fetchExpenses(1);
  };

  // pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (isFiltered) {
      handleFilter(currentFilters, page);
    } else {
      fetchExpenses(page);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Left column — form and filters */}
        <div className="dashboard-sidebar">
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          <ExpenseFilter onFilter={handleFilter} onClear={handleClearFilter} />
        </div>

        {/* Right column — list, summary, charts */}
        <div className="dashboard-main">
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onRefresh={handleExpenseAdded}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
          <ExpenseSummary summary={summary} loading={summaryLoading} />
          <ChartComponent summary={summary} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
