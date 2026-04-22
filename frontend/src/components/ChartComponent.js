import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { getChartColor } from "../utils/helpers";

/**
 * Renders a pie chart and a bar chart side by side (or stacked on mobile).
 * Both show the same data — category-wise expense breakdown —
 * but the two formats highlight different aspects (proportion vs magnitude).
 */
const ChartComponent = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return null; // nothing to chart yet
  }

  // reshape the data so Recharts can work with it
  const chartData = summary.map((item) => ({
    name: item.category,
    value: parseFloat(item.totalAmount),
  }));

  return (
    <div className="card">
      <h2 className="card-title">Visual Breakdown</h2>

      <div className="charts-grid">
        {/* Pie chart — great for seeing proportions at a glance */}
        <div className="chart-container">
          <h3 className="chart-subtitle">Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={getChartColor(index)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — easier to compare absolute amounts */}
        <div className="chart-container">
          <h3 className="chart-subtitle">Category Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
              />
              <Legend />
              <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={getChartColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
