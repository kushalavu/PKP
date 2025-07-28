import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const cardData = [
  { title: 'Total Approved Units', value: '47512' },
  { title: 'Total Defects', value: '47512' },
  { title: 'Total Lost Units', value: '14%' },
  { title: 'Defect Cost', value: '$489,25' },
  { title: 'Total Revenue', value: '47512' },
  { title: 'Total RM', value: '475KG' },
];

export default function DashboardCards() {
  return (
    <div className="row g-3">
      {cardData.map((item, idx) => (
        <div key={idx} className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">{item.title}</h6>
                  <h5 className="fw-bold">{item.value}</h5>
                </div>
                <FaChartLine size={30} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
