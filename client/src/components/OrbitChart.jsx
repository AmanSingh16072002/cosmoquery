import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#0088FE", "#FF6384"];

const OrbitChart = ({ data }) => {
  if (!data || data.length === 0) {
  return <p style={{ color: "gray", textAlign: "center" }}>No orbit data available to display.</p>;
  }


  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* DEBUG: fixed size */}
      <div style={{ width: 300, height: 300, margin: "0 auto" }}>
        <PieChart width={300} height={300}>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </motion.div>
  );
};

export default OrbitChart;
