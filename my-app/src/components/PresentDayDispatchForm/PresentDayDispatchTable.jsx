'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { Table, Button, Modal, Form, Pagination, Row, Col, Dropdown } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const PresentDayDispatchTable = ({ refreshFlag }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ date: '', partName: '', customer: '' });
  const [partOptions, setPartOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  // Edit modal
  const [editModal, setEditModal] = useState({ show: false, currentIndex: 0 });
  const [editedRow, setEditedRow] = useState({});

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, date: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.partName) params.append('partName', filters.partName);
      if (filters.customer) params.append('customer', filters.customer);
      params.append('page', page);
      params.append('limit', pageSize);

      const res = await axios.get(`/api/present-day-dispatch?${params.toString()}`);
      if (res.data.success) {
        setData(res.data.data);
        setPartOptions(res.data.partOptions || []);
        setCustomerOptions(res.data.customerOptions || []);
        setTotalPages(Math.ceil(res.data.data.length / pageSize));
        setCurrentPage(page);
      } else {
        setData([]);
        toast.info(res.data.message || 'No records found');
      }
    } catch (err) {
      console.error(err);
      setData([]);
      toast.error(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [refreshFlag, filters]);

  const handleChange = (e, field) => {
    let value = e.target.value;
    if (field === 'quantity') value = Number(value);
    setEditedRow({ ...editedRow, [field]: value });
  };

  const isEditable = (rowDate) => {
    const today = new Date();
    const row = new Date(rowDate);
    const diffDays = (today - row) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };
    const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};
  // Open Edit modal at a specific index
  const openEditModal = (index) => {
    const row = data[index];
setEditedRow({
  id: row.id,
  date: formatDateForInput(row.date),
  customer: row.customer || '',
  partName: row.partName || '',
  quantity: row.quantity || 0,
  newProcess: row.newProcess || ''
});

    setEditModal({ show: true, currentIndex: index, editable: isEditable(row.date) });
  };

  // Navigate modal records
  const navigateModal = (direction) => {
    let newIndex = editModal.currentIndex + direction;
    if (newIndex < 0 || newIndex >= data.length) return; // bounds check
    openEditModal(newIndex);
  };

const handleSave = async () => {
  if (!editModal.editable) {
    toast.error('Cannot edit records older than 30 days');
    return;
  }

  if (!editedRow.date || !editedRow.customer || !editedRow.partName || !editedRow.quantity || !editedRow.newProcess) {
    toast.error('All fields are required!');
    return;
  }

  // Compare with original row
  const original = data[editModal.currentIndex];
  const isChanged =
    editedRow.quantity !== original.quantity ||
    editedRow.newProcess !== original.newProcess;

  if (!isChanged) {
    toast.info('No changes detected');
     setEditModal({ show: false, currentIndex: 0 });
    return;
  }

  try {
    const res = await axios.put('/api/present-day-dispatch', editedRow);

    if (res.status === 200 && res.data.success) {
      toast.success(res.data.message || 'Dispatch updated successfully!');
      setEditModal({ show: false, currentIndex: 0 });
      fetchData(currentPage);
    } else {
      toast.error(res.data.message || 'Update failed!');
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Update failed!');
  }
};

const handleDeleteConfirm = async () => {
  if (!isEditable(deleteModal.date)) {
    toast.error('Cannot delete records older than 30 days');
    return;
  }

  if (deleteLoading) return;
  setDeleteLoading(true);

  try {
    const res = await axios.delete(`/api/present-day-dispatch?id=${deleteModal.id}`);

    if (res.status === 200 && res.data.success) {
      toast.success(res.data.message || 'Dispatch deleted successfully!');
      fetchData(currentPage);
    } else {
      toast.error(res.data.message || 'Failed to delete dispatch');
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to delete dispatch');
  } finally {
    setDeleteModal({ show: false, id: null, date: null });
    setDeleteLoading(false);
  }
};


  return (
    <div className="mt-5">
      <h5><strong>PRESENT DAY DISPATCH</strong></h5>
      <p className="text-muted">Filter and manage present day dispatch details.</p>

      {/* Filters */}
      <Row className="g-2 mb-3">
        <Col sm='auto'>
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
            scrollableYearDropdown
            yearDropdownItemNumber={30}
            showMonthDropdown
          />
        </div>
        </Col>

        <Col sm='auto'>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              {filters.partName || "All Parts"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilters({ ...filters, partName: "" })}>All Parts</Dropdown.Item>
              {partOptions.map((part, idx) => (
                <Dropdown.Item key={idx} onClick={() => setFilters({ ...filters, partName: part })}>{part}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col sm='auto'>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              {filters.customer || "All Customers"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilters({ ...filters, customer: "" })}>All Customers</Dropdown.Item>
              {customerOptions.map((cust, idx) => (
                <Dropdown.Item key={idx} onClick={() => setFilters({ ...filters, customer: cust })}>{cust}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col sm='auto'>
          <Button variant="outline-secondary" onClick={() => setFilters({ date: '', partName: '', customer: '' })} className="w-100">
            Clear<IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      {/* Table */}
        <Table bordered hover responsive className="text-center">
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
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => <td key={j}><Skeleton height={20} /></td>)}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr><td colSpan={7}>No data available</td></tr>
            ) : (
              data
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((row, i) => (
                  <tr key={row.id ?? i}>
                    <td>{new Date(row.date).toLocaleDateString()}</td>
                    <td>{row.customer}</td>
                    <td>{row.partName}</td>
                    <td>{row.quantity}</td>
                    <td>{row.newProcess}</td>
                    <td>
                      <Button className='btn btn-sm btn-edit' size="sm" onClick={() => openEditModal(i)} disabled={!isEditable(row.date)}>Edit</Button>
                    </td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => setDeleteModal({ show: true, id: row.id, date: row.date })} disabled={!isEditable(row.date)}>Delete</Button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>

  {/* Pagination */}
{totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center mt-3 mb-5">
    <Button
      variant="outline-primary"
      className="me-2"
      disabled={currentPage === 1 || loading}
      onClick={() => fetchData(currentPage - 1)}
    >
      Previous
    </Button>

    <span className="mx-3">
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
      <Modal show={editModal.show} onHide={() => setEditModal({ show: false, currentIndex: 0 })} centered>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold'>Edit Dispatch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Date</Form.Label>
          <Form.Control 
  type="date" 
  value={editedRow.date || ''} 
  disabled 
/>

          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Customer</Form.Label>
            <Form.Control type="text" value={editedRow.customer || ''} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Part Name</Form.Label>
            <Form.Control type="text" value={editedRow.partName || ''} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" value={editedRow.quantity || ''} onChange={(e) => handleChange(e, 'quantity')} disabled={!editModal.editable} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>New Process</Form.Label>
            <Form.Control type="text" value={editedRow.newProcess || ''} onChange={(e) => handleChange(e, 'newProcess')} disabled={!editModal.editable} />
          </Form.Group>

          {/* Modal Pagination */}
          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={() => navigateModal(-1)} disabled={editModal.currentIndex === 0}>Previous</Button>
            <Button variant="secondary" onClick={() => navigateModal(1)} disabled={editModal.currentIndex === data.length - 1}>Next</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave} disabled={!editModal.editable}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModal.show} onHide={() => setDeleteModal({ show: false, id: null, date: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal({ show: false, id: null, date: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleteLoading || !isEditable(deleteModal.date)}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PresentDayDispatchTable;
