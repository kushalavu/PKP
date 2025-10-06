'use client';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoMdCloseCircleOutline } from "react-icons/io";

const TestingUnitsTable = forwardRef((props, ref) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ date: '', partName: '' });
  const [editRow, setEditRow] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [originalUnits, setOriginalUnits] = useState([]);



  const modalRef = useRef();

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.partName) params.append('partName', filters.partName);

const res = await axios.get(`/api/testing-units?${params.toString()}`);
if (res.data.success) {
  setUnits(res.data.data); // for rendering in the table
  setOriginalUnits(res.data.data.map(u => ({ ...u }))); // separate copy for edit comparison
} else {
  setUnits([]);
  setOriginalUnits([]); // also clear originalUnits if no data
}

    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };


  // Expose fetchUnits to parent
  useImperativeHandle(ref, () => ({
    fetchUnits
  }));

  useEffect(() => {
    fetchUnits();
  }, [filters]);

  const handleEdit = (id) => setEditRow(id);

 const handleSave = async (id) => {
  const row = units.find(u => u.Id === id);
  const original = originalUnits.find(u => u.Id === id);

  if (!original) {
    toast.error("Original data not found");
    return;
  }

  const isChanged =
    Number(row.Accepted || 0) !== Number(original.Accepted || 0) ||
    Number(row.Rejected || 0) !== Number(original.Rejected || 0);

  if (!isChanged) {
    toast.info("No changes made");
    setEditRow(null);
    return;
  }

  try {
    await axios.put('/api/testing-units', {
      id,
      accepted: row.Accepted,
      rejected: row.Rejected,
      total: row.Total
    });
    toast.success('Updated successfully');
    setEditRow(null);
    fetchUnits();
  } catch (err) {
    console.error(err);
    toast.error('Update failed');
  }
};



  const handleChange = (id, field, value) => {
    setUnits(prev =>
      prev.map(u =>
        u.Id === id
          ? {
            ...u,
            [field]: value,
            Total:
              field === 'Accepted' || field === 'Rejected'
                ? parseInt(u.Accepted || 0) + parseInt(u.Rejected || 0)
                : u.Total
          }
          : u
      )
    );
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);  // This will show the modal
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`/api/testing-units?id=${deleteId}`);
      toast.success('Deleted successfully');
      fetchUnits();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <h5 className='fw-bold mt-3'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Testing unit records</p>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <input
          type="date"
          className="form-control frm-input-style me-2"
          style={{ maxWidth: '200px' }}
          value={filters.date}
          onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
        />
        <select
          className="form-select frm-input-style"
          style={{ maxWidth: '200px' }}
          value={filters.partName}
          onChange={e => setFilters(prev => ({ ...prev, partName: e.target.value }))}
        >
          <option value="">Part Name</option>
          <option value="Motor">Motor</option>
          <option value="Bearing">Bearing</option>
        </select>
        <button className="btn frm-input-style" onClick={() => setFilters({ date: '', partName: '' })}>
          Clear All <IoMdCloseCircleOutline />
        </button>
      </div>

      <div className="table-responsive over-with-hv 100vw">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>OSM Number</th>
              <th>Accepted</th>
              <th>Rejected</th>
              <th>Total</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(5).fill().map((_, i) => (
                <tr key={i}>
                  {Array(8).fill().map((_, j) => (
                    <td key={j}><Skeleton /></td>
                  ))}
                </tr>
              ))
              : units.length === 0
                ? <tr><td colSpan={8}>No records found</td></tr>
                : units.map(u => (
                  <tr key={u.Id}>
                    <td>{new Date(u.Date).toLocaleDateString()}</td>
                    <td>{u.PartName}</td>
                    <td>{u.OSMNumber}</td>
                    <td>
                      {editRow === u.Id ? (
                        <input
                          type="number"
                          value={u.Accepted}
                          onChange={e => handleChange(u.Id, 'Accepted', e.target.value)}
                        />
                      ) : (
                        u.Accepted
                      )}
                    </td>
                    <td>
                      {editRow === u.Id ? (
                        <input
                          type="number"
                          value={u.Rejected}
                          onChange={e => handleChange(u.Id, 'Rejected', e.target.value)}
                        />
                      ) : (
                        u.Rejected
                      )}
                    </td>
                    <td>
                      {editRow === u.Id ? (
                        // Show reactive Total in edit mode
                        parseInt(u.Accepted || 0) + parseInt(u.Rejected || 0)
                      ) : (
                        u.Total
                      )}
                    </td>

                    <td>
                      {editRow === u.Id ? (
                        <button className="btn btn-success w-100 btn-sm" onClick={() => handleSave(u.Id)}>Save</button>
                      ) : (
                        <button
                          className="btn btn-edit btn-sm"
                          onClick={() => handleEdit(u.Id)}
                          disabled={loading}
                        >
                          Edit
                        </button>

                      )}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(u.Id)}>Delete</button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this record?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteConfirmed}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
});

export default TestingUnitsTable;
