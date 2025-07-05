import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00d1ff', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const AgencyBarChart = ({ data }) => {
  const chartHeight = Math.max(100, 50 * data.length); // keeps it readable

  if (!data || data.length === 0) {
    return <p style={{ color: 'gray', textAlign: 'center' }}>No agency data to display.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height: chartHeight }}
    >
      <h3 style={{ color: '#00d1ff', marginBottom: '1rem' }}>Satellites by Agency</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AgencyBarChart;
