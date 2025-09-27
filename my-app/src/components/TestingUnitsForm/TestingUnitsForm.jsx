'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TestingUnitsTable from './TestingUnitsTable';

const TestingUnitsForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    osmNumber: '',
    accepted: '',
    rejected: '',
    total: '',
  });
  const [loading, setLoading] = useState(false);

  // Store errors for each field
  const [errors, setErrors] = useState({});

  const tableRef = useRef();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Calculate total automatically
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'accepted' || name === 'rejected') {
        updated.total =
          parseInt(updated.accepted || 0) + parseInt(updated.rejected || 0);
      }
      return updated;
    });

    // Clear error when typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Clear error on focus
  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form before submit
  const validateForm = () => {
    let newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.partName) newErrors.partName = 'Part name is required';
    if (!formData.osmNumber) newErrors.osmNumber = 'OSM number is required';
    if (!formData.accepted) newErrors.accepted = 'Accepted count is required';
    if (!formData.rejected) newErrors.rejected = 'Rejected count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/testing-units', formData);

      toast.success('Testing Unit submitted successfully');

      setFormData({
        date: '',
        partName: '',
        osmNumber: '',
        accepted: '',
        rejected: '',
        total: '',
      });
      setErrors({});

      if (tableRef.current) tableRef.current.fetchUnits();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-sm-12 mt-3">
        <h4 className="fw-bold">Testing Unit (OSM)</h4>
        <p className="text-muted small init-nav-co">
          Please fill out the form to submit Testing Unit (OSM) Details
        </p>
        <hr />
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label clr-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              onFocus={handleFocus}
              className="form-control frm-input-style"
            />
            {errors.date && <span className="text-danger">{errors.date}</span>}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Part Name</label>
            <select
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              onFocus={handleFocus}
              className="form-select frm-input-style"
            >
              <option value="">Select a category</option>
              <option value="Motor">Motor</option>
              <option value="Bearing">Bearing</option>
            </select>
            {errors.partName && (
              <span className="text-danger">{errors.partName}</span>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">OSM Number</label>
            <input
              type="text"
              name="osmNumber"
              value={formData.osmNumber}
              onChange={handleChange}
              onFocus={handleFocus}
              className="form-control frm-input-style"
              placeholder="Please enter OSM number"
            />
            {errors.osmNumber && (
              <span className="text-danger">{errors.osmNumber}</span>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Accepted</label>
            <input
              type="number"
              name="accepted"
              value={formData.accepted}
              onChange={handleNumberChange}
              onFocus={handleFocus}
              className="form-control frm-input-style"
              placeholder="accepted count"
            />
            {errors.accepted && (
              <span className="text-danger">{errors.accepted}</span>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Rejected</label>
            <input
              type="number"
              name="rejected"
              value={formData.rejected}
              onChange={handleNumberChange}
              onFocus={handleFocus}
              className="form-control frm-input-style"
              placeholder="rejected count"
            />
            {errors.rejected && (
              <span className="text-danger">{errors.rejected}</span>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label clr-label">Total</label>
            <input
              type="number"
              name="total"
              value={formData.total}
              className="form-control frm-input-style"
              readOnly
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-blue-clr px-4 mt-3"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="col-sm-12 mt-3">
        <TestingUnitsTable ref={tableRef} />
      </div>
    </>
  );
};

export default TestingUnitsForm;
