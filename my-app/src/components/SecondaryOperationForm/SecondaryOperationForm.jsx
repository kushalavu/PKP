'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SecondaryOperationTable from './SecondaryOperationTable';

const SecondaryOperationForm = () => {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    coreCSKDone: '',
    coreVisualDone: '',
    magneticDrill: '',
    magneticVisual: '',
    pivotPin: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.partName) newErrors.partName = 'Part Name is required';
    if (!formData.coreCSKDone) newErrors.coreCSKDone = 'Core CSK Done is required';
    if (!formData.coreVisualDone) newErrors.coreVisualDone = 'Core Visual Done is required';
    if (!formData.magneticDrill) newErrors.magneticDrill = 'Magnetic Drill is required';
    if (!formData.magneticVisual) newErrors.magneticVisual = 'Magnetic Visual is required';
    if (!formData.pivotPin) newErrors.pivotPin = 'Pivot Pin is required';
    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length) {
    setErrors(validationErrors);
    return;
  }

  try {
    setLoading(true);
    await axios.post('/api/secondary-operation', formData);

    // Show success message
    toast.success("Data submitted successfully");

    // Reset form
    setFormData({
      date: '',
      partName: '',
      coreCSKDone: '',
      coreVisualDone: '',
      magneticDrill: '',
      magneticVisual: '',
      pivotPin: '',
    });
    setErrors({});
    
    // Trigger table refresh
    setRefreshFlag(prev => prev + 1); 
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Failed to submit data');
  } finally {
    setLoading(false);
  }
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
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Select Date"
              className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Part Name</label>
            <select
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              className={`form-select frm-input-style ${errors.partName ? 'is-invalid' : ''}`}
            >
              <option value="">Select a part</option>
              <option value="Part A">Part A</option>
              <option value="Part B">Part B</option>
            </select>
            {errors.partName && <div className="invalid-feedback">{errors.partName}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Core CSK Done</label>
            <input
              type="number"
              name="coreCSKDone"
              value={formData.coreCSKDone}
              onChange={handleChange}
              placeholder="Enter Core CSK Done"
              className={`form-control frm-input-style ${errors.coreCSKDone ? 'is-invalid' : ''}`}
            />
            {errors.coreCSKDone && <div className="invalid-feedback">{errors.coreCSKDone}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Core Visual Done</label>
            <input
              type="number"
              name="coreVisualDone"
              value={formData.coreVisualDone}
              onChange={handleChange}
              placeholder="Enter Core Visual Done"
              className={`form-control frm-input-style ${errors.coreVisualDone ? 'is-invalid' : ''}`}
            />
            {errors.coreVisualDone && <div className="invalid-feedback">{errors.coreVisualDone}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Magnetic Core Drill</label>
            <input
              type="number"
              name="magneticDrill"
              value={formData.magneticDrill}
              onChange={handleChange}
              placeholder="Enter Magnetic Drill"
              className={`form-control frm-input-style ${errors.magneticDrill ? 'is-invalid' : ''}`}
            />
            {errors.magneticDrill && <div className="invalid-feedback">{errors.magneticDrill}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Magnetic Core Visual Done</label>
            <input
              type="number"
              name="magneticVisual"
              value={formData.magneticVisual}
              onChange={handleChange}
              placeholder="Enter Magnetic Visual Done"
              className={`form-control frm-input-style ${errors.magneticVisual ? 'is-invalid' : ''}`}
            />
            {errors.magneticVisual && <div className="invalid-feedback">{errors.magneticVisual}</div>}
          </div>
          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Pivot Pin SS PIP Done</label>
            <input
              type="number"
              name="pivotPin"
              value={formData.pivotPin}
              onChange={handleChange}
              placeholder="Enter Pivot Pin Done"
              className={`form-control frm-input-style ${errors.pivotPin ? 'is-invalid' : ''}`}
            />
            {errors.pivotPin && <div className="invalid-feedback">{errors.pivotPin}</div>}
          </div>
          <div className="col-md-4 mt-4">
            <button
              type="submit"
              className="btn btn-blue-clr px-4 mt-4"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
            {errors.submit && <div className="text-danger mt-2">{errors.submit}</div>}
          </div>
        </div>
      </form>

      <div className="row">
        <div className="col-sm-12">
          <SecondaryOperationTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
};

export default SecondaryOperationForm;
