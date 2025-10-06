'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import FileUploadBlock from './FileUploadBlock';

const NewRequirementForm = () => {
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [formData, setFormData] = useState({
    partName: '',
    date: '',
    rawMaterial: '',
    rawMaterialSize: '',
    rawMaterialCompany: '',
    rawMaterialDrawing: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.partName) newErrors.partName = 'Part Name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.rawMaterial) newErrors.rawMaterial = 'Raw Material is required';
    if (!formData.rawMaterialSize) newErrors.rawMaterialSize = 'Raw Material Size is required';
    if (!formData.rawMaterialCompany) newErrors.rawMaterialCompany = 'Raw Material Company is required';
    if (!formData.rawMaterialDrawing) newErrors.rawMaterialDrawing = 'Raw Material Drawing is required';
    if (!file) newErrors.file = 'File is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Prepare JSON payload with file base64
      const payload = {
        ...formData,
        fileBase64,
        fileName: file?.name,
      };

      const res = await axios.post('/api/new-requirement', payload);

      toast.success(res.data.message); // SUCCESS

      // Reset form
      setFormData({
        partName: '',
        date: '',
        rawMaterial: '',
        rawMaterialSize: '',
        rawMaterialCompany: '',
        rawMaterialDrawing: ''
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
      <div className="col-xxl-4 col-lg-6 col-md-7 col-12 mb-4">
        <div className="p-4 rounded form-bg main-wrapper">
          <h5 className="fw-bold">New Requirement</h5>
          <p className="text-muted small init-nav-co">
            Please fill out the form to submit a new client requirement for processing.
          </p>
          <hr />
          <form onSubmit={handleSubmit}>
            {/* Part Name */}
            <div className="mb-3">
              <label className="form-label clr-label">Part Name</label>
              <select
                name="partName"
                className={`form-select frm-input-style ${errors.partName ? 'is-invalid' : ''}`}
                value={formData.partName}
                onChange={handleChange}
              >
                <option value="">Select Part Name</option>
                <option value="Component A">Component A</option>
                <option value="Component B">Component B</option>
              </select>
              {errors.partName && <div className="invalid-feedback">{errors.partName}</div>}
            </div>

            {/* Date */}
            <div className="mb-3">
              <label className="form-label clr-label">Date</label>
              <input
                type="date"
                name="date"
                className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            {/* Raw Material */}
            <div className="mb-3">
              <label className="form-label clr-label">Raw Material (Metal)</label>
              <input
                type="text"
                name="rawMaterial"
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
                className={`form-control frm-input-style ${errors.rawMaterialSize ? 'is-invalid' : ''}`}
                value={formData.rawMaterialSize}
                onChange={handleChange}
              />
              {errors.rawMaterialSize && <div className="invalid-feedback">{errors.rawMaterialSize}</div>}
            </div>

            {/* Raw Material Company */}
            <div className="mb-3">
              <label className="form-label clr-label">Raw Material Company</label>
              <input
                type="text"
                name="rawMaterialCompany"
                className={`form-control frm-input-style ${errors.rawMaterialCompany ? 'is-invalid' : ''}`}
                value={formData.rawMaterialCompany}
                onChange={handleChange}
              />
              {errors.rawMaterialCompany && <div className="invalid-feedback">{errors.rawMaterialCompany}</div>}
            </div>

            {/* Raw Material Drawing */}
            <div className="mb-3">
              <label className="form-label clr-label">Raw Material Drawing No.</label>
              <input
                type="text"
                name="rawMaterialDrawing"
                className={`form-control frm-input-style ${errors.rawMaterialDrawing ? 'is-invalid' : ''}`}
                value={formData.rawMaterialDrawing}
                onChange={handleChange}
              />
              {errors.rawMaterialDrawing && <div className="invalid-feedback">{errors.rawMaterialDrawing}</div>}
            </div>

            {/* Submit Button */}
            <div className="row">
              <div className="col-sm-5 mt-3">
                <button type="submit" className="btn btn-blue-clr w-100" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="col-xxl-8 col-lg-6 col-md-5 col-12">
        <FileUploadBlock file={file} setFile={setFile} setFileBase64={setFileBase64} />
        {errors.file && <p className="text-danger mt-2">{errors.file}</p>}
      </div>
  </>
  );
};

export default NewRequirementForm;
