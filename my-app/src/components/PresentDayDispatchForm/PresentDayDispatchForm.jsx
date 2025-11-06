'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PresentDayDispatchTable from './PresentDayDispatchTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PresentDayDispatchForm = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [parts, setParts] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingParts, setLoadingParts] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    customer: '',
    quantity: '',
    newProcess: '',
    partName: '',
  });

  const [errors, setErrors] = useState({});
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const res = await axios.get('/api/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch companies');
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch parts when customer changes
  useEffect(() => {
    if (!formData.customer) return setParts([]);

    const fetchParts = async () => {
      setLoadingParts(true);
      try {
        const selectedCompany = companies.find(
          c => `${c.name} ${c.location ? `(${c.location})` : ''}` === formData.customer
        );

        if (!selectedCompany) return setParts([]);

        const companyId = selectedCompany.id;
        const res = await axios.get(`/api/parts?companyId=${companyId}`);
        setParts(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch parts');
      } finally {
        setLoadingParts(false);
      }
    };

    fetchParts();
  }, [formData.customer, companies]);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.partName) newErrors.partName = 'Part Name is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.newProcess) newErrors.newProcess = 'New Process is required';
    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/present-day-dispatch', formData);
      toast.success(response.data.message || 'Submitted successfully!');
      setFormData({
        date: '',
        customer: '',
        partName: '',
        quantity: '',
        newProcess: '',
      });
      setErrors({});
      setRefreshFlag(prev => !prev);
    } catch (err) {
      console.error('Error submitting:', err);
      toast.error(err.response?.data?.message || 'Something went wrong!');
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
    <div className="container-fluid form-complete-bg p-4">
      <h5 className="fw-bold mt-2">Present Day Dispatch</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit <strong>Present Day Dispatch</strong> details
      </p>
      <hr />

      <form onSubmit={handleSubmit} noValidate>
        <div className="row mb-3">
          {/* Date */}
          <div className="col-md-4">
            <label className="form-label clr-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={todayLocal}
              className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          {/* Customer */}
          <div className="col-md-4">
            <label className="form-label clr-label">Customer</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className={`form-select frm-input-style ${errors.customer ? 'is-invalid' : ''}`}
            >
              <option value="">Select a customer</option>
              {companies.map(c => (
                <option
                  key={c.id}
                  value={`${c.name} ${c.location ? `(${c.location})` : ''}`}
                >
                  {c.name} {c.location ? `(${c.location})` : ''}
                </option>
              ))}
            </select>
            {errors.customer && <div className="invalid-feedback">{errors.customer}</div>}
          </div>

          {/* Part Name */}
          <div className="col-md-4">
            <label className="form-label clr-label">Part Name</label>
            <select
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              className={`form-select frm-input-style ${errors.partName ? 'is-invalid' : ''}`}
              disabled={!parts.length || loadingParts}
            >
              <option value="">
                {loadingParts ? 'Loading parts...' : 'Select a part'}
              </option>
              {parts.map(p => (
                <option key={p.id} value={`${p.part_name} - ${p.drawing_no || 'N/A'}`}>
                  {p.part_name} - {p.drawing_no || 'N/A'}
                </option>
              ))}
            </select>
            {errors.partName && <div className="invalid-feedback">{errors.partName}</div>}
          </div>
        </div>

        <div className="row mb-4">
          {/* Quantity */}
          <div className="col-md-4">
            <label className="form-label clr-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`form-control frm-input-style ${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>

          {/* New Process */}
          <div className="col-md-4">
            <label className="form-label clr-label">Add New Process</label>
            <input
              type="text"
              name="newProcess"
              value={formData.newProcess}
              onChange={handleChange}
              className={`form-control frm-input-style ${errors.newProcess ? 'is-invalid' : ''}`}
            />
            {errors.newProcess && <div className="invalid-feedback">{errors.newProcess}</div>}
          </div>
        </div>

        {/* Submit button */}
        <div className="col-md-4 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-blue-clr px-4"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="row mt-4">
        <div className="col-sm-12">
          <PresentDayDispatchTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
};

export default PresentDayDispatchForm;
