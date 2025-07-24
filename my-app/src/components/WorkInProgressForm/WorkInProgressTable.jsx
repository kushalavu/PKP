import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const WorkInProgressTable = () => {
  return (
    <div className="mt-5">
      <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Parchment be turns stand veela fawkes mistletoe snare drops.</p>

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
  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <div className="table-responsive over-with-hv">
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Packed</th>
              <th>For Packing</th>
              <th>Under Packing</th>
              <th>For Plating</th>
              <th>Under Heat Treatment</th>
              <th>Under PTFE</th>
              <th>For PTFE</th>
              <th>For Heat Treatment</th>
              <th>Sorted (OK)</th>
              <th>Sorted (Rejected)</th>
              <th>Total Sorted</th>
            </tr>
          </thead>
             <tbody>
        {/* Your many rows here */}
        <tr>
          <td>Row 1</td>
          <td>Data</td>
          <td>More</td>
        </tr>
        <tr>
          <td>Row 2</td>
          <td>Data</td>
          <td>More</td>
        </tr>
        {/* Add many more rows */}
      </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default WorkInProgressTable;
