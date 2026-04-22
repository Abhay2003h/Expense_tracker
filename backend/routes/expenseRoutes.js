const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/auth");

// all expense routes require authentication
router.use(authMiddleware);

// specific routes go first so Express doesn't match them as :id
router.get("/summary", expenseController.getExpenseSummary);
router.get("/filter", expenseController.filterExpenses);
router.get("/categories", expenseController.getCategories);

router.post("/", expenseController.addExpense);
router.get("/", expenseController.getExpenses);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
