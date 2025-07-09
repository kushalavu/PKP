import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
const MachineStoppageTable = () => {
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

      {/* Table */}
      <div className="table-responsive over-with-hv">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part</th>
              <th>No of M/C Allotted</th>
              <th>Running Machines</th>
              <th>Machines Not Running</th>
              <th>Under Setting</th>
              <th>Maintenance</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-03-12</td>
              <td>Part A</td>
              <td>12</td>
              <td>10</td>
              <td>2</td>
              <td>0</td>
              <td>Yes</td>
              <td>Routine check</td>
            </tr>
            <tr>
              <td colSpan="8">No additional data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachineStoppageTable;
