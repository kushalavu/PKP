'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const componentData = [
  { name: 'A', value: 30 },
  { name: 'B', value: 20 },
  { name: 'C', value: 10 },
  { name: 'D', value: 40 },
];

const lostUnitData = [
  { name: 'Accepted', value: 30 },
  { name: 'Lost', value: 30 },
  { name: 'Defected', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function PieCharts() {
  return (
<>
<div className="row">
    <div className="col-sm-6">
   <div className="card shadow-sm border-0 p-3">
        <h6 className="fw-bold mb-3">Type of Components</h6>
        <PieChart width={300} height={300}>
          <Pie data={componentData} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
            {componentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
    <div className="col-sm-6">
      <div className="card shadow-sm border-0 p-3">
        <h6 className="fw-bold mb-3">Lost Units</h6>
        <PieChart width={300} height={300}>
          <Pie data={lostUnitData} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
            {lostUnitData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
</div>
   

</>
  );
}
