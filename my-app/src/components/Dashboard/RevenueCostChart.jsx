'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Revenue', value: 75000 },
  { name: 'Cost', value: 25000 },
];

const COLORS = ['#00C49F', '#FF8042'];

export default function RevenueCostChart() {
  return (
    <div className="card shadow-sm border-0 p-3 mt-4">
      <h6 className="fw-bold mb-3">Revenue vs Cost</h6>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
