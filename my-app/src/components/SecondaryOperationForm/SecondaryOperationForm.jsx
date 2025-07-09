'use client';
import React, { useState } from 'react';
import SecondaryOperationTable from './SecondaryOperationTable';

const SecondaryOperationForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    coreCSKDone: '',
    coreVisualDone: '',
    magneticDrill: '',
    magneticVisual: '',
    pivotPin: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container-fluid form-complete-bg p-4">
        <h5 className='fw-bold mt-2'>Secondary Operation Details</h5>
        <p className="text-muted small init-nav-co">
          Please fill out the form to submit Secondary Operation Details
        </p>
        <hr/>
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
              <label className="form-label clr-label">Core CSK Done (in Quantity)</label>
              <input type="number" name="coreCSKDone" value={formData.coreCSKDone} onChange={handleChange} className="form-control frm-input-style" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label clr-label">Core Visual Done (in Quantity)</label>
              <input type="number" name="coreVisualDone" value={formData.coreVisualDone} onChange={handleChange} className="form-control frm-input-style" />
            </div>
            <div className="col-md-4">
              <label className="form-label clr-label">Magnetic Core Drill (in Quantity)</label>
              <input type="number" name="magneticDrill" value={formData.magneticDrill} onChange={handleChange} className="form-control frm-input-style" />
            </div>
            <div className="col-md-4">
              <label className="form-label clr-label">Magnetic Core Visual Done (in Quantity)</label>
              <input type="number" name="magneticVisual" value={formData.magneticVisual} onChange={handleChange} className="form-control frm-input-style" />
            </div>
       
            <div className="col-md-4 mt-3">
              <label className="form-label clr-label">Pivot Pin SS PIP Done (in Quantity)</label>
              <input type="number" name="pivotPin" value={formData.pivotPin} onChange={handleChange} className="form-control frm-input-style" />
            </div>
            <div className="col-md-4 mt-4">
              <button type="submit" className="btn btn-blue-clr px-4 mt-4">Submit</button>
            </div>
               </div>
        </form>

      <div className="row">
        <div className="col-sm-12">
          <SecondaryOperationTable />
        </div>
      </div>

    </div>
  );
};

export default SecondaryOperationForm;
