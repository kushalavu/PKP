'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FiPlusCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import MachineStoppageTable from './MachineStoppageTable';

const MachineStoppageForm = () => {
const [formData, setFormData] = useState({
  date: '',
  machinesAllotted: '',
  running: '',
  notRunning: '',
  underSetting: '',
  maintenance: '',
  remarks: '',
  newProcess: '',
});

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const tableRef = useRef(null);

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
const dd = String(today.getDate()).padStart(2, '0');
const todayLocal = `${yyyy}-${mm}-${dd}`;

  // ✅ Fetch parts from API


  // ✅ Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ✅ Handle react-select part change
// ✅ When user selects a part
const handlePartChange = (selectedOption) => {
  setFormData(prev => ({
    ...prev,
    part: selectedOption?.value || '',
    drawing_no: selectedOption?.drawing_no || '',
  }));
};


  // ✅ Validate required fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.machinesAllotted) newErrors.machinesAllotted = "Machine Allotted is required";
    if (!formData.running) newErrors.running = "Running machines is required";
    if (!formData.notRunning) newErrors.notRunning = "Not running machines is required";
    if (!formData.underSetting) newErrors.underSetting = "Under setting is required";
    if (!formData.maintenance) newErrors.maintenance = "Maintenance is required";
    if (!formData.remarks) newErrors.remarks = "Remarks is required";
    if (!formData.newProcess) newErrors.newProcess = "New Process is required";
    return newErrors;
  };

  // ✅ Submit form
// ✅ Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);
  try {
const payload = {
  date: formData.date,
  machinesAllotted: Number(formData.machinesAllotted),
  running: Number(formData.running),
  notRunning: Number(formData.notRunning),
  underSetting: formData.underSetting,
  maintenance: formData.maintenance,
  remarks: formData.remarks,
  newProcess: formData.newProcess,
};
const res = await axios.post('/api/machine-stoppage', payload);

// Check the response JSON
if (res.data?.success) {
  setFormData({
    date: '',
    machinesAllotted: '',
    running: '',
    notRunning: '',
    underSetting: '',
    maintenance: '',
    remarks: '',
    newProcess: '',
  });
  setLoading(false);
    toast.success(res.data.message || "Record inserted successfully");
  if (tableRef.current) tableRef.current.refreshData();
} else {
  toast.error(res.data.message || "Failed to insert record");
  setLoading(false);
}


  } catch (error) {
    console.error("Error submitting:", error);
    toast.error(error.response?.data?.error || "Server error while submitting");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <h5 className='fw-bold mt-2'>Machine Stoppage Details</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit Machine Stoppage Details
      </p>
      <hr />

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          {/* Date */}
          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Date</label>
<input
  type="date"
  name="date"
  max={todayLocal}
  className={`form-control frm-input-style ${errors.date ? "is-invalid" : ""}`}
  value={formData.date}
  onChange={handleChange}
/>

            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          {/* Machines Allotted */}
          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">No of M/C Allotted</label>
            <input
              type="number"
              name="machinesAllotted"
              className={`form-control frm-input-style ${errors.machinesAllotted ? "is-invalid" : ""}`}
              placeholder='No of M/C allotted'
              value={formData.machinesAllotted}
              onChange={handleChange}
            />
            {errors.machinesAllotted && <div className="invalid-feedback">{errors.machinesAllotted}</div>}
          </div>
          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Running Machines</label>
            <input
              type="number"
              name="running"
              className={`form-control frm-input-style ${errors.running ? "is-invalid" : ""}`}
              placeholder='Running machines'
              value={formData.running}
              onChange={handleChange}
            />
            {errors.running && <div className="invalid-feedback">{errors.running}</div>}
          </div>

          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Machines Not Running</label>
            <input
              type="number"
              name="notRunning"
              className={`form-control frm-input-style ${errors.notRunning ? "is-invalid" : ""}`}
              placeholder='Not running machines'
              value={formData.notRunning}
              onChange={handleChange}
            />
            {errors.notRunning && <div className="invalid-feedback">{errors.notRunning}</div>}
          </div>

          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Under Setting</label>
            <input
              type="text"
              name="underSetting"
              className={`form-control frm-input-style ${errors.underSetting ? "is-invalid" : ""}`}
              placeholder='Under setting'
              value={formData.underSetting}
              onChange={handleChange}
            />
            {errors.underSetting && <div className="invalid-feedback">{errors.underSetting}</div>}
          </div>
          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Maintenance</label>
            <input
              type="number"
              name="maintenance"
              className={`form-control frm-input-style ${errors.maintenance ? "is-invalid" : ""}`}
              placeholder='Maintenance'
              value={formData.maintenance}
              onChange={handleChange}
            />
            {errors.maintenance && <div className="invalid-feedback">{errors.maintenance}</div>}
          </div>

          <div className="col-md-8 mt-3">
            <label className="form-label clr-label">Remarks</label>
            <input
              type="text"
              name="remarks"
              className={`form-control frm-input-style ${errors.remarks ? "is-invalid" : ""}`}
              placeholder='Remarks'
              value={formData.remarks}
              onChange={handleChange}
            />
            {errors.remarks && <div className="invalid-feedback">{errors.remarks}</div>}
          </div>

          <div className="col-md-4 mt-3">
            <label className="form-label clr-label">Add New Process</label>
            <div className="input-group">
              <input
                type="text"
                name="newProcess"
                className={`form-control frm-input-style ${errors.newProcess ? "is-invalid" : ""}`}
                placeholder='Add new process'
                value={formData.newProcess}
                onChange={handleChange}
              />
              <span className="input-group-text"><FiPlusCircle /></span>
            </div>
            {errors.newProcess && <div className="invalid-feedback d-block">{errors.newProcess}</div>}
          </div>
        </div>

        <button className="btn btn-blue-clr px-5" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="row mt-4">
        <div className="col-sm-12">
          <MachineStoppageTable ref={tableRef} />
        </div>
      </div>
    </>
  );
};

export default MachineStoppageForm;
