'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const NotesTable = ({ refreshFlag }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [page, setPage] = useState(1);       
  const [totalPages, setTotalPages] = useState(1); 

  // ✅ Use ref to cache pages
  const notesCache = useRef({}); // { "1": [...], "2": [...] }
useEffect(() => {
  // Clear the cache when refreshFlag changes
  notesCache.current = {};
  fetchNotes(1); // always fetch fresh data on refreshFlag change
}, [refreshFlag, dateFilter]);

  // ✅ Fetch Notes with caching
  const fetchNotes = async (pageNumber = 1) => {
    const cacheKey = `${dateFilter || 'all'}-page-${pageNumber}`;

    // Use cached data if available
    if (notesCache.current[cacheKey]) {
      setNotes(notesCache.current[cacheKey].data);
      setTotalPages(notesCache.current[cacheKey].totalPages);
      setPage(pageNumber);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/api/notes', {
        params: { date: dateFilter, page: pageNumber, limit: 10 },
      });

      const fetchedData = res.data?.data || [];
      const fetchedTotalPages = res.data?.pages || 1;

      // Cache the fetched data
      notesCache.current[cacheKey] = {
        data: fetchedData,
        totalPages: fetchedTotalPages,
      };

      setNotes(fetchedData);
      setTotalPages(fetchedTotalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1); // Reset to first page on filter or refresh
  }, [refreshFlag, dateFilter]);

  // Pagination click
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchNotes(newPage);
  };

  // Edit modal
  const handleEditClick = (note) => {
    setEditingNote({
      ...note,
      originalDate: note.Date,
      originalForPlating: note.ForPlating,
      originalNote: note.Note,
    });
    setShowEditModal(true);
  };

const handleSaveEdit = async () => {
  if (!editingNote) return;

  const hasChanges =
    editingNote.Date !== editingNote.originalDate ||
    editingNote.ForPlating !== editingNote.originalForPlating ||
    editingNote.Note !== editingNote.originalNote;

  if (!hasChanges) {
    toast.info("No changes made");
    setShowEditModal(false);
    return;
  }

  if (!editingNote.Date || !editingNote.Note) {
    toast.error("Date and Note are required!");
    return;
  }

  try {
    // ✅ Send date as string "YYYY-MM-DD"
    const dateOnly = (() => {
  if (!editingNote?.Date) return '';
  const parts = editingNote.Date.split('-');
  if (parts.length === 3) {
    // Convert dd-mm-yyyy → yyyy-mm-dd
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return editingNote.Date; // fallback
})();


    await axios.put('/api/notes', {
      id: editingNote.Id,
      date: dateOnly,
      forPlating: editingNote.ForPlating || '',
      note: editingNote.Note,
    });

    toast.success("Note updated successfully!");
    setShowEditModal(false);

    // Invalidate cache
    const cacheKey = `${dateFilter || 'all'}-page-${page}`;
    delete notesCache.current[cacheKey];

    fetchNotes(page);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update note");
  }
};


  // Delete modal
  const handleDeleteClick = (id) => {
    setSelectedNoteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`/api/notes?id=${selectedNoteId}`);
      toast.success(res.data?.message || 'Note deleted');

      // Invalidate cache for current page
      const cacheKey = `${dateFilter || 'all'}-page-${page}`;
      delete notesCache.current[cacheKey];

      fetchNotes(page);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete note');
    } finally {
      setShowDeleteModal(false);
      setSelectedNoteId(null);
    }
  };

  return (
    <div className="mt-5">
      <h5><strong>Notes</strong></h5>
      <p className="text-muted">View and manage notes here</p>

      {/* Filters */}
      <Row className="mb-3">
        <Col sm="auto">
          <Form.Control
            type="date"
            className="date-filed-admin"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Col>
        <Col sm="auto">
          <Button
            variant="outline-secondary"
            onClick={() => setDateFilter('')}
            className="w-100"
          >
            Clear <IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Notes</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton count={2} /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                </tr>
              ))
            ) : notes.length === 0 ? (
              <tr>
                <td colSpan="5">No notes available</td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr key={note.Id}>
                  <td>{note.Date ? note.Date.split('T')[0] : '-'}</td>
                  <td>{note.ForPlating || '-'}</td>
                  <td>{note.Note || '-'}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(note)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(note.Id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mb-5 mt-3">
          <Button
            variant="outline-primary"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? 'primary' : 'outline-primary'}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline-primary"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className='fw-bold'>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
<Form.Control
  type="date"
  value={
    editingNote?.Date
      ? editingNote.Date.split('-').reverse().join('-')
      : ''
  }
  disabled
/>

            <Form.Group className="mb-3">
              <Form.Label>For Plating</Form.Label>
              <Form.Control
                type="text"
                className='frm-input-style'
                value={editingNote?.ForPlating || ''}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, ForPlating: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                className='frm-input-style'
                rows={3}
                value={editingNote?.Note || ''}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, Note: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-edit' onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this note? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default NotesTable;
