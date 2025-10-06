'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import { IoMdCloseCircleOutline } from "react-icons/io";

const PrevDayProductionTable = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', partName: '' });

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.partName) params.append('partName', filters.partName);

      const res = await axios.get(`/api/prev-day-production?${params.toString()}`);
      setData(res.data.data);
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
  const clearFilters = () => setFilters({ date: '', partName: '' });

  // Delete actions
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/prev-day-production?id=${deleteId}`);
      toast.success("Record deleted successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Edit actions
  const openEditModal = (record) => {
    setEditRecord({ ...record });  // ensures Id is included
    setShowEditModal(true);
  };


  const handleEditChange = (field, value) => {
    setEditRecord(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate totals
      if (field === 'Shift1' || field === 'Shift2') {
        updated.TotalNumbers = (parseInt(updated.Shift1 || 0) + parseInt(updated.Shift2 || 0));
      }
      if (field === 'SortedOK' || field === 'SortedRejected') {
        updated.TotalSorted = (parseInt(updated.SortedOK || 0) + parseInt(updated.SortedRejected || 0));
      }
      return updated;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editRecord.Id) {
      toast.error("Record ID is missing!");
      return;
    }

    // Check if anything changed
    const original = data.find(r => r.Id === editRecord.Id);
    const fieldsToCompare = [
      'Date', 'PartName', 'MachineNumber', 'Capacity', 'Shift1', 'Shift2',
      'TotalNumbers', 'ProductionAchieved', 'ProductionTarget', 'InspectedQuantity',
      'SortedOK', 'SortedRejected', 'TotalSorted', 'SortingOut'
    ];

    const isChanged = fieldsToCompare.some(field => {
      // Compare numbers as numbers
      if (typeof original[field] === 'number') {
        return Number(original[field]) !== Number(editRecord[field]);
      }
      return original[field] !== editRecord[field];
    });

    if (!isChanged) {
      // No changes, just close modal
      setShowEditModal(false);
      toast.info("No changes made");
      return;
    }

    try {
      await axios.put('/api/prev-day-production', {
        id: editRecord.Id,
        date: editRecord.Date.split('T')[0],
        partName: editRecord.PartName,
        machineNumber: editRecord.MachineNumber,
        capacity: editRecord.Capacity,
        shift1: editRecord.Shift1,
        shift2: editRecord.Shift2,
        totalNumbers: editRecord.TotalNumbers,
        productionAchieved: editRecord.ProductionAchieved,
        productionTarget: editRecord.ProductionTarget,
        inspectedQuantity: editRecord.InspectedQuantity,
        sortedOK: editRecord.SortedOK,
        sortedRejected: editRecord.SortedRejected,
        totalSorted: editRecord.TotalSorted,
        sortingOut: editRecord.SortingOut
      });
      toast.success("Record updated successfully");
      fetchData();
      setShowEditModal(false);
      setData(prev => prev.map(r => r.Id === editRecord.Id ? editRecord : r));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update record");
    }
  };




  return (
    <div className="mt-2">
      <h5 className='fw-bold'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Prev Day Production Records</p>

      {/* Filters */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="form-control frm-input-style"
          style={{ maxWidth: '180px' }}
        />
        <select
          name="partName"
          value={filters.partName}
          onChange={handleFilterChange}
          className="form-select frm-input-style"
          style={{ maxWidth: '180px' }}
        >
          <option value="">All Parts</option>
          <option value="Motor">Motor</option>
          <option value="Bearing">Bearing</option>
        </select>
        <button className="btn frm-input-style" onClick={clearFilters}>
          Clear All <IoMdCloseCircleOutline />
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive over-with-hv">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>Machine Number</th>
              <th>Capacity</th>
              <th>1st Shift</th>
              <th>2nd Shift</th>
              <th>Total Numbers</th>
              <th>% Production Achieved</th>
              <th>Production Target</th>
              <th>Inspected Quantity</th>
              <th>Sorted OK</th>
              <th>Sorted Rejected</th>
              <th>Total Sorted</th>
              <th>Sorting out (Qty)</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 16 }).map((__, j) => <td key={j}><Skeleton /></td>)}
                </tr>
              ))
            ) : data.length ? (
              data.map(r => (
                <tr key={r.Id}>
                  <td>{new Date(r.Date).toLocaleDateString()}</td>
                  <td>{r.PartName}</td>
                  <td>{r.MachineNumber}</td>
                  <td>{r.Capacity}</td>
                  <td>{r.Shift1}</td>
                  <td>{r.Shift2}</td>
                  <td>{r.TotalNumbers}</td>
                  <td>{r.ProductionAchieved}</td>
                  <td>{r.ProductionTarget}</td>
                  <td>{r.InspectedQuantity}</td>
                  <td>{r.SortedOK}</td>
                  <td>{r.SortedRejected}</td>
                  <td>{r.TotalSorted}</td>
                  <td>{r.SortingOut}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-edit"
                      onClick={() => openEditModal(r)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => confirmDelete(r.Id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="16" className="text-center">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this record?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editRecord && (
        <>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-header">
                    <h5 className='fw-bold mt-2'>Edit Record</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                  </div>
                  <div className="modal-body row g-3">
                    {/* Example fields */}
                    <div className="col-md-3">
                      <label className="form-label clr-label">Part Name</label>
                      <select
                        className="form-select frm-input-style"
                        value={editRecord.PartName}
                        onChange={e => handleEditChange('PartName', e.target.value)}
                      >
                        <option value="">Select Part</option>
                        <option value="Motor">Motor</option>
                        <option value="Bearing">Bearing</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label clr-label">Machine Number</label>
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
                      <label className="form-label clr-label">Total Numbers</label>
                      <input
                        type="number"
                        className="form-control frm-input-style"
                        value={editRecord.TotalNumbers}
                        disabled
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label clr-label">% Production Achieved</label>
                      <input
                        type="number"
                        className="form-control frm-input-style"
                        value={editRecord.ProductionAchieved}
                        onChange={e => handleEditChange('ProductionAchieved', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label clr-label">Production Target</label>
                      <input
                        type="number"
                        className="form-control frm-input-style"
                        value={editRecord.ProductionTarget}
                        onChange={e => handleEditChange('ProductionTarget', e.target.value)}
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
                      <label className="form-label clr-label">Total Sorted</label>
                      <input
                        type="number"
                        className="form-control frm-input-style"
                        value={editRecord.TotalSorted}
                        disabled
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label clr-label">Sorting Out (Qty)</label>
                      <input
                        type="number"
                        className="form-control frm-input-style"
                        value={editRecord.SortingOut}
                        onChange={e => handleEditChange('SortingOut', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label clr-label">Date</label>
                      <input
                        type="date"
                        className="form-control frm-input-style"
                        value={editRecord.Date.split('T')[0]} // to handle ISO string
                        onChange={e => handleEditChange('Date', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <div className="row">
                      <div className="col-sm-4">
                        <button
                          type="button"
                          className="btn btn-cancel me-3 px-3"
                          onClick={() => setShowEditModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-sm-8">
                        <button type="submit" className="btn btn-blue-clr px-3">
                          Save Changes
                        </button>
                      </div>
                    </div>





                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default PrevDayProductionTable;

