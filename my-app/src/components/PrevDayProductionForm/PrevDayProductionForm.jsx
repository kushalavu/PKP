'use client';
import React, { useState } from 'react';
import PrevDayProductionTable from './PrevDayProductionTable';

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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add API call here
  };

  return (
    <div className="container-fluid form-complete-bg p-4">
      <h4 className="fw-bold mt-2">Prev Day Production</h4>
      <p className="text-muted small init-nav-co">Please fill out the form to submit Prev Day Production Details</p>
<hr/>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label clr-label">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control frm-input-style" required />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Part Name</label>
          <select name="partName" value={formData.partName} onChange={handleChange} className="form-select frm-input-style" required>
            <option value="">Select a category</option>
            <option value="Motor">Motor</option>
            <option value="Bearing">Bearing</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Machine Number</label>
          <input type="text" name="machineNumber" value={formData.machineNumber} onChange={handleChange} className="form-control frm-input-style"placeholder='Please enter machine number' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Capacity</label>
          <input type="text" name="capacity" value={formData.capacity} onChange={handleChange} className="form-control frm-input-style" placeholder='Please enter the capacity of machine'/>
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">1st Shift</label>
          <input type="text" name="shift1" value={formData.shift1} onChange={handleChange} className="form-control frm-input-style"placeholder='Please enter 1st shift' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">2nd Shift</label>
          <input type="text" name="shift2" value={formData.shift2} onChange={handleChange} className="form-control frm-input-style"placeholder='Please enter 2nd shift' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Total in Numbers</label>
          <input type="text" name="totalNumbers" value={formData.totalNumbers} onChange={handleChange} className="form-control frm-input-style"placeholder='Total in number' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">% of Production Achieved</label>
          <input type="text" name="productionAchieved" value={formData.productionAchieved} onChange={handleChange} className="form-control frm-input-style"placeholder='production achieved' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Production(Target)</label>
          <input type="text" name="productionTarget" value={formData.productionTarget} onChange={handleChange} className="form-control frm-input-style" placeholder='production'/>
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Inspected Quantity</label>
          <input type="text" name="inspectedQuantity" value={formData.inspectedQuantity} onChange={handleChange} className="form-control frm-input-style"placeholder='inspected Quantity' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Sorted(OK)</label>
          <input type="text" name="sortedOK" value={formData.sortedOK} onChange={handleChange} className="form-control frm-input-style" placeholder='sorted'/>
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Sorted(Rejected)</label>
          <input type="text" name="sortedRejected" value={formData.sortedRejected} onChange={handleChange} className="form-control frm-input-style"placeholder='Please enter rejected count' />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Total Sorted</label>
          <input type="text" name="totalSorted" value={formData.totalSorted} onChange={handleChange} className="form-control frm-input-style" />
        </div>

        <div className="col-md-4">
          <label className="form-label clr-label">Sorting out(Quantity)</label>
          <input type="text" name="sortingOut" value={formData.sortingOut} onChange={handleChange} className="form-control frm-input-style"placeholder='Quantity' />
        </div>

        <div className="col-12">
          <button className="btn btn-blue-clr px-4 mt-3" type="submit">Submit</button>
        </div>
      </form>
      <div className="row">
        <div className="col-sm-12">
          <PrevDayProductionTable />
        </div>
      </div>

    </div>
  );
};

export default PrevDayProductionForm;
