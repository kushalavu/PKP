'use client';
import React, { useState } from 'react';
import axios from 'axios';
import PresentDayDispatchTable from './PresentDayDispatchTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PresentDayDispatchForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    customer: '',
    partName: '',
    quantity: '',
    newProcess: '',
  });
  const [errors, setErrors] = useState({});
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Update form data and remove field-specific error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate fields
  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.partName) newErrors.partName = 'Part Name is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.newProcess) newErrors.newProcess = 'New Process is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple requests at once
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/present-day-dispatch', formData);
      toast.success(response.data.message);
      setFormData({
        date: '',
        customer: '',
        partName: '',
        quantity: '',
        newProcess: '',
      });
      setErrors({});
      setRefreshFlag(prev => !prev); // refresh table
    } catch (err) {
      console.error('Error submitting:', err);
      const message = err.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid form-complete-bg p-4">
      <h5 className="fw-bold mt-2">Present Day Dispatch</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit <strong>Present Day Dispatch</strong> Details
      </p>
      <hr />
      <form onSubmit={handleSubmit} noValidate>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              onFocus={() => setErrors(prev => ({ ...prev, date: '' }))}
              placeholder="Select Date"
              className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Customer</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              onFocus={() => setErrors(prev => ({ ...prev, customer: '' }))}
              className={`form-select frm-input-style ${errors.customer ? 'is-invalid' : ''}`}
            >
              <option value="">Select a customer</option>
              <option value="Customer A">Customer A</option>
              <option value="Customer B">Customer B</option>
            </select>
            {errors.customer && <div className="invalid-feedback">{errors.customer}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Part Name</label>
            <select
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              onFocus={() => setErrors(prev => ({ ...prev, partName: '' }))}
              className={`form-select frm-input-style ${errors.partName ? 'is-invalid' : ''}`}
            >
              <option value="">Select a part</option>
              <option value="Part X">Part X</option>
              <option value="Part Y">Part Y</option>
            </select>
            {errors.partName && <div className="invalid-feedback">{errors.partName}</div>}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label clr-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onFocus={() => setErrors(prev => ({ ...prev, quantity: '' }))}
              placeholder="Enter quantity"
              className={`form-control frm-input-style ${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Add New Process</label>
            <input
              type="text"
              name="newProcess"
              value={formData.newProcess}
              onChange={handleChange}
              onFocus={() => setErrors(prev => ({ ...prev, newProcess: '' }))}
              placeholder="Add New Process"
              className={`form-control frm-input-style ${errors.newProcess ? 'is-invalid' : ''}`}
            />
            {errors.newProcess && <div className="invalid-feedback">{errors.newProcess}</div>}
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-blue-clr px-4 mt-3"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>

      <div className="row">
        <div className="col-sm-12">
          <PresentDayDispatchTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
};

export default PresentDayDispatchForm;
