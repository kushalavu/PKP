'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

const PrevDayProductionTable = ({ refresh }) => {
  const [partNames, setPartNames] = useState([]);
  const [machines, setMachines] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', partName: '', machineNumber: '' });

  // Modal state
  // ✅ Helper: Check if record is within 30 days
const isWithin30Days = (dateStr) => {
  const recordDate = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
  return diffDays <= 30; // true → within 30 days
};

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await axios.get('/api/prev-day-production');
        const allData = res.data.data || [];

        const uniqueParts = [...new Set(allData.map(d => d.PartName))];
        const uniqueMachines = [...new Set(allData.map(d => d.MachineNumber))];

        setPartNames(uniqueParts);
        setMachines(uniqueMachines);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch dropdown data');
      }
    };
    fetchDropdownData();
  }, []);

  // Fetch table data
const fetchData = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.partName) params.append('partName', filters.partName);
    if (filters.machineNumber) params.append('machineNumber', filters.machineNumber);
    params.append('page', page); // ✅ Add pagination

    const res = await axios.get(`/api/prev-day-production?${params.toString()}`);
    setData(res.data.data);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.error(err);
    toast.error('Failed to fetch data');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, [filters, refresh]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

 const handleDelete = async () => {
  try {
    const res = await axios.delete(`/api/prev-day-production?id=${deleteId}`);

    if (res.status === 200) {
      toast.success(res.data?.message || "Record deleted successfully");
      fetchData();
    } else {
      toast.error(res.data?.message || "Failed to delete record");
    }
  } catch (err) {
    console.error(err);
    // ✅ If backend returned message, show it; otherwise fallback
    toast.error(err.response?.data?.message || "Failed to delete record");
  } finally {
    setShowDeleteModal(false);
    setDeleteId(null);
  }
};


  // Edit modal open
  const openEditModal = (record) => {
    setEditRecord({ ...record });
    setShowEditModal(true);
  };

