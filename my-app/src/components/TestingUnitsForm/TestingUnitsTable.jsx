'use client';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoMdCloseCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

const TestingUnitsTable = forwardRef((props, ref) => {
  const [units, setUnits] = useState([]);
  const [osmOptions, setOsmOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partNames, setPartNames] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    partName: '',
    osmNumber: '',
  });
  const [editRow, setEditRow] = useState(null); // Object for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [originalUnits, setOriginalUnits] = useState([]);
  // ✅ Add the helper function here
  const isWithin30Days = (dateStr) => {
    const recordDate = new Date(dateStr);
    const now = new Date();
    const diff = (now - recordDate) / (1000 * 60 * 60 * 24); // difference in days
    return diff <= 30; // true if within 30 days
  };

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Testing Units
  const fetchUnits = async (pageNo = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pageNo,
        limit: 10,
      });

      const res = await axios.get(`/api/testing-units?${params.toString()}`);
      if (res.data.success) {
        const { items, totalPages: pages } = res.data.data;
        setUnits(items);
        setOriginalUnits(items.map(u => ({ ...u })));
        setTotalPages(pages);

        // Extract unique Part Names dynamically
        const uniquePartNames = [...new Set(items.map(u => u.PartName).filter(Boolean))];
        setPartNames(uniquePartNames);

        // Extract unique OSM numbers
        const uniqueOSM = [...new Set(items.map(u => u.OSMNumber).filter(Boolean))];
        setOsmOptions(uniqueOSM);
      } else {
        setUnits([]);
        setOriginalUnits([]);
        setPartNames([]);
        setOsmOptions([]);
      }

    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchUnits
  }));

  useEffect(() => {
    fetchUnits(1);
  }, [filters]);

  const handleEdit = (unit) => setEditRow({ ...unit }); // open modal with unit data

  const handleChange = (field, value) => {
    setEditRow(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'Accepted' || field === 'Rejected') {
        const accepted = field === 'Accepted' ? parseInt(value || 0) : parseInt(prev.Accepted || 0);
        const rejected = field === 'Rejected' ? parseInt(value || 0) : parseInt(prev.Rejected || 0);
        updated.Total = accepted + rejected;
      }
      return updated;
    });
  };


  const handleSave = async () => {
    if (!editRow) return;

    const original = originalUnits.find(u => u.Id === editRow.Id);
    if (!original) {
      toast.error("Original data not found");
      setEditRow(null);
      return;
    }

    const isChanged =
      Number(editRow.Accepted || 0) !== Number(original.Accepted || 0) ||
      Number(editRow.Rejected || 0) !== Number(original.Rejected || 0);

    if (!isChanged) {
      toast.info("No changes made");
      setEditRow(null);
      return;
    }

    try {
      const res = await axios.put('/api/testing-units', {
        id: editRow.Id,
        accepted: editRow.Accepted,
        rejected: editRow.Rejected,
        total: editRow.Total
      }, {
        validateStatus: (status) => true // Accept all status codes
      });

      if (res.status === 200) {
        toast.success(res.data.message || "Updated successfully");
      } else {
        // Handle 403, 400, etc. here
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      // This block will now only handle unexpected network errors
      console.error(err);
      toast.error("Network error or unexpected issue");
    } finally {
      setEditRow(null); // always close modal immediately
      fetchUnits(page);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const res = await axios.delete(`/api/testing-units?id=${deleteId}`, {
        validateStatus: (status) => true // Accept all status codes
      });

      if (res.status === 200) {
        toast.success(res.data?.message || "Deleted successfully");
      } else {
        // For 403, 404, 400, etc.
        toast.error(res.data?.message || "Delete failed");
      }

      fetchUnits(page);
    } catch (err) {
      // Only real network errors end up here
      console.error(err);
      toast.error("Network error or unexpected issue");
    } finally {
      // Always close modal immediately
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchUnits(newPage);
    }
  };

  const clearFilters = () => {
    setFilters({ date: '', partName: '', osmNumber: '' });
  };

  return (
    <>
      <h5 className='fw-bold mt-3'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Testing unit records</p>
      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3">
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
            dateFormat="dd-MM-yyyy"
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

        <select
          className="form-select frm-input-style"
          style={{ maxWidth: '150px' }}
          value={filters.partName}
          onChange={e => setFilters(prev => ({ ...prev, partName: e.target.value }))}
        >
          <option value="">Part Name</option>
          {partNames.length === 0 ? (
            <option disabled>Loading...</option>
          ) : (
            partNames.map((name, idx) => (
              <option key={idx} value={name}>{name}</option>
            ))
          )}
        </select>

        <select
          className="form-select frm-input-style"
          style={{ maxWidth: '150px' }}
          value={filters.osmNumber}
          onChange={e => setFilters(prev => ({ ...prev, osmNumber: e.target.value }))}
        >
          <option value="">OSM Number</option>
          {osmOptions.map((num, idx) => <option key={idx} value={num}>{num}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear <IoMdCloseCircleOutline />
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
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
                <tr key={i}>{Array(8).fill().map((_, j) => <td key={j}><Skeleton /></td>)}</tr>
              ))
              : units.length === 0
                ? <tr><td colSpan={8}>No records found</td></tr>
                : units.map(u => {
                  const isEditable = isWithin30Days(u.Date); // ✅ compute once per row

                  return (
                    <tr key={u.Id}>
                      <td>{new Date(u.Date).toLocaleDateString()}</td>
                      <td>{u.PartName}</td>
                      <td>{u.OSMNumber}</td>
                      <td>{u.Accepted}</td>
                      <td>{u.Rejected}</td>
                      <td>{parseInt(u.Accepted || 0) + parseInt(u.Rejected || 0)}</td>
                      <td>
                        <button
                          className="btn btn-edit btn-sm"
                          onClick={() => handleEdit(u)}
                          disabled={!isEditable}
                          title={!isEditable ? "Action not allowed. Record older than 30 days." : ""}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDelete(u.Id)}
                          disabled={!isEditable}
                          title={!isEditable ? "Action not allowed. Record older than 30 days." : ""}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>

        </table>
      </div>
      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >Next</button>
      </div>
      {/* Edit Modal */}
      {/* Edit Modal */}
      {editRow && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Record</h5>
                <button className="btn-close" onClick={() => setEditRow(null)}></button>
              </div>
              <div className="modal-body">
                {/* Date */}
                <div className="mb-2">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control frm-input-style"
                    value={(() => {
                      const date = new Date(editRow.Date);
                      const offset = date.getTimezoneOffset();
                      const localDate = new Date(date.getTime() - offset * 60 * 1000);
                      return localDate.toISOString().split("T")[0];
                    })()}

                    disabled
                  />

                </div>

                {/* Part Name */}
                <div className="mb-2">
                  <label>Part Name</label>
                  <input
                    type="text"
                    className="form-control frm-input-style"
                    value={editRow.PartName}
                    disabled
                  />
                </div>

                {/* OSM Number */}
                <div className="mb-2">
                  <label>OSM Number</label>
                  <input
                    type="text"
                    className="form-control frm-input-style"
                    value={editRow.OSMNumber}
                    disabled
                  />
                </div>

                {/* Accepted */}
                <div className="mb-2">
                  <label>Accepted</label>
                  <input
                    type="number"
                    className="form-control frm-input-style"
                    value={editRow.Accepted}
                    onChange={e => handleChange('Accepted', e.target.value)}
                  />
                </div>

                {/* Rejected */}
                <div className="mb-2">
                  <label>Rejected</label>
                  <input
                    type="number"
                    className="form-control frm-input-style"
                    value={editRow.Rejected}
                    onChange={e => handleChange('Rejected', e.target.value)}
                  />
                </div>

                {/* Total */}
                <div className="mb-2">
                  <label>Total</label>
                  <input
                    type="number"
                    className="form-control frm-input-style"
                    value={editRow.Total}
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-edit" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
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
