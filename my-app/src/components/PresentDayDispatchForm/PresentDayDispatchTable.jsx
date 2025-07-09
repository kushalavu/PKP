import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const PresentDayDispatchTable = () => {
  return (
    <div className="mt-5">
      <h5><strong>PRIMARY DATA</strong></h5>
      <p className="text-muted">Parchment be turns stand veela fawkes mistletoe snare drops.</p>

      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input type="date" className="form-control frm-table-style" placeholder="Choose a date" />
        </div>
        <div className="col-md-2">
          <select className="form-select frm-table-style">
            <option>Part Name</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select frm-table-style">
            <option>Accepted/Rejected</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select frm-table-style">
            <option>Deleted</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-outline-secondary w-100">Clear All <IoMdCloseCircleOutline /></button>
        </div>
      </div>

      <div className="table-responsive over-with-hv">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Part Name</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresentDayDispatchTable;
