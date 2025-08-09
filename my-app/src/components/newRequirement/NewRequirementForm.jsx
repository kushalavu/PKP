'use client';
import React from 'react';
const NewRequirementForm = () => {
  return (
    <div className="p-4 rounded form-bg main-wrapper">
      <h5 className="fw-bold">New Requirement</h5>
      <p className="text-muted small init-nav-co">
        Please fill out the form to submit a new client requirement for processing.
      </p>
      <hr />
      <form>
        <div className="mb-3">
          <label className="form-label clr-label">Part Name</label>
          <select className="form-select frm-input-style">
            <option>Select Part Name</option>
            <option>Component A</option>
            <option>Component B</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label clr-label">Date</label>
          <input type="date" className="form-control frm-input-style" defaultValue="2025-10-09" />
        </div>

        <div className="mb-3">
          <label className="form-label clr-label">Raw Material</label>
          <input type="text" className="form-control frm-input-style" placeholder='Please enter raw material' />
        </div>

        <div className="mb-3">
          <label className="form-label clr-label">Raw Material Size</label>
          <input type="text" className="form-control frm-input-style"placeholder='please enter raw material size' />
        </div>

        <div className="mb-3">
          <label className="form-label clr-label">Raw Material Company</label>
          <input type="text" className="form-control frm-input-style" placeholder='please enter raw material company'/>
        </div>

        <div className="mb-3">
          <label className="form-label clr-label">Raw Material Drawing</label>
          <input type="text" className="form-control frm-input-style"placeholder='please enter raw material drawing' />
        </div>
        <div className="row">
          <div className="col-sm-5 mt-3">
            <button type="submit" className="btn btn-blue-clr w-100">Submit</button>
          </div>
        </div>

      </form>
    </div>
  );
};
export default NewRequirementForm;