'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotesTable from './NotesTable';

const NotesForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    forPlating: '',
    note: '',
  });
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.note) {
      toast.error('Date and Note are required!');
      return;
    }
    try {
      await axios.post('/api/notes', formData);
      toast.success('Note added successfully!');
      setFormData({ date: '', forPlating: '', note: '' });
      setRefreshFlag(prev => !prev); // trigger refresh
    } catch (err) {
      console.error(err);
      toast.error('Failed to add note');
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card p-4">
        <h5 className='fw-bold mt-2'>Notes</h5>
        <p className="text-muted d-block mb-3">
          Fill out the form to capture important updates from today’s meeting
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
              <label className="form-label clr-label">Progress</label>
              <input
                type="text"
                name="forPlating"
                value={formData.forPlating}
                onChange={handleChange}
                className="form-control frm-input-style"
                placeholder="(Optional - Ignore if unused)"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label clr-label">Note</label>
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

      <div className="row">
        <div className="col-sm-12">
          <NotesTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
};

export default NotesForm;
