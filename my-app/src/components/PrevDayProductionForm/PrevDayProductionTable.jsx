'use client';
import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const PrevDayProductionTable = () => {
  return (
    <div className="mt-5">
       <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Parchment be turns stand veela fawkes mistletoe snare drops.</p>

      {/* Filters */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        <input type="date" className="form-control frm-table-style" style={{ maxWidth: '180px' }} />
        <select className="form-select frm-table-style" style={{ maxWidth: '180px' }}>
          <option>Part Name</option>
        </select>
        <select className="form-select frm-table-style" style={{ maxWidth: '180px' }}>
          <option>Accepted/Rejected</option>
        </select>
        <select className="form-select frm-table-style" style={{ maxWidth: '180px' }}>
          <option>Deleted</option>
        </select>
        <button className="btn btn-outline-secondary">Clear All <IoMdCloseCircleOutline /></button>
      </div>

      {/* Table */}
      <div className="table-scroll-wrapper over-with-hv">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>Machine Number</th>
              <th>Capacity</th>
              <th>1st Shift</th>
              <th>2nd Shift</th>
              <th>Total in Numbers</th>
              <th>% of Production Achieved</th>
              <th>Production (Target)</th>
              <th>Inspected Quantity</th>
              <th>Sorted (OK)</th>
              <th>Sorted (Rejected)</th>
              <th>Total Sorted</th>
              <th>Sorting out (Qty)</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
                  <tbody className='mt-3'>
            {Array.from({ length: 30 }).map((_, i) => (
              <tr key={i}>
                <td>2025-07-26</td>
                <td>Item {i + 1}</td>
                <td>OSM123{i}</td>
                <td>12</td>
                <td>3</td>
                <td>15</td>
                <td>12</td>
                <td>3</td>
                 <td>2025-07-26</td>
                <td>Item {i + 1}</td>
                <td>OSM123{i}</td>
                <td>15</td>
                 <td>3</td>
                 <td>15</td>
                <td>Edit</td>
                <td>Delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrevDayProductionTable;
