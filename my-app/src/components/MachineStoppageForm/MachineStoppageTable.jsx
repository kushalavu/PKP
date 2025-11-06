'use client';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from "react-icons/fa";
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MachineStoppageTable = forwardRef((props, ref) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedRow, setEditedRow] = useState({});
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [dateFilter, setDateFilter] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);




// ✅ fetchData with string date
const fetchData = async (pageNo = 1, date = null) => {
  try {
    setLoading(true);
    const params = { page: pageNo, limit: 10 };

    // date is already a string, just send it
    if (date) params.date = date;

    const res = await axios.get('/api/machine-stoppage', { params });

    if (res.status === 200) {
      setRows(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setPage(pageNo);
    } else {
      toast.error(res.data?.message || 'Error fetching data');
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  useImperativeHandle(ref, () => ({
    refreshData: () => fetchData(page, dateFilter)
  }));

  useEffect(() => {
    fetchData(1, dateFilter);
  }, [dateFilter]);

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage, dateFilter);
    }
  };
// Format date for display (dd-mm-yyyy)
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr); // handles yyyy-mm-dd or ISO format
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Check if date is within 30 days
const isWithin30Days = (dateStr) => {
  if (!dateStr) return false;
  const recordDate = new Date(dateStr); // parse directly
  const now = new Date();
  const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
};

  // Edit
  const handleEditClick = (row) => setEditedRow({ ...row }) || setShowEditModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRow(prev => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      const formattedDate = editedRow.Date.includes('-')
  ? editedRow.Date.split('-').reverse().join('-') // dd-mm-yyyy → yyyy-mm-dd
  : editedRow.Date;
      const payload = {
        id: editedRow.Id,
        date: formattedDate,
        machinesAllotted: Number(editedRow.MachinesAllotted),
        running: Number(editedRow.Running),
        notRunning: Number(editedRow.NotRunning),
        underSetting: Number(editedRow.UnderSetting),
        maintenance: editedRow.Maintenance,
        remarks: editedRow.Remarks,
        newProcess: editedRow.NewProcess
      };

      const res = await axios.put(`/api/machine-stoppage?id=${editedRow.Id}`, payload);

      if (res.status === 200 && res.data.success) {
        toast.success(res.data.message);
        setShowEditModal(false);
        fetchData(page, dateFilter);
      } else {
        toast.error(res.data.message || "Failed to update record");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDeleteClick = (id) => {
    setSelectedRowId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete(`/api/machine-stoppage?id=${selectedRowId}`);
      if (res.status === 200 && res.data.success) {
        toast.success(res.data.message);
        setShowDeleteModal(false);
        fetchData(page, dateFilter);
      } else {
        toast.error(res.data.message || "Failed to delete record");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => setDateFilter(null);

  return (
    <div className="mt-3">
      <h5 className='fw-bold mb-2'>PRIMARY DATA</h5>

      {/* Filter */}
<div className="d-flex gap-2 mb-3">
  <div style={{ position: "relative", display: "inline-block", width: "200px" }}>
    <FaCalendarAlt
      onClick={() => document.getElementById("datePickerInput").focus()}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#007bff",
        fontSize: "18px",
        cursor: "pointer",
        zIndex: 3,
        pointerEvents: "auto",
      }}
    />

<DatePicker
  id="datePickerInput"
selected={dateFilter ? new Date(dateFilter) : null}
onChange={(date) => {
 // Format date manually in local timezone (not UTC)
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;
setDateFilter(formattedDate);

}}

  dateFormat="dd-MM-yyyy"
  placeholderText="Select Date"
  className="form-control frm-input-style"
  maxDate={new Date()}
  showYearDropdown
  showMonthDropdown
  dropdownMode="select"
/>


  </div>
        <Button className="btn btn-secondary" onClick={handleClearFilters}>Clear</Button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>No of M/C Allotted</th>
              <th>Running Machines</th>
              <th>Machines Not Running</th>
              <th>Under Setting</th>
              <th>Maintenance</th>
              <th>Remarks</th>
              <th>New Process</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 10 }).map((_, j) => <td key={j}><Skeleton /></td>)}</tr>
                ))
              : rows.length === 0
              ? <tr><td colSpan="10">No data available</td></tr>
              : rows.map(row => {
                  const editable = isWithin30Days(row.Date);
                  return (
                    <tr key={row.Id}>
                      <td>{formatDate(row.Date)}</td>
                      <td>{row.MachinesAllotted}</td>
                      <td>{row.Running}</td>
                      <td>{row.NotRunning}</td>
                      <td>{row.UnderSetting}</td>
                      <td>{row.Maintenance}</td>
                      <td>{row.Remarks}</td>
                      <td>{row.NewProcess}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditClick(row)}
                          disabled={!editable}
                        ><FiEdit /></button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(row.Id)}
                          disabled={!editable || deleting}
                        >{deleting && selectedRowId === row.Id ? "Deleting..." : <FiTrash2 />}</button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
{/* Pagination */}
{totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center gap-2 mb-5 mt-3">
    <button
      className="btn btn-outline-primary btn-sm" 
      disabled={page === 1} 
      onClick={() => handlePageChange(page - 1)}
    >
      Previous
    </button>
    
    <span className="fw-bold">Page {page} of {totalPages}</span>
    
    <button 
      className="btn btn-outline-primary btn-sm" 
      disabled={page === totalPages} 
      onClick={() => handlePageChange(page + 1)}
    >
      Next
    </button>
  </div>
)}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold mt-2'>Edit Machine Stoppage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
<Form.Control
  type="date"
  value={
    editedRow?.Date
      ? (() => {
          const dateObj = new Date(editedRow.Date);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`; // yyyy-mm-dd for <input type="date">
        })()
      : ''
  }
  disabled
/>



            {['MachinesAllotted', 'Running', 'NotRunning', 'UnderSetting'].map(field => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  type="number"
                  className="frm-input-style"
                  name={field}
                  value={editedRow[field] || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}

            {['Maintenance', 'Remarks', 'NewProcess'].map(field => (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  type="text"
                  className="frm-input-style"
                  name={field}
                  value={editedRow[field] || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button className="btn btn-blue-clr px-3" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default MachineStoppageTable;
