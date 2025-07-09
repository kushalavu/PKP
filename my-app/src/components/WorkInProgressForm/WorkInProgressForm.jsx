'use client';
import React, { useState } from 'react';
import WorkInProgressTable from './WorkInProgressTable';

const WorkInProgressForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    packed: '',
    forPacking: '',
    underPacking: '',
    forPlating: '',
    underHeatTreatment: '',
    underPTFE: '',
    forPTFE: '',
    forHeatTreatment: '',
    sortedOk: '',
    sortedRejected: '',
    totalSorted: '',
    newProcess: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // API call logic goes here
  };

  return (
    <div className="container-fluid form-complete-bg p-4">
      <h5 className='fw-bold mt-2'>Work in Progress</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit Work in Progress Details
      </p>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Part Name</label>
            <select name="partName" value={formData.partName} onChange={handleChange} className="form-select frm-input-style">
              <option value="">Select a category</option>
              <option value="Part A">Part A</option>
              <option value="Part B">Part B</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Packed</label>
            <input type="text" name="packed" value={formData.packed} onChange={handleChange} className="form-control frm-input-style" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">For Packing</label>
            <input type="text" name="forPacking" value={formData.forPacking} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Under Packing</label>
            <input type="text" name="underPacking" value={formData.underPacking} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">For Plating</label>
            <input type="text" name="forPlating" value={formData.forPlating} onChange={handleChange} className="form-control frm-input-style" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Under Heat Treatment</label>
            <input type="text" name="underHeatTreatment" value={formData.underHeatTreatment} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Under PTFE</label>
            <input type="text" name="underPTFE" value={formData.underPTFE} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">For PTFE</label>
            <input type="text" name="forPTFE" value={formData.forPTFE} onChange={handleChange} className="form-control frm-input-style" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">For Heat Treatment</label>
            <input type="text" name="forHeatTreatment" value={formData.forHeatTreatment} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Sorted (OK)</label>
            <input type="text" name="sortedOk" value={formData.sortedOk} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Sorted (Rejected)</label>
            <input type="text" name="sortedRejected" value={formData.sortedRejected} onChange={handleChange} className="form-control frm-input-style" />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label clr-label">Total Sorted</label>
            <input type="text" name="totalSorted" value={formData.totalSorted} onChange={handleChange} className="form-control frm-input-style" />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Add New Process</label>
            <input type="text" name="newProcess" value={formData.newProcess} onChange={handleChange} className="form-control frm-input-style" placeholder="Add New Process" />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" className="btn btn btn-blue-clr px-4">Submit</button>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col-sm-12">
          <WorkInProgressTable />
        </div>
      </div>
    </div>
  );
};

export default WorkInProgressForm;
