'use client';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoMdCloseCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

const PreDayWorkersTable = forwardRef((props, ref) => {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ date: '' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editRow, setEditRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [originalRecords, setOriginalRecords] = useState([]);

  const parseDateToLocal = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const isWithin30Days = (dateStr) => {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split('-');
    const recordDate = new Date(Number(y), Number(m) - 1, Number(d));
    const now = new Date();
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  const fetchRecords = async (pageNo = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNo, limit: 10 });
      if (filters.date) params.append("date", filters.date);

      const res = await axios.get(`/api/predayworkallotment?${params.toString()}`);
      const data = res.data.data.map(r => ({ ...r, date: r.date.split('T')[0] }));

      setRecords(data);
      setOriginalRecords(data.map(r => ({ ...r })));
      setTotalPages(res.data.pages || 1);
      setPage(pageNo);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ fetchRecords }));

  // Fetch on filter change or refreshFlag change
  useEffect(() => {
    fetchRecords(1);
  }, [filters, props.refreshFlag]); // ✅ added refreshFlag

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) fetchRecords(newPage);
  };

  const handleDateChange = (date) => {
    if (!date) return setFilters({ date: '' });
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    setFilters({ date: `${y}-${m}-${d}` });
  };
  const clearFilters = () => setFilters({ date: '' });

  const handleEdit = (record) => setEditRow({ ...record });
  const handleChange = (field, value) => setEditRow(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!editRow) return;

    const original = originalRecords.find(r => r.id === editRow.id);
    if (!original) return toast.error("Original data not found");

    const editableFields = ["coreDrilling","coreVisual","magneticCoreDrilling","magneticCoreVisual","pip","sortingOut","platedVisual","poleTap","osm"];
    const hasChanges = editableFields.some(f => String(editRow[f] || "") !== String(original[f] || ""));
    if (!hasChanges) {
      toast.info("No changes made");
      setEditRow(null);
      return;
    }

    try {
      await axios.put('/api/predayworkallotment', { id: editRow.id, ...editRow });
      toast.success("Record updated successfully");
      setEditRow(null);
      fetchRecords(page);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const confirmDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };
  const handleDeleteConfirmed = async () => {
    try {
      const res = await axios.delete(`/api/predayworkallotment?id=${deleteId}`);
      toast.success(res.data?.message || "Deleted successfully");
      fetchRecords(page);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <h5 className='fw-bold mt-3'>PRIMARY DATA</h5>
      <p className="text-muted small init-nav-co">Manage pre-day worker records</p>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <div style={{ position: "relative", width: "200px" }}>
          <FaCalendarAlt
            onClick={() => document.getElementById("datePickerInput").focus()}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#007bff", fontSize: "18px", cursor: "pointer", zIndex: 3 }}
          />
          <DatePicker
            id="datePickerInput"
            selected={filters.date ? parseDateToLocal(filters.date) : null}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select Date"
            className="form-control frm-input-style"
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear <IoMdCloseCircleOutline />
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th><th>Core Drilling</th><th>Core Visual</th><th>Magnetic Core Drilling</th><th>Magnetic Core Visual</th>
              <th>PIP</th><th>Sorting Out</th><th>Plated Visual</th><th>Pole Tap</th><th>OSM</th><th>Edit</th><th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array(5).fill().map((_, i) => <tr key={i}>{Array(12).fill().map((_, j) => <td key={j}><Skeleton /></td>)}</tr>) :
            records.length === 0 ? <tr><td colSpan={12}>No records found</td></tr> :
            records.map(r => {
              const editable = isWithin30Days(r.date);
              return (
                <tr key={r.id}>
                  <td>{r.date ? r.date.split('-').reverse().join('-') : '-'}</td>
                  <td>{r.coreDrilling}</td><td>{r.coreVisual}</td><td>{r.magneticCoreDrilling}</td>
                  <td>{r.magneticCoreVisual}</td><td>{r.pip}</td><td>{r.sortingOut}</td>
                  <td>{r.platedVisual}</td><td>{r.poleTap}</td><td>{r.osm}</td>
                  <td><button className="btn btn-edit btn-sm" onClick={() => handleEdit(r)} disabled={!editable}>Edit</button></td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => confirmDelete(r.id)} disabled={!editable}>Delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 &&
        <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button className="btn btn-sm btn-outline-primary" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
        </div>
      }

      {editRow && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Record</h5>
                <button className="btn-close" onClick={() => setEditRow(null)}></button>
              </div>
              <div className="modal-body">
                {["coreDrilling","coreVisual","magneticCoreDrilling","magneticCoreVisual","pip","sortingOut","platedVisual","poleTap","osm"].map(f => (
                  <div className="mb-2" key={f}>
                    <label>{f.replace(/([A-Z])/g,' $1')}</label>
                    <input type={f==='osm'?'text':'number'} className="form-control frm-input-style" value={editRow[f]} onChange={e => handleChange(f,e.target.value)} />
                  </div>
                ))}
                <div className="mb-2">
                  <label>Date</label>
                  <input type="date" className="form-control frm-input-style" value={editRow.date} disabled />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-edit" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">Are you sure you want to delete this record?</div>
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

export default PreDayWorkersTable;
