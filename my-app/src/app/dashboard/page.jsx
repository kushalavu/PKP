import React from 'react';
import DashboardCards from '@/components/Dashboard/DashboardCards';
import BarChartSection from '@/components/Dashboard/BarChartSection';
import PieCharts from '@/components/Dashboard/PieCharts';

export default function DashboardPage() {
  return (
    <div className="container-fluid p-4">
      <h4 className="fw-bold mb-1">Dashboard</h4>
      <p className="text-muted">View components End to End Details</p>

      <DashboardCards />

      <div className="row mt-4">
        <div className="col-md-8">
          <BarChartSection />
        </div>
        <div className="col-md-4">
          <PieCharts />
        </div>
      </div>
    </div>
  );
}
