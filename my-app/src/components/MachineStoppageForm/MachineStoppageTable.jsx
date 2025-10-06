'use client';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { IoMdCloseCircleOutline } from "react-icons/io";

const MachineStoppageTable = forwardRef((props, ref) => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [originalRow, setOriginalRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [partFilter, setPartFilter] = useState('');
  const uniqueParts = [...new Set(rows.map(row => row.Part))];

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/machine-stoppage');
      setRows(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    }
  };

  // Expose refreshData to parent
  useImperativeHandle(ref, () => ({
    refreshData: fetchData
  }));

  useEffect(() => {
    fetchData();
  }, []);

  // Edit
  const handleEdit = (row) => {
    setEditingId(row.Id);
    setEditedRow({ ...row });
    setOriginalRow({ ...row });
  };

  const handleChange = (e, field) => {
    setEditedRow({ ...editedRow, [field]: e.target.value });
  };

const handleSave = async () => {
  const hasChanges = Object.keys(editedRow).some(
    key => editedRow[key] !== originalRow[key]
  );

  if (!hasChanges) {
    toast.info("No changes detected");
    setEditingId(null);
    return;
  }

  setSaving(true);
  try {
    // Only send editable fields; date is not editable
    const payload = {
      id: editedRow.Id,
      part: editedRow.Part,
      machinesAllotted: Number(editedRow.MachinesAllotted),
      running: Number(editedRow.Running),
      notRunning: Number(editedRow.NotRunning),
      underSetting: Number(editedRow.UnderSetting),
      maintenance: editedRow.Maintenance,
      remarks: editedRow.Remarks,
      newProcess: editedRow.NewProcess
    };

    const stopRes = await axios.put(`/api/machine-stoppage?id=${editedRow.Id}`, payload);
    toast.success(stopRes.data?.message || "Updated successfully");
    setEditingId(null);
    fetchData();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update record");
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
      await axios.delete(`/api/machine-stoppage?id=${selectedRowId}`);
      toast.success("Record deleted successfully");
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  // Apply filters
  const filteredRows = rows.filter(row => {
    const matchesDate = dateFilter ? row.Date.startsWith(dateFilter) : true;
    const matchesPart = partFilter ? row.Part === partFilter : true;
    return matchesDate && matchesPart;
  });

  const handleClearFilters = () => {
    setDateFilter('');
    setPartFilter('');
  };

  return (
    <div className="mt-5">
      <h5 className='fw-bold'>PRIMARY DATA</h5>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ maxWidth: '180px' }}
        />
        <Form.Select
          value={partFilter}
          onChange={(e) => setPartFilter(e.target.value)}
          style={{ maxWidth: '180px' }}
        >
          <option value="">All Parts</option>
          {uniqueParts.map((part, idx) => (
            <option key={`part-${idx}`} value={part}>{part}</option>
          ))}
        </Form.Select>
        <Button onClick={handleClearFilters}>Clear <IoMdCloseCircleOutline /></Button>
      </div>

      {/* Table */}
      <div className="table-responsive over-with-hv">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part</th>
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
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan="11">No data available</td>
              </tr>
            ) : filteredRows.map(row => (
              <tr key={row.Id}>
                <td>{new Date(row.Date).toLocaleDateString()}</td>

                {['Part','MachinesAllotted','Running','NotRunning','UnderSetting','Maintenance','Remarks','NewProcess'].map(field => (
                  <td key={`${row.Id}-${field}`}>
                    {editingId === row.Id ? (
                      <input
                        type={['MachinesAllotted','Running','NotRunning','UnderSetting'].includes(field) ? "number" : "text"}
                        value={editedRow[field]}
                        onChange={e => handleChange(e, field)}
                        className="form-control"
                      />
                    ) : row[field]}
                  </td>
                ))}

                <td>
                  {editingId === row.Id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(row)}
                    >
                      <FiEdit />
                    </button>
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(row.Id)}
                    disabled={deleting}
                  >
                    {deleting && selectedRowId === row.Id ? "Deleting..." : <FiTrash2 />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
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
