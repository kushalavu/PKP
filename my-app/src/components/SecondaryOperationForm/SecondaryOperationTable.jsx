"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "react-loading-skeleton/dist/skeleton.css";

const SecondaryOperationTable = ({ refreshFlag }) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ date: "" });
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const isWithin30Days = (dateStr) => {
    const recordDate = new Date(dateStr);
    const now = new Date();
    const diff = (now - recordDate) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  };
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};


  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      params.append("page", page);
      params.append("limit", pageSize);

      const res = await axios.get(`/api/secondary-operation?${params.toString()}`);
      if (res.data.success) {
        setData(res.data.data);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(page);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Fetch error", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, refreshFlag]);

  const handleEdit = (row) => {
    setEditingRow({
      id: row.Id,
      date: row.Date,
      coreCSKDone: row.CoreCSKDone,
      coreVisualDone: row.CoreVisualDone,
      magneticDrill: row.MagneticDrill,
      magneticVisual: row.MagneticVisual,
      pivotPin: row.PivotPin,
    });
  };

  const handleChange = (e, field) => {
    const numericFields = [
      "coreCSKDone",
      "coreVisualDone",
      "magneticDrill",
      "magneticVisual",
      "pivotPin",
    ];
    const value = numericFields.includes(field)
      ? Number(e.target.value)
      : e.target.value;
    setEditingRow({ ...editingRow, [field]: value });
  };

  const handleSave = async () => {
    if (saving || !editingRow) return;

    const original = data.find((d) => d.Id === editingRow.id);
    if (!original) {
      toast.error("Original record not found");
      return;
    }

    const fieldMapping = {
      coreCSKDone: "CoreCSKDone",
      coreVisualDone: "CoreVisualDone",
      magneticDrill: "MagneticDrill",
      magneticVisual: "MagneticVisual",
      pivotPin: "PivotPin",
    };

    const isChanged = Object.keys(fieldMapping).some(
      (key) => Number(editingRow[key]) !== Number(original[fieldMapping[key]])
    );

    if (!isChanged) {
      toast.info("No changes detected");
      setEditingRow(null);
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put("/api/secondary-operation", editingRow);

      if (res.status === 200) {
        toast.success(res.data?.message || "Record updated successfully");
        fetchData(currentPage);
        setEditingRow(null);
      } else {
        toast.error(res.data?.message || "Failed to update record");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update record");
    } finally {
      setSaving(false);
    }
  };


  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const res = await axios.delete(`/api/secondary-operation?id=${id}`);
      if (res.status === 200) {
        toast.success(res.data?.message || "Record deleted");
        fetchData(currentPage);
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-5">
      <h5 className="fw-bold">SECONDARY OPERATION DATA</h5>
      <p className="text-muted small">
        Filter and view secondary operation details
      </p>

      {/* Filters */}
      <Row className="g-2 mb-3 align-items-center">
        <Col sm="auto">
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
        </Col>

        <Col sm="auto">
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => setFilters({ date: "" })}
          >
            Clear <IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table bordered responsive>
        <thead className="table-primary">
          <tr>
            <th>Date</th>
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
            Array(pageSize)
              .fill(0)
              .map((_, i) => (
                <tr key={i}>
                  <td colSpan="8">
                    <Skeleton height={30} />
                  </td>
                </tr>
              ))
          ) : data.length > 0 ? (
            data.map((row) => (
              <tr key={row.Id}>
                <td>{new Date(row.Date).toLocaleDateString()}</td>
                <td>{row.CoreCSKDone}</td>
                <td>{row.CoreVisualDone}</td>
                <td>{row.MagneticDrill}</td>
                <td>{row.MagneticVisual}</td>
                <td>{row.PivotPin}</td>
                <td>
                  <Button
                    size="sm"
                    className="btn btn-sm btn-edit"
                    onClick={() => handleEdit(row)}
                    disabled={!isWithin30Days(row.Date)}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => confirmDelete(row.Id)}
                    disabled={!isWithin30Days(row.Date)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3 mb-5">
          <Button
            variant="outline-primary"
            className="me-2"
            disabled={currentPage === 1 || loading}
            onClick={() => fetchData(currentPage - 1)}
          >
            Previous
          </Button>

          <span className="align-self-center">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline-primary"
            className="ms-2"
            disabled={currentPage === totalPages || loading}
            onClick={() => fetchData(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={!!editingRow} onHide={() => setEditingRow(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingRow && (
            <>
              <Form.Group className="mb-2">
                <Form.Label className="clr-label">Date</Form.Label>
        <Form.Control
  type="date"
  className="frm-input-style"
  value={formatDateForInput(editingRow.date)}
  disabled
/>

              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="clr-label">Core CSK Done</Form.Label>
                <Form.Control
                  type="number"
                  className="frm-input-style"
                  value={editingRow.coreCSKDone}
                  onChange={(e) => handleChange(e, "coreCSKDone")}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="clr-label">Core Visual Done</Form.Label>
                <Form.Control
                  type="number"
                  className="frm-input-style"
                  value={editingRow.coreVisualDone}
                  onChange={(e) => handleChange(e, "coreVisualDone")}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="clr-label">Magnetic Drill</Form.Label>
                <Form.Control
                  type="number"
                  className="frm-input-style"
                  value={editingRow.magneticDrill}
                  onChange={(e) => handleChange(e, "magneticDrill")}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="clr-label">Magnetic Visual</Form.Label>
                <Form.Control
                  type="number"
                  className="frm-input-style"
                  value={editingRow.magneticVisual}
                  onChange={(e) => handleChange(e, "magneticVisual")}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="clr-label">Pivot Pin</Form.Label>
                <Form.Control
                  type="number"
                  className="frm-input-style"
                  value={editingRow.pivotPin}
                  onChange={(e) => handleChange(e, "pivotPin")}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-edit"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SecondaryOperationTable;
