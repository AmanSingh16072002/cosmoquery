import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const OrbitTypeChart = ({ satellites }) => {
  const orbitCounts = satellites.reduce((acc, sat) => {
    acc[sat.orbitType] = (acc[sat.orbitType] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(orbitCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
      <h3>Satellites by Orbit Type</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrbitTypeChart;
