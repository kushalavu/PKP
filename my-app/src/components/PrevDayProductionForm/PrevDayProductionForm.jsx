'use client';
import React, { useState } from 'react';
import PrevDayProductionTable from './PrevDayProductionTable';
import { toast } from 'react-toastify';
import axios from 'axios';

const PrevDayProductionForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    machineNumber: '',
    capacity: '',
    shift1: '',
    shift2: '',
    totalNumbers: '',
    productionAchieved: '',
    productionTarget: '',
    inspectedQuantity: '',
    sortedOK: '',
    sortedRejected: '',
    totalSorted: '',
    sortingOut: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numeric fields
    const numericFields = ['capacity','shift1','shift2','productionAchieved','productionTarget','inspectedQuantity','sortedOK','sortedRejected','sortingOut'];
    const newValue = numericFields.includes(name) ? value.replace(/\D/g,'') : value;

    // Update field
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Clear error
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Auto-calculate totals
    if (name === 'shift1' || name === 'shift2') {
      const shift1 = name === 'shift1' ? parseInt(newValue || 0) : parseInt(formData.shift1 || 0);
      const shift2 = name === 'shift2' ? parseInt(newValue || 0) : parseInt(formData.shift2 || 0);
      setFormData(prev => ({ ...prev, totalNumbers: shift1 + shift2 }));
    }

    if (name === 'sortedOK' || name === 'sortedRejected') {
      const sortedOK = name === 'sortedOK' ? parseInt(newValue || 0) : parseInt(formData.sortedOK || 0);
      const sortedRejected = name === 'sortedRejected' ? parseInt(newValue || 0) : parseInt(formData.sortedRejected || 0);
      setFormData(prev => ({ ...prev, totalSorted: sortedOK + sortedRejected }));
    }
  };

  // Validate form
  const validateForm = () => {
    let tempErrors = {};
    const requiredFields = [
      'date','partName','machineNumber','capacity','shift1','shift2',
      'productionAchieved','productionTarget','inspectedQuantity',
      'sortedOK','sortedRejected','sortingOut'
    ]; // Remove totalNumbers and totalSorted from required validation

    requiredFields.forEach(field => {
      if (!formData[field]) tempErrors[field] = 'This field is required';
    });

    const numericFields = [
      'capacity','shift1','shift2','productionAchieved','productionTarget',
      'inspectedQuantity','sortedOK','sortedRejected','sortingOut'
    ]; // Remove totalNumbers and totalSorted

    numericFields.forEach(field => {
      if (formData[field] && isNaN(formData[field])) tempErrors[field] = 'Must be a number';
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('/api/prev-day-production', formData);
      toast.success('Prev Day Production submitted successfully!');
      setFormData({
        date: '', partName: '', machineNumber: '', capacity: '',
        shift1: '', shift2: '', totalNumbers: '', productionAchieved: '',
        productionTarget: '', inspectedQuantity: '', sortedOK: '',
        sortedRejected: '', totalSorted: '', sortingOut: ''
      });
      setErrors({});
      setRefreshTable(prev => !prev);
    } catch (err) {
      console.error(err);
      toast.error('Submission failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Input field renderer
  const renderInput = (label, name, placeholder, readOnly = false, type = 'text') => (
    <div className="col-md-4">
      <label className="form-label clr-label">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onFocus={() => setErrors(prev => ({ ...prev, [name]: '' }))}
        className={`form-control frm-input-style ${errors[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {/* Show error only if field is not read-only */}
      {!readOnly && errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  // Dropdown renderer
  const renderSelect = (label, name, options) => (
    <div className="col-md-4">
      <label className="form-label clr-label">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onFocus={() => setErrors(prev => ({ ...prev, [name]: '' }))}
        className={`form-select frm-input-style ${errors[name] ? 'is-invalid' : ''}`}
      >
        <option value="">-- Select {label} --</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container-fluid form-complete-bg p-4">
      <h4 className="fw-bold mt-2">Prev Day Production</h4>
      <p className="text-muted small init-nav-co">Please fill out the form completely</p>
      <hr />

      <form className="row g-3" onSubmit={handleSubmit}>
        {renderInput('Date', 'date', '', false, 'date')}
        {renderSelect('Part Name', 'partName', ['Motor','Bearing'])}
        {renderSelect('Machine Number', 'machineNumber', ['Machine 1','Machine 2','Machine 3'])}
        {renderInput('Capacity', 'capacity', 'Enter capacity')}
        {renderInput('1st Shift', 'shift1', '1st Shift')}
        {renderInput('2nd Shift', 'shift2', '2nd Shift')}
        {renderInput('Total Numbers', 'totalNumbers', 'Total Numbers', true)} {/* no error */}
        {renderInput('% Production Achieved', 'productionAchieved', '% Production Achieved')}
        {renderInput('Production Target', 'productionTarget', 'Production Target')}
        {renderInput('Inspected Quantity', 'inspectedQuantity', 'Inspected Quantity')}
        {renderInput('Sorted (OK)', 'sortedOK', 'Sorted OK')}
        {renderInput('Sorted (Rejected)', 'sortedRejected', 'Sorted Rejected')}
        {renderInput('Total Sorted', 'totalSorted', 'Total Sorted', true)} {/* no error */}
        {renderInput('Sorting Out (Quantity)', 'sortingOut', 'Sorting Out')}

        <div className="col-12">
          <button type="submit" className="btn btn-blue-clr px-4 mt-3" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="row mt-4">
        <div className="col-sm-12">
          <PrevDayProductionTable refresh={refreshTable} />
        </div>
      </div>
    </div>
  );
};

export default PrevDayProductionForm;
