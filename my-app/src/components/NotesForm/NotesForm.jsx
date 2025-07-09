'use client';
import React, { useState } from 'react';
import NotesTable from './NotesTable';

const NotesForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    note: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Note Submitted:', formData);
    //  API call here
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card p-4">
        <h5 className='fw-bold mt-2'>Notes</h5>
        <p className="text-muted d-block mb-3">
          Please fill out the form to submit Testing Unit (OSM) Details
        </p>
<hr/>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3 mt-3">
            <div className="col-md-6">
              <label className="form-label clr-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control frm-input-style"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label clr-label">For Plating</label>
              <input
                type="text"
                name="forPlating"
                className="form-control frm-input-style"
                placeholder="(Optional - Ignore if unused)"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label clr-label">Under Heat Treatment</label>
            <textarea
              className="form-control frm-input-style"
              name="note"
              rows="4"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter notes..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-blue-clr px-5">Submit</button>
        </form>
      </div>
      <div className="ROW">
        <div className="col-sm-12">
          <NotesTable />
        </div>
      </div>
    </div>
  );
};

export default NotesForm;
