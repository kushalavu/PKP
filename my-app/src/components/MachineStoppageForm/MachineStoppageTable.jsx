'use client';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const MachineStoppageTable = forwardRef((props, ref) => {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/machine-stoppage');
      setRows(res.data);
    } catch (err) {
      console.error(err);
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
    setEditingId(row.id);
    setEditedRow({ ...row });
  };

  const handleChange = (e, field) => {
    setEditedRow({ ...editedRow, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/machine-stoppage?id=${editedRow.id}`, editedRow);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDeleteClick = (id) => {
    setSelectedRowId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/machine-stoppage?id=${selectedRowId}`);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-5">
      <h5 className='fw-bold'>PRIMARY DATA</h5>
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
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="10">No data available</td>
              </tr>
            ) : (
              rows.map((row, index) => (
               <tr key={row.id || index}>
                  <td>{editingId === row.id ? (
                    <input
                      type="date"
                      value={editedRow.date}
                      onChange={(e) => handleChange(e, 'date')}
                      className="form-control"
                    />
                  ) : row.date?.split('T')[0]}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="text"
                      value={editedRow.part}
                      onChange={(e) => handleChange(e, 'part')}
                      className="form-control"
                    />
                  ) : row.part}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="number"
                      value={editedRow.machinesAllotted}
                      onChange={(e) => handleChange(e, 'machinesAllotted')}
                      className="form-control"
                    />
                  ) : row.machinesAllotted}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="number"
                      value={editedRow.running}
                      onChange={(e) => handleChange(e, 'running')}
                      className="form-control"
                    />
                  ) : row.running}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="number"
                      value={editedRow.notRunning}
                      onChange={(e) => handleChange(e, 'notRunning')}
                      className="form-control"
                    />
                  ) : row.notRunning}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="number"
                      value={editedRow.underSetting}
                      onChange={(e) => handleChange(e, 'underSetting')}
                      className="form-control"
                    />
                  ) : row.underSetting}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="text"
                      value={editedRow.maintenance}
                      onChange={(e) => handleChange(e, 'maintenance')}
                      className="form-control"
                    />
                  ) : row.maintenance}</td>

                  <td>{editingId === row.id ? (
                    <input
                      type="text"
                      value={editedRow.remarks}
                      onChange={(e) => handleChange(e, 'remarks')}
                      className="form-control"
                    />
                  ) : row.remarks}</td>

                  <td>
                    {editingId === row.id ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(row)}>
                        <FiEdit />
                      </button>
                    )}
                  </td>

                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(row.id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
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
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default MachineStoppageTable;
