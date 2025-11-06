"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkInProgressTable = ({ refreshFlag }) => {
  const [data, setData] = useState([]);
  const [parts, setParts] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");
  const [filteredPart, setFilteredPart] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [refresh, setRefresh] = useState(false);

  // ✅ Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        if (filteredDate) params.append("date", filteredDate);
        if (filteredPart) params.append("partName", filteredPart);

        const res = await axios.get(`/api/workinprogress?${params.toString()}`);
        setData(res.data.data || []);
        setParts(res.data.partOptions || []);
        setTotalPages(res.data.pages || 1);
      } catch {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, [filteredDate, filteredPart, refresh, refreshFlag, page]);

  // ✅ Handle edit
  const openEdit = (row) => {
    setSelectedRow(row);
    setEditForm({ ...row, date: row.date?.split("T")[0] });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    const isSame = Object.keys(editForm).every(
      (key) => String(editForm[key]) === String(selectedRow[key])
    );
    if (isSame) {
      toast.info("No changes found");
      return;
    }
    try {
      await axios.put("/api/workinprogress", editForm);
      toast.success("Record updated successfully");
      setEditModal(false);
      setRefresh(!refresh);
    } catch {
      toast.error("Failed to update");
    }
  };

  // ✅ Handle delete
  const openDelete = (row) => {
    setSelectedRow(row);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/workinprogress?id=${selectedRow.id}`);
      toast.success("Record deleted successfully");
      setDeleteModal(false);
      setRefresh(!refresh);
    } catch {
      toast.error("Failed to delete record");
    }
  };

  // ✅ Clear filters
  const clearFilters = () => {
    setFilteredDate("");
    setFilteredPart("");
    setPage(1);
    setRefresh(!refresh);
  };

  return (
    <div className="mt-5">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <h5 className="fw-bold">PRIMARY DATA</h5>
      <p className="text-muted small">Track ongoing production data.</p>

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input
            type="date"
            value={filteredDate}
            onChange={(e) => {
              setPage(1);
              setFilteredDate(e.target.value);
            }}
            className="form-control frm-table-style"
          />
        </div>
        <div className="col-md-3">
          <select
            value={filteredPart}
            onChange={(e) => {
              setPage(1);
              setFilteredPart(e.target.value);
            }}
            className="form-select frm-table-style"
          >
            <option value="">Select Part</option>
            {parts.map((p, i) => (
              <option key={i} value={p.PartName}>
                {p.PartName} ({p.DrawingNo})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={clearFilters}
          >
            Clear All <IoMdCloseCircleOutline />
          </button>
        </div>
      </div>

      {/* Table */}
        <div className="table-responsive">
          <Table bordered striped hover>
            <thead className="table-primary">
              <tr>
                <th>Date</th>
                <th>Part Name (Drawing No)</th>
                <th>Packed</th>
                <th>For Packing</th>
                <th>Under Packing</th>
                <th>For Plating</th>
                <th>Under Heat Treatment</th>
                <th>Under PTFE</th>
                <th>For PTFE</th>
                <th>For Heat Treatment</th>
                <th>Sorted (OK)</th>
                <th>Sorted (Rejected)</th>
                <th>Total Sorted</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                    <td>{r.partName}</td>
                    <td>{r.packed}</td>
                    <td>{r.forPacking}</td>
                    <td>{r.underPacking}</td>
                    <td>{r.forPlating}</td>
                    <td>{r.underHeatTreatment}</td>
                    <td>{r.underPTFE}</td>
                    <td>{r.forPTFE}</td>
                    <td>{r.forHeatTreatment}</td>
                    <td>{r.sortedOK}</td>
                    <td>{r.sortedRejected}</td>
                    <td>{r.totalSorted}</td>
                    <td>
                      <button
                        size="sm"
                        className="btn btn-edit btn-sm"
                        onClick={() => openEdit(r)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        size="sm"
                        className="btn btn-danger btn-sm"
                        onClick={() => openDelete(r)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="text-center text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3 mb-5">
          <Button
            variant="outline-primary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="me-2"
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="ms-2"
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editForm && (
            <Form>
              {Object.entries(editForm)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <Form.Group className="mb-2" key={key}>
                    <Form.Label className="text-capitalize">{key}</Form.Label>
                    <Form.Control
                      type={key === "date" ? "date" : "number"}
                      name={key}
                      value={value || ""}
                      onChange={handleEditChange}
                      disabled={key === "id"}
                    />
                  </Form.Group>
                ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this record permanently?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkInProgressTable;
