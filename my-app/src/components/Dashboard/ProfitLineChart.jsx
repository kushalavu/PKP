'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const profitData = [
  { month: 'JAN', profit: 12000 },
  { month: 'FEB', profit: 15000 },
  { month: 'MAR', profit: 18000 },
  { month: 'APR', profit: 9000 },
  { month: 'MAY', profit: 22000 },
  { month: 'JUN', profit: 19500 },
  { month: 'JUL', profit: 24000 },
  { month: 'AUG', profit: 18500 },
  { month: 'SEP', profit: 17000 },
  { month: 'OCT', profit: 20000 },
  { month: 'NOV', profit: 23000 },
  { month: 'DEC', profit: 25000 },
];

export default function ProfitLineChart() {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="fw-bold mb-3">Monthly Profit Trend</h6>
      <LineChart width={600} height={300} data={profitData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}
