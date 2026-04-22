# Expense Tracker — Full Stack Application

A clean, modern expense tracking app built with **React**, **Node.js/Express**, **MySQL**, and **Sequelize**.

![React](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MySQL](https://img.shields.io/badge/MySQL-Sequelize-orange)

---

## Features

- **Add expenses** with amount, category, and date (with validation)
- **View all expenses** in a paginated table
- **Filter** by category and/or date range
- **Category-wise summary** with progress bars and grand total
- **Charts** — pie chart (distribution) and bar chart (comparison) via Recharts
- **Dark mode** toggle
- **Toast notifications** for success/error feedback
- **Responsive design** — works on desktop, tablet, and mobile
- **Delete expenses** with confirmation prompt

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, Recharts, React-Toastify |
| Backend  | Node.js, Express.js     |
| Database | MySQL                   |
| ORM      | Sequelize               |

---

## Project Structure

```
Panthera/
├── backend/
│   ├── controllers/
│   │   └── expenseController.js    # HTTP request handlers
│   ├── models/
│   │   └── Expense.js              # Sequelize model definition
│   ├── routes/
│   │   └── expenseRoutes.js        # API route definitions
│   ├── services/
│   │   └── expenseService.js       # Business logic & DB queries
│   ├── utils/
│   │   └── db.js                   # MySQL connection setup
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── server.js                   # Express app entry point
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ExpenseForm.js       # Add expense form with validation
│       │   ├── ExpenseList.js       # Paginated expense table
│       │   ├── ExpenseFilter.js     # Category & date range filters
│       │   ├── ExpenseSummary.js    # Category-wise totals
│       │   └── ChartComponent.js   # Pie & bar charts
│       ├── pages/
│       │   └── Dashboard.js        # Main page composing all components
│       ├── services/
│       │   └── expenseService.js   # Axios API calls
│       ├── utils/
│       │   └── helpers.js          # Formatting utilities
│       ├── App.js                  # Root component with dark mode
│       └── App.css                 # Complete stylesheet
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Node.js** (v16+)
- **MySQL** (v8+) — use MySQL Workbench for management
- **npm** or **yarn**

### 1. Set Up the Database

Open MySQL Workbench and run:

```sql
CREATE DATABASE expense_db;
```

That's it — Sequelize will create the `expenses` table automatically on first run.

### 2. Configure the Backend

```bash
cd backend

# Install dependencies
npm install

# Edit the .env file with your MySQL credentials
# Open backend/.env and update:
#   DB_PASSWORD=your_mysql_password
```

### 3. Start the Backend

```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

### 4. Start the Frontend

```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## API Documentation

### Base URL: `http://localhost:5000/api/expenses`

| Method | Endpoint     | Description                  | Query Params                          |
|--------|-------------|------------------------------|---------------------------------------|
| POST   | `/`          | Add a new expense            | Body: `{ amount, category, date }`    |
| GET    | `/`          | Get all expenses (paginated) | `page`, `limit`                       |
| GET    | `/filter`    | Filter expenses              | `category`, `startDate`, `endDate`, `page`, `limit` |
| GET    | `/summary`   | Category-wise totals         | —                                     |
| GET    | `/categories`| List unique categories       | —                                     |
| DELETE | `/:id`       | Delete an expense            | —                                     |

### Example: Add an Expense

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 250.50, "category": "Food", "date": "2026-04-17"}'
```

### Example Response

```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "id": 1,
    "amount": "250.50",
    "category": "Food",
    "date": "2026-04-17",
    "created_at": "2026-04-17T10:30:00.000Z"
  }
}
```

---

## Database Schema

```sql
CREATE TABLE expenses (
  id          INT           PRIMARY KEY AUTO_INCREMENT,
  amount      DECIMAL(10,2) NOT NULL,
  category    VARCHAR(100)  NOT NULL,
  date        DATE          NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

| Variable    | Default     | Description           |
|-------------|-------------|-----------------------|
| DB_HOST     | localhost   | MySQL host            |
| DB_PORT     | 3306        | MySQL port            |
| DB_USER     | root        | MySQL username        |
| DB_PASSWORD | —           | MySQL password        |
| DB_NAME     | expense_db  | Database name         |
| PORT        | 5000        | Backend server port   |

---

## License

MIT
