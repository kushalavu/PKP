'use client';
import React, { useState } from 'react';
import TestingUnitsTable from '@/components/TestingUnitsForm/TestingUnitsTable';

const TestingUnitsForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    osmNumber: '',
    accepted: '',
    rejected: '',
    total: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    //  API here
  };

  return (
<>
      <h4 className='fw-bold'>Testing Unit (OSM)</h4>
      <p className="text-muted small init-nav-co">Please fill out the form to submit Testing Unit (OSM) Details</p>
<hr/>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label clr-label">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control frm-input-style" required />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Part Name</label>
          <select name="partName" value={formData.partName} onChange={handleChange} className="form-select frm-input-style" required>
            <option value="">Select a category</option>
            <option value="Motor">Motor</option>
            <option value="Bearing">Bearing</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">OSM Number</label>
          <input type="text" name="osmNumber" value={formData.osmNumber} onChange={handleChange} className="form-control frm-input-style" required />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Accepted</label>
          <input type="number" name="accepted" value={formData.accepted} onChange={handleChange} className="form-control frm-input-style" />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Rejected</label>
          <input type="number" name="rejected" value={formData.rejected} onChange={handleChange} className="form-control frm-input-style" />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Total</label>
          <input type="number" name="total" value={formData.total} onChange={handleChange} className="form-control frm-input-style" />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-blue-clr px-4 mt-3">Submit</button>
        </div>
      </form>
 </>
    
  );
};

export default TestingUnitsForm;
