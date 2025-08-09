import React from 'react';
import DashboardCards from '@/components/Dashboard/DashboardCards';
import BarChartSection from '@/components/Dashboard/BarChartSection';
import PieCharts from '@/components/Dashboard/PieCharts';
import ProfitLineChart from '@/components/Dashboard/ProfitLineChart';
import RevenueCostChart from '@/components/Dashboard/RevenueCostChart';
import QualityRadarChart from '@/components/Dashboard/QualityRadarChart';
import ProfitComposedChart from '@/components/Dashboard/ProfitComposedChart';

export default function DashboardPage() {
  return (
    <div className="container-fluid p-4">
      <h4 className="fw-bold mb-1">Dashboard</h4>
      <p className="text-muted">View components End to End Details</p>

      <DashboardCards />

      <div className="row mt-4">
        <div className="col-xxl-7 col-12">
          <BarChartSection />
          
        </div>
          <div className="col-xxl-5 col-12 mt-xxl-0 mt-4">
          <PieCharts />
        </div>
          <div className="col-md-8 mt-4">
            <ProfitLineChart />
        </div>
      
         <div className="col-md-4">
           <RevenueCostChart />
        </div>
           <div className="col-md-8 mt-4">
           <ProfitComposedChart />
        </div>
            <div className="col-md-4 mt-4">
            <QualityRadarChart />
        </div>
            
      </div>
    </div>
  );
}
