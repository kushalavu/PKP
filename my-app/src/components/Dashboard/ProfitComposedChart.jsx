'use client';

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { month: 'JAN', revenue: 30000, profit: 10000 },
  { month: 'FEB', revenue: 40000, profit: 15000 },
  { month: 'MAR', revenue: 35000, profit: 12000 },
  { month: 'APR', revenue: 45000, profit: 20000 },
];

export default function ProfitComposedChart() {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="fw-bold mb-3">Revenue and Profit Breakdown</h6>
      <ComposedChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="profit" stroke="#ff7300" />
      </ComposedChart>
    </div>
  );
}