const handleEditChange = (field, value) => {
  setEditRecord(prev => {
    const updated = { ...prev, [field]: value };

    // Auto calculate totals
    if (field === 'Shift1' || field === 'Shift2') {
      const shift1 = parseInt(updated.Shift1 || 0);
      const shift2 = parseInt(updated.Shift2 || 0);
      updated.TotalNumbers = shift1 + shift2;
    }

    if (field === 'SortedOK' || field === 'SortedRejected') {
      const sortedOK = parseInt(updated.SortedOK || 0);
      const sortedRejected = parseInt(updated.SortedRejected || 0);
      updated.TotalSorted = sortedOK + sortedRejected;
    }

    // ✅ Auto calculate % Production Achieved
    const capacity = parseFloat(updated.Capacity || 0);
    const totalNumbers = parseInt(updated.TotalNumbers || 0);
    updated.ProductionAchieved = capacity > 0
      ? ((totalNumbers / capacity) * 100).toFixed(2)
      : '';

    return updated;
  });
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!editRecord.Id) return toast.error("Record ID missing!");

  const original = data.find(r => r.Id === editRecord.Id);
  const fieldsToCompare = [
    'Date', 'PartName', 'MachineNumber', 'Capacity',
    'Shift1', 'Shift2', 'TotalNumbers', 'ProductionAchieved',
    'ForSorting', 'InspectedQuantity', 'SortedOK',
    'SortedRejected', 'TotalSorted'
  ];

  const isChanged = fieldsToCompare.some(field => original[field] != editRecord[field]);
  if (!isChanged) {
    toast.info("No changes made");
    setShowEditModal(false);
    return;
  }

  try {
    const res = await axios.put('/api/prev-day-production', {
      id: editRecord.Id,
      date: editRecord.Date.split('T')[0],
      partName: editRecord.PartName,
      machineNumber: editRecord.MachineNumber,
      capacity: editRecord.Capacity,
      shift1: editRecord.Shift1,
      shift2: editRecord.Shift2,
      productionAchieved: editRecord.ProductionAchieved,
      forSorting: editRecord.ForSorting,
      inspectedQuantity: editRecord.InspectedQuantity,
      sortedOK: editRecord.SortedOK,
      sortedRejected: editRecord.SortedRejected,
      totalSorted: editRecord.TotalSorted,
    });

    // ✅ Explicitly check status
    if (res.status === 200) {
      toast.success(res.data?.message || "Record updated successfully");
      fetchData();
      setShowEditModal(false);
    } else {
      toast.error(res.data?.message || "Failed to update record");
    }
  } catch (err) {
    console.error(err);
    // ✅ Show backend message (like "Edit time limit exceeded")
    toast.error(err.response?.data?.message || "Failed to update record");
  }
};

  useEffect(() => {
  fetchData();
}, [filters, refresh, page]); // added page here


  return (
    <div className="mt-2">
      <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Prev Day Production Records</p>

      {/* Filters */}
      <div className="d-flex gap-2 flex-wrap mb-3">
           <div style={{ position: "relative", display: "inline-block", width: "200px" }}>
                  {/* 📅 Calendar Icon */}
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
                      zIndex: 3, // keep icon above input
                      pointerEvents: "auto",
                    }}
                  />
        
                  {/* 📆 Date Picker */}
                  <DatePicker
                    id="datePickerInput"
                    selected={filters.date ? new Date(filters.date) : null}
                    onChange={(date) => {
                      if (!date) {
                        setFilters((prev) => ({ ...prev, date: "" }));
                        return;
                      }
        
                      // ✅ Prevent timezone shift — stay local
                      const offset = date.getTimezoneOffset();
                      const localDate = new Date(date.getTime() - offset * 60 * 1000);
                      const formattedDate = localDate.toISOString().split("T")[0];
        
                      setFilters((prev) => ({ ...prev, date: formattedDate }));
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Date"
                    className="form-control frm-input-style"
                    wrapperClassName="d-inline-block"
                    popperPlacement="bottom-start"
                    maxDate={new Date()}
                         showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                  />
                </div>
        <select name="partName" value={filters.partName} onChange={handleFilterChange} className="form-select frm-input-style" style={{ maxWidth: '180px' }}>
          <option value="">All Parts</option>
          {partNames.map((part, i) => <option key={i} value={part}>{part}</option>)}
        </select>
        <select name="machineNumber" value={filters.machineNumber} onChange={handleFilterChange} className="form-select frm-input-style" style={{ maxWidth: '180px' }}>
          <option value="">All Machines</option>
          {machines.map((machine, i) => <option key={i} value={machine}>{machine}</option>)}
        </select>
        <button className="btn frm-input-style" onClick={() => setFilters({ date: '', partName: '', machineNumber: '' })}>
          Clear All <IoMdCloseCircleOutline />
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>Machine Number</th>
              <th>Capacity</th>
              <th>1st Shift</th>
              <th>2nd Shift</th>
              <th>Total Production</th>
              <th>% Production Achieved</th>
              <th>Inspected Quantity</th>
              <th>For Sorting</th>
              <th>OK</th>
              <th>Rejected</th>
              <th>Total Sorted</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
     <tbody>
  {loading ? (
    Array.from({ length: 10 }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 15 }).map((__, j) => (
          <td key={j}><Skeleton /></td>
        ))}
      </tr>
    ))
  ) : data.length ? (
    data.map(r => {
      const canModify = isWithin30Days(r.Date); // ✅ check age of record
      return (
        <tr key={r.Id}>
          <td>{new Date(r.Date).toLocaleDateString()}</td>
          <td>{r.PartName}</td>
          <td>{r.MachineNumber}</td>
          <td>{r.Capacity}</td>
          <td>{r.Shift1}</td>
          <td>{r.Shift2}</td>
          <td>{r.TotalNumbers}</td>
          <td>{r.ProductionAchieved}</td>
          <td>{r.InspectedQuantity}</td>
          <td>{r.ForSorting}</td>
          <td>{r.SortedOK}</td>
          <td>{r.SortedRejected}</td>
          <td>{r.TotalSorted}</td>

          {/* ✅ Disable buttons if record older than 30 days */}
          <td>
            <button
            type='button'
              className="btn btn-edit btn-sm"
              onClick={() => openEditModal(r)}
              disabled={!canModify}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => confirmDelete(r.Id)}
              disabled={!canModify}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr><td colSpan="15">No records found</td></tr>
  )}
</tbody>

        </table>
      </div>
{/* Pagination Controls */}
{!loading && totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center mt-3 gap-2 flex-wrap mb-5">
    <button
      className="btn btn-outline-primary btn-sm"
      disabled={page === 1}
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    >
      Previous
    </button>

    <span className="fw-bold">
      Page {page} of {totalPages}
    </span>

    <button
      className="btn btn-outline-primary btn-sm"
      disabled={page === totalPages}
      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    >
      Next
    </button>
  </div>
)}

      {/* Edit Modal */}
{/* Edit Modal */}
{showEditModal && editRecord && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-xl">
      <div className="modal-content">
        <form onSubmit={handleEditSubmit}>
          <div className="modal-header">
            <h5 className='fw-bold mt-2'>Edit Record</h5>
            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
          </div>

          <div className="modal-body row g-3">
            {/* Date field - read-only */}
            <div className="col-md-3">
              <label className="form-label clr-label">Date</label>
              <input
                type="text"
                className="form-control frm-input-style"
                value={new Date(editRecord.Date).toLocaleDateString()}
                disabled
              />
            </div>
                   <div className="col-md-3">
              <label className="form-label clr-label">Part Name</label>
              <input
                type="text"
                className="form-control frm-input-style"
                value={editRecord.PartName}
                disabled
              />
            </div>
                       <div className="col-md-3">
              <label className="form-label clr-label">Machine No.</label>
              <input
                type="text"
                className="form-control frm-input-style"
                value={editRecord.MachineNumber}
                onChange={e => handleEditChange('MachineNumber', e.target.value)}
              />
            </div>
           <div className="col-md-3">
              <label className="form-label clr-label">Capacity</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.Capacity}
                onChange={e => handleEditChange('Capacity', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label clr-label">1st Shift</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.Shift1}
                onChange={e => handleEditChange('Shift1', e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label clr-label">2nd Shift</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.Shift2}
                onChange={e => handleEditChange('Shift2', e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label clr-label">% Production Achieved</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.ProductionAchieved}
                onChange={e => handleEditChange('ProductionAchieved', e.target.value)}
                disabled
              />
            </div>

            <div className="col-md-3">
              <label className="form-label clr-label">Inspected Quantity</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.InspectedQuantity}
                onChange={e => handleEditChange('InspectedQuantity', e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label clr-label">For Sorting</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.ForSorting}
                onChange={e => handleEditChange('ForSorting', e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label clr-label">Sorted (OK)</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.SortedOK}
                onChange={e => handleEditChange('SortedOK', e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label clr-label">Sorted (Rejected)</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.SortedRejected}
                onChange={e => handleEditChange('SortedRejected', e.target.value)}
              />
            </div>
                    <div className="col-md-3">
              <label className="form-label clr-label">Total Sotrted</label>
              <input
                type="number"
                className="form-control frm-input-style"
                value={editRecord.TotalSorted}
                disabled
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-cancel me-3"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-blue-clr">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
{/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="fw-bold">Confirm Delete</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>
        <div className="modal-body">
          Are you sure you want to delete this record?
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
    
  );
};

export default PrevDayProductionTable;
