'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { month: 'JAN', units: 435 },
  { month: 'FEB', units: 654 },
  { month: 'MAR', units: 456 },
  { month: 'APR', units: 342 },
  { month: 'MAY', units: 789 },
  { month: 'JUN', units: 543 },
  { month: 'JUL', units: 654 },
  { month: 'AUG', units: 234 },
  { month: 'SEP', units: 432 },
  { month: 'OCT', units: 432 },
  { month: 'NOV', units: 432 },
  { month: 'DEC', units: 214 },
];

export default function BarChartSection() {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="fw-bold mb-3">Total Approved Units</h6>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="units" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
