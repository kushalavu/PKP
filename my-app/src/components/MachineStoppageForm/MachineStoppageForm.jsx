'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import MachineStoppageTable from './MachineStoppageTable';
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const MachineStoppageForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    part: '',
    machinesAllotted: '',
    running: '',
    notRunning: '',
    underSetting: '',
    maintenance: '',
    remarks: '',
    newProcess: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // New loading state
  const tableRef = useRef(null);

  // Dummy dropdown values
  const partOptions = ["Part A", "Part B", "Part C"];
  const numberOptions = Array.from({ length: 21 }, (_, i) => i); // 0–20

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.part) newErrors.part = "Part is required";
    if (!formData.machinesAllotted) newErrors.machinesAllotted = "Machine Allotted is required";
    if (!formData.running) newErrors.running = "Running machines is required";
    if (!formData.notRunning) newErrors.notRunning = "Not running machines is required";
    if (!formData.underSetting) newErrors.underSetting = "Under setting is required";
    if (!formData.maintenance) newErrors.maintenance = "Maintenance is required";
    if (!formData.remarks) newErrors.remarks = "Remarks is required";
    if (!formData.newProcess) newErrors.newProcess = "New Process is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); //  Disable button
    try {
      const payload = {
        date: formData.date || null,
        part: formData.part || '',
        machinesAllotted: formData.machinesAllotted ? Number(formData.machinesAllotted) : 0,
        running: formData.running ? Number(formData.running) : 0,
        notRunning: formData.notRunning ? Number(formData.notRunning) : 0,
        underSetting: formData.underSetting ? Number(formData.underSetting) : 0,
        maintenance: formData.maintenance || '',
        remarks: formData.remarks || '',
        newProcess: formData.newProcess || '',
      };

      const res = await axios.post('/api/machine-stoppage', payload);

      if (res.data.success) {
        toast.success(res.data.message || "Record inserted successfully");
        setFormData({
          date: '',
          part: '',
          machinesAllotted: '',
          running: '',
          notRunning: '',
          underSetting: '',
          maintenance: '',
          remarks: '',
          newProcess: '',
        });

        if (tableRef.current) {
          tableRef.current.refreshData();
        }
      } else {
        toast.error(res.data.message || "Failed to insert record");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(error.response?.data?.error || "Server error while submitting");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <div className="container-fluid form-complete-bg p-4">
      <h5 className='fw-bold mt-2'>Machine Stoppage Details</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit Machine Stoppage Details
      </p>
      <hr />

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          {/* Date */}
          <div className="col-md-4">
            <label className="form-label clr-label">Date</label>
            <input
              type="date"
              name="date"
              className={`form-control frm-input-style ${errors.date ? "is-invalid" : ""}`}
              value={formData.date}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>

          {/* Part Dropdown */}
          <div className="col-md-4">
            <label className="form-label clr-label">Part</label>
            <select
              name="part"
              className={`form-control frm-input-style ${errors.part ? "is-invalid" : ""}`}
              value={formData.part}
              onChange={handleChange}
              onFocus={handleFocus}
            >
              <option value="">-- Select Part --</option>
              {partOptions.map((part, i) => (
                <option key={i} value={part}>{part}</option>
              ))}
            </select>
            {errors.part && <div className="invalid-feedback">{errors.part}</div>}
          </div>

          {/* Machines Allotted */}
          <div className="col-md-4">
            <label className="form-label clr-label">No of M/C Allotted</label>
            <input
              type="number"
              name="machinesAllotted"
              className={`form-control frm-input-style ${errors.machinesAllotted ? "is-invalid" : ""}`}
              placeholder='No of M/C allotted'
              value={formData.machinesAllotted}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            {errors.machinesAllotted && <div className="invalid-feedback">{errors.machinesAllotted}</div>}
          </div>
        </div>

        <div className="row mb-3">
          {/* Running Machines Dropdown */}
          <div className="col-md-4">
            <label className="form-label clr-label">Running Machines</label>
            <select
              name="running"
              className={`form-control frm-input-style ${errors.running ? "is-invalid" : ""}`}
              value={formData.running}
              onChange={handleChange}
              onFocus={handleFocus}
            >
              <option value="">-- Select --</option>
              {numberOptions.map((num, i) => (
                <option key={i} value={num}>{num}</option>
              ))}
            </select>
            {errors.running && <div className="invalid-feedback">{errors.running}</div>}
          </div>

          {/* Not Running Machines Dropdown */}
          <div className="col-md-4">
            <label className="form-label clr-label">Machines Not Running</label>
            <select
              name="notRunning"
              className={`form-control frm-input-style ${errors.notRunning ? "is-invalid" : ""}`}
              value={formData.notRunning}
              onChange={handleChange}
              onFocus={handleFocus}
            >
              <option value="">-- Select --</option>
              {numberOptions.map((num, i) => (
                <option key={i} value={num}>{num}</option>
              ))}
            </select>
            {errors.notRunning && <div className="invalid-feedback">{errors.notRunning}</div>}
          </div>

          {/* Under Setting */}
          <div className="col-md-4">
            <label className="form-label clr-label">Under Setting</label>
            <input
              type="text"
              name="underSetting"
              className={`form-control frm-input-style ${errors.underSetting ? "is-invalid" : ""}`}
              placeholder='Under setting'
              value={formData.underSetting}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            {errors.underSetting && <div className="invalid-feedback">{errors.underSetting}</div>}
          </div>
        </div>

        <div className="row mb-3">
          {/* Maintenance */}
          <div className="col-md-4">
            <label className="form-label clr-label">Maintenance</label>
            <input
              type="number"
              name="maintenance"
              className={`form-control frm-input-style ${errors.maintenance ? "is-invalid" : ""}`}
              placeholder='Maintenance'
              value={formData.maintenance}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            {errors.maintenance && <div className="invalid-feedback">{errors.maintenance}</div>}
          </div>

          {/* Remarks */}
          <div className="col-md-8">
            <label className="form-label clr-label">Remarks</label>
            <input
              type="text"
              name="remarks"
              className={`form-control frm-input-style ${errors.remarks ? "is-invalid" : ""}`}
              placeholder='Remarks'
              value={formData.remarks}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            {errors.remarks && <div className="invalid-feedback">{errors.remarks}</div>}
          </div>
        </div>

        <div className="row mb-4">
          {/* New Process */}
          <div className="col-md-4">
            <label className="form-label clr-label">Add New Process</label>
            <div className="input-group">
              <input
                type="text"
                name="newProcess"
                className={`form-control frm-input-style ${errors.newProcess ? "is-invalid" : ""}`}
                placeholder='Add new process'
                value={formData.newProcess}
                onChange={handleChange}
                onFocus={handleFocus}
              />
              <span className="input-group-text"><FiPlusCircle /></span>
              {errors.newProcess && <div className="invalid-feedback d-block">{errors.newProcess}</div>}
            </div>
          </div>
        </div>

        {/* ✅ Disable button while submitting */}
        <button className="btn btn-blue-clr px-5" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="row mt-4">
        <div className="col-sm-12">
          <MachineStoppageTable ref={tableRef} />
        </div>
      </div>
    </div>
  );
};

export default MachineStoppageForm;
