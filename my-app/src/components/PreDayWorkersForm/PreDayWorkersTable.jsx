import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const PreDayWorkersTable = () => {
  return (
    <div className="mt-5">
       <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Parchment be turns stand veela fawkes mistletoe snare drops.</p>

      {/* Filter Section */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input type="date" className="form-control frm-table-style" />
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

      {/* Table Section */}
      <div className="table-responsive over-with-hv">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Core Drilling</th>
              <th>Core Visual</th>
              <th>Magnetic Core Drilling</th>
              <th>Magnetic Core Visual</th>
              <th>PIP</th>
              <th>Sorting Out</th>
              <th>Plated Visual</th>
              <th>Pole Tap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="9">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreDayWorkersTable;
