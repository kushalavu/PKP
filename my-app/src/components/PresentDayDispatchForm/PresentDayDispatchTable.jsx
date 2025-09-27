'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap'; // Using react-bootstrap for modal

const PresentDayDispatchTable = ({ refreshFlag }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [filters, setFilters] = useState({ date: '', partName: '' });

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.partName) params.append('partName', filters.partName);

      const res = await axios.get(`/api/present-day-dispatch?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch dispatch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag, filters]);

  // Start editing
  const handleEdit = (row) => {
    setEditingId(row.Id);
    setEditedRow({ ...row });
  };

  const handleChange = (e, field) => {
    const value = field === 'Quantity' ? Number(e.target.value) : e.target.value;
    setEditedRow({ ...editedRow, [field]: value });
  };

  const handleSave = async () => {
    // Check if anything changed
    const originalRow = data.find((row) => row.Id === editingId);
    let changed = false;
    Object.keys(editedRow).forEach((key) => {
      if (editedRow[key] !== originalRow[key]) changed = true;
    });
    if (!changed) {
      toast.info('No changes detected');
      setEditingId(null);
      return;
    }

    // Validate required fields
    if (!editedRow.Date || !editedRow.Customer || !editedRow.PartName || !editedRow.Quantity || !editedRow.NewProcess) {
      toast.error('All fields are required!');
      return;
    }

    try {
      await axios.put('/api/present-day-dispatch', editedRow);
      toast.success('Dispatch updated successfully!');
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Update failed!';
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/present-day-dispatch?id=${deleteModal.id}`);
      toast.success('Dispatch deleted successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete dispatch');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  return (
    <div className="mt-5">
      <h5><strong>PRIMARY DATA</strong></h5>
      <p className="text-muted">View and manage present day dispatch details.</p>

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input
            type="date"
            className="form-control frm-table-style"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select frm-table-style"
            value={filters.partName}
            onChange={(e) => setFilters({ ...filters, partName: e.target.value })}
          >
            <option value="">All Parts</option>
            <option value="Part X">Part X</option>
            <option value="Part Y">Part Y</option>
          </select>
        </div>
        <div className="col-md-1">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setFilters({ date: '', partName: '' })}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive over-with-hv">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Part Name</th>
              <th>Quantity</th>
              <th>New Process</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7">No data available</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.Id}>
                  <td>{editingId === row.Id ? (
                    <input type="date" value={editedRow.Date?.split("T")[0]} onChange={(e) => handleChange(e, 'Date')} className="form-control" />
                  ) : row.Date?.split("T")[0]}</td>

                  <td>{editingId === row.Id ? (
                    <input type="text" value={editedRow.Customer} onChange={(e) => handleChange(e, 'Customer')} className="form-control" />
                  ) : row.Customer}</td>

                  <td>{editingId === row.Id ? (
                    <input type="text" value={editedRow.PartName} onChange={(e) => handleChange(e, 'PartName')} className="form-control" />
                  ) : row.PartName}</td>

                  <td>{editingId === row.Id ? (
                    <input type="number" value={editedRow.Quantity} onChange={(e) => handleChange(e, 'Quantity')} className="form-control" />
                  ) : row.Quantity}</td>

                  <td>{editingId === row.Id ? (
                    <input type="text" value={editedRow.NewProcess} onChange={(e) => handleChange(e, 'NewProcess')} className="form-control" />
                  ) : row.NewProcess}</td>

                  <td>
                    {editingId === row.Id ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(row)}>Edit</button>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteModal({ show: true, id: row.Id })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal className='modal-dialog-centered' show={deleteModal.show} onHide={() => setDeleteModal({ show: false, id: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal({ show: false, id: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PresentDayDispatchTable;
