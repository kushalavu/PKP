'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import MachineStoppageTable from './MachineStoppageTable';
import { FiPlusCircle } from "react-icons/fi";

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

  // Ref to call child refresh
  const tableRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Convert numeric fields to numbers and set empty strings to 0
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

    console.log('✅ Submitted:', res.data);

    // Reset form
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

    // Refresh child table
    if (tableRef.current) {
      tableRef.current.refreshData();
    }
  } catch (error) {
    console.error('❌ Error submitting:', error);
  }
};


  return (
    <div className="container-fluid form-complete-bg p-4">
      <h5 className='fw-bold mt-2'>Machine Stoppage Details</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit Machine Stoppage Details
      </p>
<hr/>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Date</label>
            <input 
              type="date" 
              name="date" 
              className="form-control frm-input-style" 
              value={formData.date} 
              onChange={handleChange} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Part</label>
            <input 
              type="text" 
              name="part" 
              className="form-control frm-input-style"
              placeholder='Select part name' 
              value={formData.part} 
              onChange={handleChange} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">No of M/C Allotted</label>
            <input 
              type="number" 
              name="machinesAllotted" 
              className="form-control frm-input-style"
              placeholder='No of M/C allotted' 
              value={formData.machinesAllotted} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Running Machines</label>
            <input 
              type="number" 
              name="running" 
              className="form-control frm-input-style"
              placeholder='Running machine' 
              value={formData.running} 
              onChange={handleChange} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Machines Not Running</label>
            <input 
              type="text" 
              name="notRunning" 
              className="form-control frm-input-style"
              placeholder='Machine not working' 
              value={formData.notRunning} 
              onChange={handleChange} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label clr-label">Under Setting</label>
            <input 
              type="text" 
              name="underSetting" 
              className="form-control frm-input-style"
              placeholder='Under setting' 
              value={formData.underSetting} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label clr-label">Maintenance</label>
            <input 
              type="number" 
              name="maintenance" 
              className="form-control frm-input-style"
              placeholder='Maintenance' 
              value={formData.maintenance} 
              onChange={handleChange} 
            />
          </div>
          <div className="col-md-8">
            <label className="form-label clr-label">Remarks</label>
            <input 
              type="text" 
              name="remarks" 
              className="form-control frm-input-style"
              placeholder='Remarks' 
              value={formData.remarks} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label clr-label">Add New Process</label>
            <div className="input-group">
              <input 
                type="text" 
                name="newProcess" 
                className="form-control frm-input-style"
                placeholder='Add new process' 
                value={formData.newProcess} 
                onChange={handleChange}
              />
              <span className="input-group-text"><FiPlusCircle /></span>
            </div>
          </div>
        </div>

        <button className="btn btn-blue-clr px-5" type="submit">Submit</button>
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
