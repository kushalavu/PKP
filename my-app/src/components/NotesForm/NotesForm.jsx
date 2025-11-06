'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotesTable from './NotesTable';

const NotesForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    forPlating: '',
    note: '',
  });
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(false);
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
const dd = String(today.getDate()).padStart(2, '0');
const todayLocal = `${yyyy}-${mm}-${dd}`;
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
    setLoading(true);
    try {
      // ✅ Send date as plain string "YYYY-MM-DD"
      await axios.post('/api/notes', {
        date: formData.date,
        forPlating: formData.forPlating || '',
        note: formData.note,
      });

      toast.success('Note added successfully');
      setFormData({ date: '', forPlating: '', note: '' });
      setRefreshFlag(prev => !prev); // refresh table
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="row">
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
                max={todayLocal}
                disabled={loading}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label clr-label">Subject</label>
              <input
                type="text"
                name="forPlating"
                value={formData.forPlating}
                onChange={handleChange}
                className="form-control frm-input-style"
                placeholder="(Optional - Ignore if unused)"
                disabled={loading}
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
              disabled={loading}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-blue-clr px-5"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <NotesTable refreshFlag={refreshFlag} />
        </div>
      </div>
    </>
  );
};

export default NotesForm;
