import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const SecondaryOperationTable = () => {
  return (
    <div className="mt-5">
       <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Parchment be turns stand veela fawkes mistletoe snare drops.</p>

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input type="date" className="form-control frm-table-style" />
        </div>
        <div className="col-md-2">
          <select className="form-select frm-table-style">
            <option>Part Name</option>
            <option>Part A</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select frm-table-style">
            <option>Accepted/Rejected</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select frm-table-style">
            <option>Deleted</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-outline-secondary w-100">Clear <IoMdCloseCircleOutline /></button>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll-wrapper">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>Core CSK Done</th>
              <th>Core Visual Done</th>
              <th>Magnetic Core Drill</th>
              <th>Magnetic Core Visual Done</th>
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
    </div>
  );
};

export default SecondaryOperationTable;
