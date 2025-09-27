"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { toast } from 'react-toastify';
import "react-loading-skeleton/dist/skeleton.css";
import { IoMdCloseCircleOutline } from "react-icons/io";

const SecondaryOperationTable = ({ refreshFlag }) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ date: "", partName: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [deleteId, setDeleteId] = useState(null); // ID for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.partName) params.append("partName", filters.partName);

      const res = await axios.get(`/api/secondary-operation?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, refreshFlag]);

  // Start editing
  const handleEdit = (row) => {
    setEditingId(row.Id);
    setEditedRow({
      id: row.Id,
      date: row.Date?.split("T")[0],
      partName: row.PartName,
      coreCSKDone: row.CoreCSKDone,
      coreVisualDone: row.CoreVisualDone,
      magneticDrill: row.MagneticDrill,
      magneticVisual: row.MagneticVisual,
      pivotPin: row.PivotPin
    });
  };

  // Handle input changes
  const handleChange = (e, field) => {
    const numericFields = ["coreCSKDone","coreVisualDone","magneticDrill","magneticVisual","pivotPin"];
    const value = numericFields.includes(field) ? Number(e.target.value) : e.target.value;
    setEditedRow({ ...editedRow, [field]: value });
  };

  // Save edited row
  const handleSave = async () => {
    try {
      await axios.put("/api/secondary-operation", editedRow);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Open delete modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Delete row
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/secondary-operation?id=${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="mt-5">
      <h5 className="fw-bold">SECONDARY OPERATION DATA</h5>
      <p className="text-muted small">Filter and view secondary operation details</p>

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            name="partName"
            value={filters.partName}
            onChange={(e) => setFilters({ ...filters, partName: e.target.value })}
            className="form-select frm-table-style"
            style={{ maxWidth: '180px' }}
          >
            <option value="">All Parts</option>
            <option value="Motor">Motor</option>
            <option value="Bearing">Bearing</option>
          </select>
        </div>
        <div className="col-md-1">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setFilters({ date: "", partName: "" })}
          >
            Clear <IoMdCloseCircleOutline />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll-wrapper">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>Core CSK Done</th>
              <th>Core Visual Done</th>
              <th>Magnetic Drill</th>
              <th>Magnetic Visual</th>
              <th>Pivot Pin</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={80} /></td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr key={row.Id}>
                  <td>{row.Date?.split("T")[0]}</td>

                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="text"
                        value={editedRow.partName}
                        onChange={(e) => handleChange(e, "partName")}
                        className="form-control"
                      />
                    ) : (
                      row.PartName
                    )}
                  </td>

                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="number"
                        value={editedRow.coreCSKDone}
                        onChange={(e) => handleChange(e, "coreCSKDone")}
                        className="form-control"
                      />
                    ) : (
                      row.CoreCSKDone
                    )}
                  </td>

                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="number"
                        value={editedRow.coreVisualDone}
                        onChange={(e) => handleChange(e, "coreVisualDone")}
                        className="form-control"
                      />
                    ) : (
                      row.CoreVisualDone
                    )}
                  </td>

                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="number"
                        value={editedRow.magneticDrill}
                        onChange={(e) => handleChange(e, "magneticDrill")}
                        className="form-control"
                      />
                    ) : (
                      row.MagneticDrill
                    )}
                  </td>

                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="number"
                        value={editedRow.magneticVisual}
                        onChange={(e) => handleChange(e, "magneticVisual")}
                        className="form-control"
                      />
                    ) : (
                      row.MagneticVisual
                    )}
                  </td>

                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="number"
                        value={editedRow.pivotPin}
                        onChange={(e) => handleChange(e, "pivotPin")}
                        className="form-control"
                      />
                    ) : (
                      row.PivotPin
                    )}
                  </td>

                  <td>
                    {editingId === row.Id ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(row)}>
                        Edit
                      </button>
                    )}
                  </td>

                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(row.Id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
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
    </div>
  );
};

export default SecondaryOperationTable;
