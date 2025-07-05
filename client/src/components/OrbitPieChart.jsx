import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ['#00bcd4', '#ff9800', '#4caf50', '#e91e63', '#9c27b0'];

const OrbitPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p style={{ textAlign: 'center' }}>No orbit data available.</p>;
  }

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"      // ✅ FIXED
        nameKey="orbit"      // ✅ FIXED
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default OrbitPieChart;
