'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import FileUploadBlock from './FileUploadBlock';

const NewRequirementForm = () => {
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    customer: '',
    customerLocation: '',
    partName: '',
    date: '',
    rawMaterial: '',
    rawMaterialSize: '',
    rawMaterialCompany: '',
    rawMaterialDrawing: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch existing customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get('/api/companies');
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Auto-fill location when existing customer selected
  const handleCustomerSelect = (value) => {
    const selected = customers.find(
      (c) => c.name.toLowerCase() === value.toLowerCase()
    );
    if (selected) {
      setFormData({
        ...formData,
        customer: selected.name,
        customerLocation: selected.location || '',
      });
    } else {
      // New customer — clear location
      setFormData({ ...formData, customer: value, customerLocation: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customer) newErrors.customer = 'Customer name is required';
    if (!formData.partName) newErrors.partName = 'Part Name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.rawMaterial) newErrors.rawMaterial = 'Raw Material is required';
    if (!formData.rawMaterialSize) newErrors.rawMaterialSize = 'Raw Material Size is required';
    if (!formData.rawMaterialCompany) newErrors.rawMaterialCompany = 'Raw Material Company is required';
    if (!formData.rawMaterialDrawing) newErrors.rawMaterialDrawing = 'Raw Material Drawing is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ...(file && fileBase64
          ? { fileBase64, fileName: file.name }
          : { fileBase64: null, fileName: null }),
      };

      const res = await axios.post('/api/new-requirement', payload);
      toast.success(res.data.message || 'Requirement submitted successfully');

      // Reset form
      setFormData({
        customer: '',
        customerLocation: '',
        partName: '',
        date: '',
        rawMaterial: '',
        rawMaterialSize: '',
        rawMaterialCompany: '',
        rawMaterialDrawing: '',
      });
      setFile(null);
      setFileBase64('');
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-xxl-4 col-lg-6 col-md-7 col-12 mb-2">
        <div className="p-3 rounded form-bg main-wrapper">
          <h5 className="fw-bold">New Requirement</h5>
          <p className="text-muted small init-nav-co">
            Please fill out the form to submit a new client requirement for processing.
          </p>
          <hr className="mb-3 hr-sty-all" />

          <form onSubmit={handleSubmit}>
             <div className="mb-3">
              <label className="form-label clr-label">Date</label>
              <input
                type="date"
                name="date"
                className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                placeholder="Select Date"
                onChange={handleChange}
              />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>
            {/*Customer Name */}
            <div className="mb-3">
              <label className="form-label clr-label">Customer Name</label>
              <input
                list="customerList"
                name="customer"
                className={`form-control frm-input-style ${errors.customer ? 'is-invalid' : ''}`}
                placeholder="Type or select customer"
                value={formData.customer}
                onChange={(e) => handleCustomerSelect(e.target.value)}
              />
              <datalist id="customerList">
                {customers.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              {errors.customer && <div className="invalid-feedback">{errors.customer}</div>}
            </div>

            {/*Customer Location Field (Dropdown + Manual Entry) */}
            <div className="mb-3">
              <label className="form-label clr-label">Customer Location</label>
              <input
                list="locationList"
                name="customerLocation"
                className={`form-control frm-input-style ${errors.customerLocation ? 'is-invalid' : ''}`}
                placeholder="Type or select a location"
                value={formData.customerLocation}
                onChange={handleChange}
              />
              <datalist id="locationList">
                {[...new Set(customers.map((c) => c.location))]
                  .filter((loc) => loc) // avoid empty
                  .map((loc, index) => (
                    <option key={index} value={loc} />
                  ))}
              </datalist>
              {errors.customerLocation && (
                <div className="invalid-feedback">{errors.customerLocation}</div>
              )}
            </div>


            {/* Part Name */}
            <div className="mb-3">
              <label className="form-label clr-label">Part Name</label>
              <input
                type="text"
                name="partName"
                className={`form-control frm-input-style ${errors.partName ? 'is-invalid' : ''}`}
                placeholder="Enter part name"
                value={formData.partName}
                onChange={handleChange}
              />
              {errors.partName && <div className="invalid-feedback">{errors.partName}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label clr-label">Drawing No. / Item NO.</label>
              <input
                type="text"
                name="rawMaterialDrawing"
                placeholder="Enter Drawing No. / Item NO."
                className={`form-control frm-input-style ${errors.rawMaterialDrawing ? 'is-invalid' : ''}`}
                value={formData.rawMaterialDrawing}
                onChange={handleChange}
              />
              {errors.rawMaterialDrawing && <div className="invalid-feedback">{errors.rawMaterialDrawing}</div>}
            </div>
            {/* Date */}

            {/* Raw Material */}
            <div className="mb-3">
              <label className="form-label clr-label">Raw Material (Metal)</label>
              <input
                type="text"
                name="rawMaterial"
                placeholder="Enter Raw Material"
                className={`form-control frm-input-style ${errors.rawMaterial ? 'is-invalid' : ''}`}
                value={formData.rawMaterial}
                onChange={handleChange}
              />
              {errors.rawMaterial && <div className="invalid-feedback">{errors.rawMaterial}</div>}
            </div>

            {/* Raw Material Size */}
            <div className="mb-3">
              <label className="form-label clr-label">Raw Material Size (dimension of the material)</label>
              <input
                type="text"
                name="rawMaterialSize"
                placeholder="Enter Raw Material Size"
                className={`form-control frm-input-style ${errors.rawMaterialSize ? 'is-invalid' : ''}`}
                value={formData.rawMaterialSize}
                onChange={handleChange}
              />
              {errors.rawMaterialSize && <div className="invalid-feedback">{errors.rawMaterialSize}</div>}
            </div>

            {/* Raw Material Company */}
            <div className="mb-3">
              <label className="form-label clr-label">Raw Material Supply Company</label>
              <input
                type="text"
                name="rawMaterialCompany"
                placeholder="Enter Raw Material Supply Company"
                className={`form-control frm-input-style ${errors.rawMaterialCompany ? 'is-invalid' : ''}`}
                value={formData.rawMaterialCompany}
                onChange={handleChange}
              />
              {errors.rawMaterialCompany && <div className="invalid-feedback">{errors.rawMaterialCompany}</div>}
            </div>

            {/* Raw Material Drawing */}

            {/* Submit */}
            <div className="row">
              <div className="col-sm-5">
                <button type="submit" className="btn btn-blue-clr w-100 mb-5" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* File Upload — Optional */}
      <div className="col-xxl-8 col-lg-6 col-md-5 col-12">
        <FileUploadBlock file={file} setFile={setFile} setFileBase64={setFileBase64} />
      </div>
    </>
  );
};

export default NewRequirementForm;
