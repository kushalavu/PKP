'use client';
import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const TestingUnitsTable = () => {
  return (
<>
      <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Parchment be turns stand veela fawkes mistletoe snare drops.</p>

      {/* Filters */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        <input type="date" className="form-control frm-table-style me-2" style={{ maxWidth: '200px' }} />
        <select className="form-select frm-table-style" style={{ maxWidth: '200px' }}>
          <option>Part Name</option>
        </select>
        <select className="form-select frm-table-style" style={{ maxWidth: '200px' }}>
          <option>Accepted/Rejected</option>
        </select>
        <select className="form-select frm-table-style" style={{ maxWidth: '200px' }}>
          <option>Deleted</option>
        </select>
        <button className="btn btn-outline-secondary">Clear All <IoMdCloseCircleOutline /></button>
      </div>

      {/* Table */}
     {/* Table Scroll Wrapper */}
      <div className="table-scroll-wrapper">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>OSM Number</th>
              <th>Accepted</th>
              <th>Rejected</th>
              <th>Total</th>
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
                <td>Edit</td>
                <td>Delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
  );
};

export default TestingUnitsTable;

