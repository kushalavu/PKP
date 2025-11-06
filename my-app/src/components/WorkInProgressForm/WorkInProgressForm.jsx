'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkInProgressTable from './WorkInProgressTable';
import { toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const WorkInProgressForm = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [partsLoading, setPartsLoading] = useState(false);
  const [partOptions, setPartOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    packed: '',
    forPacking: '',
    underPacking: '',
    forPlating: '',
    underHeatTreatment: '',
    underPTFE: '',
    forPTFE: '',
    forHeatTreatment: '',
    sortedOK: '',
    sortedRejected: '',
    totalSorted: '',
  });

  // ✅ Get today’s date in yyyy-mm-dd format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayLocal = `${yyyy}-${mm}-${dd}`;

  // ✅ Fetch parts list for dropdown
  useEffect(() => {
    const fetchParts = async () => {
      try {
        setPartsLoading(true);
        const res = await axios.get('/api/parts');
        if (Array.isArray(res.data)) {
          const formattedOptions = res.data.map((part) => ({
            value: `${part.part_name}_${part.drawing_no || 'N/A'}`,
            label: `${part.part_name} - ${part.drawing_no || 'N/A'}`,
          }));
          setPartOptions(formattedOptions);
        } else {
          console.warn('Unexpected parts response:', res.data);
        }
      } catch (err) {
        console.error('Error fetching parts:', err);
        toast.error('Failed to load parts list');
      } finally {
        setPartsLoading(false);
      }
    };

    fetchParts();
  }, []);

  // ✅ Auto calculate total sorted
  useEffect(() => {
    const total =
      (parseInt(formData.sortedOK || 0) || 0) +
      (parseInt(formData.sortedRejected || 0) || 0);
    setFormData((prev) => ({ ...prev, totalSorted: total }));
  }, [formData.sortedOK, formData.sortedRejected]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ✅ Handle dropdown change
  const handlePartChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      partName: selectedOption ? selectedOption.value : '',
    }));
    setErrors((prev) => ({ ...prev, partName: '' }));
  };

  // ✅ Validation for all fields except totalSorted
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = String(formData[key] || '').trim();
      if (!value && key !== 'totalSorted') {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    return newErrors;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/workinprogress', formData);
      if (res.data.success) {
        toast.success('Work in Progress submitted successfully!');
        setErrors({});
        setFormData({
          date: '',
          partName: '',
          packed: '',
          forPacking: '',
          underPacking: '',
          forPlating: '',
          underHeatTreatment: '',
          underPTFE: '',
          forPTFE: '',
          forHeatTreatment: '',
          sortedOK: '',
          sortedRejected: '',
          totalSorted: '',
        });
        setRefreshFlag((prev) => !prev);
      } else {
        toast.error(res.data.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h5 className="fw-bold mt-2">Work in Progress</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit Work in Progress Details
      </p>
      <hr />

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="row mb-3">
          {/* Date */}
          <div className="col-md-4">
            <label className="form-label clr-label">
              Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              max={todayLocal}
              onChange={handleChange}
              className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          {/* Part Name */}
          <div className="col-md-4">
            <label className="form-label clr-label">
              Part Name <span className="text-danger">*</span>
            </label>
            <Select
              options={partOptions}
              isLoading={partsLoading}
              value={partOptions.find((opt) => opt.value === formData.partName) || null}
              onChange={handlePartChange}
              placeholder="Select Part"
              isSearchable
              classNamePrefix="react-select"
            />
            {errors.partName && <div className="text-danger small mt-1">{errors.partName}</div>}
          </div>

          {/* Packed */}
          <div className="col-md-4">
            <label className="form-label clr-label">
              Packed <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="packed"
              value={formData.packed}
              onChange={handleChange}
              className={`form-control frm-input-style ${errors.packed ? 'is-invalid' : ''}`}
              placeholder="Packed"
            />
            {errors.packed && <div className="invalid-feedback">{errors.packed}</div>}
          </div>
        </div>

        {/* Remaining Rows */}
        {[
          [
            { name: 'forPacking', label: 'For Packing' },
            { name: 'underPacking', label: 'Under Packing' },
            { name: 'forPlating', label: 'For Plating' },
          ],
          [
            { name: 'underHeatTreatment', label: 'Under Heat Treatment' },
            { name: 'underPTFE', label: 'Under PTFE' },
            { name: 'forPTFE', label: 'For PTFE' },
          ],
          [
            { name: 'forHeatTreatment', label: 'For Heat Treatment' },
            { name: 'sortedOK', label: 'Sorted OK' },
            { name: 'sortedRejected', label: 'Sorted Rejected' },
          ],
        ].map((row, idx) => (
          <div className="row mb-3" key={idx}>
            {row.map(({ name, label }) => (
              <div key={name} className="col-md-4">
                <label className="form-label clr-label">
                  {label} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`form-control frm-input-style ${errors[name] ? 'is-invalid' : ''}`}
                  placeholder={label}
                />
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
              </div>
            ))}
          </div>
        ))}

        {/* Total Sorted */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Total Sorted</label>
            <input
              type="number"
              name="totalSorted"
              value={formData.totalSorted}
              className="form-control frm-input-style bg-light"
              placeholder="Auto-calculated"
              disabled
            />
          </div>
        </div>

        {/* Submit */}
        <div className="row mb-4">
          <div className="col-md-4 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-blue-clr px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>

      {/* ✅ Table */}
      <div className="row">
        <div className="col-sm-12">
          <WorkInProgressTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </>
  );
};

export default WorkInProgressForm;
