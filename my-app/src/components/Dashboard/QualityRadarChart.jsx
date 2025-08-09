'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

const data = [
  { metric: 'Speed', value: 120 },
  { metric: 'Accuracy', value: 98 },
  { metric: 'Efficiency', value: 86 },
  { metric: 'Cost', value: 99 },
  { metric: 'Durability', value: 85 },
];

export default function QualityRadarChart() {
  return (
    <div className="card shadow-sm border-0 p-3">
      <h6 className="fw-bold mb-3">Component Quality Metrics</h6>
      <RadarChart outerRadius={90} width={500} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis />
        <Radar name="Quality" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </div>
  );
}
