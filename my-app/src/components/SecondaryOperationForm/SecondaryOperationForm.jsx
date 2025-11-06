'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SecondaryOperationTable from './SecondaryOperationTable';

const SecondaryOperationForm = () => {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
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
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.coreCSKDone) newErrors.coreCSKDone = 'Core CSK Done is required';
    if (!formData.coreVisualDone) newErrors.coreVisualDone = 'Core Visual Done is required';
    if (!formData.magneticDrill) newErrors.magneticDrill = 'Magnetic Drill is required';
    if (!formData.magneticVisual) newErrors.magneticVisual = 'Magnetic Visual is required';
    if (!formData.pivotPin) newErrors.pivotPin = 'Pivot Pin is required';
    return newErrors;
  };

  // Submit handler
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
      toast.success('Data submitted successfully');

      setFormData({
        date: '',
        coreCSKDone: '',
        coreVisualDone: '',
        magneticDrill: '',
        magneticVisual: '',
        pivotPin: '',
      });
      setErrors({});
      setRefreshFlag(prev => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
const dd = String(today.getDate()).padStart(2, '0');
const todayLocal = `${yyyy}-${mm}-${dd}`;

  return (
    <>
      <h5 className='fw-bold mt-2'>Secondary Operation Details</h5>
      <p className='text-muted small init-nav-co'>
        Please fill out the form to submit Secondary Operation Details
      </p>
      <hr className='mb-4 hr-sty-all' />

      <form onSubmit={handleSubmit}>
        <div className='row mb-3'>
          {/* Date */}
          <div className='col-md-4'>
            <label className='form-label clr-label'>Date</label>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              max={todayLocal}
              className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <div className='invalid-feedback'>{errors.date}</div>}
          </div>

          {/* Core CSK Done */}
          <div className='col-md-4'>
            <label className='form-label clr-label'>Core CSK Done</label>
            <input
              type='number'
              name='coreCSKDone'
              value={formData.coreCSKDone}
              onChange={handleChange}
              placeholder='Enter Core CSK Done'
              className={`form-control frm-input-style ${errors.coreCSKDone ? 'is-invalid' : ''}`}
            />
            {errors.coreCSKDone && (
              <div className='invalid-feedback'>{errors.coreCSKDone}</div>
            )}
          </div>

          {/* Core Visual Done */}
          <div className='col-md-4'>
            <label className='form-label clr-label'>Core Visual Done</label>
            <input
              type='number'
              name='coreVisualDone'
              value={formData.coreVisualDone}
              onChange={handleChange}
              placeholder='Enter Core Visual Done'
              className={`form-control frm-input-style ${errors.coreVisualDone ? 'is-invalid' : ''}`}
            />
            {errors.coreVisualDone && (
              <div className='invalid-feedback'>{errors.coreVisualDone}</div>
            )}
          </div>

          {/* Magnetic Drill */}
          <div className='col-md-4 mt-3'>
            <label className='form-label clr-label'>Magnetic Drill</label>
            <input
              type='number'
              name='magneticDrill'
              value={formData.magneticDrill}
              onChange={handleChange}
              placeholder='Enter Magnetic Drill'
              className={`form-control frm-input-style ${errors.magneticDrill ? 'is-invalid' : ''}`}
            />
            {errors.magneticDrill && (
              <div className='invalid-feedback'>{errors.magneticDrill}</div>
            )}
          </div>

          {/* Magnetic Visual */}
          <div className='col-md-4 mt-3'>
            <label className='form-label clr-label'>Magnetic Visual</label>
            <input
              type='number'
              name='magneticVisual'
              value={formData.magneticVisual}
              onChange={handleChange}
              placeholder='Enter Magnetic Visual'
              className={`form-control frm-input-style ${errors.magneticVisual ? 'is-invalid' : ''}`}
            />
            {errors.magneticVisual && (
              <div className='invalid-feedback'>{errors.magneticVisual}</div>
            )}
          </div>

          {/* Pivot Pin */}
          <div className='col-md-4 mt-3'>
            <label className='form-label clr-label'>Pivot Pin SS PIP Done</label>
            <input
              type='number'
              name='pivotPin'
              value={formData.pivotPin}
              onChange={handleChange}
              placeholder='Enter Pivot Pin'
              className={`form-control frm-input-style ${errors.pivotPin ? 'is-invalid' : ''}`}
            />
            {errors.pivotPin && (
              <div className='invalid-feedback'>{errors.pivotPin}</div>
            )}
          </div>
        </div>

        <div className='col-md-4 mt-4'>
          <button
            type='submit'
            className='btn btn-blue-clr px-4 mt-3'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className='row mt-4'>
        <div className='col-sm-12'>
          <SecondaryOperationTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </>
  );
};

export default SecondaryOperationForm;
