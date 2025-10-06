'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

const NotesTable = ({ refreshFlag }) => {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data?.data);
    } catch (err) {
      console.error(err);
      toast.error(es.data?.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [refreshFlag]);

  const handleEdit = (row) => {
    setEditingId(row.Id);
    setEditedRow({ ...row });
  };

  const handleChange = (e, field) => {
    setEditedRow({ ...editedRow, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const reuest = await axios.put('/api/notes', editedRow);
      toast.success(reuest.data?.message);
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update note');
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedNoteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const resDelete = await axios.delete(`/api/notes?id=${selectedNoteId}`);
      toast.success(resDelete.data.message);
      fetchNotes();
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
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>For Plating</th>
              <th>Notes</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan="5">No notes available</td>
              </tr>
            ) : (
              notes.map((row) => (
                <tr key={row.Id}>
                  <td>{new Date(row.Date).toLocaleDateString()}</td>
                  <td>
                    {editingId === row.Id ? (
                      <input
                        type="text"
                        value={editedRow.ForPlating || ''}
                        onChange={(e) => handleChange(e, 'ForPlating')}
                        className="form-control"
                      />
                    ) : row.ForPlating && row.ForPlating.trim() !== '' ? (
                      row.ForPlating
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {editingId === row.Id ? (
                      <textarea
                        value={editedRow.Note || ''}
                        onChange={(e) => handleChange(e, 'Note')}
                        className="form-control"
                      />
                    ) : row.Note && row.Note.trim() !== '' ? (
                      row.Note
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {editingId === row.Id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={async () => {
                            try {
                              if (!editedRow.Date || !editedRow.Note) {
                                toast.error('Date and Note are required!');
                                return;
                              }

                              await axios.put('/api/notes', {
                                id: editedRow.Id, // Make sure ID is sent
                                Date: editedRow.Date,
                                ForPlating: editedRow.ForPlating,
                                Note: editedRow.Note
                              });

                              toast.success('Note updated successfully!');
                              setEditingId(null);
                              fetchNotes();
                            } catch (err) {
                              console.error(err);
                              toast.error(err.response?.data?.message || 'Failed to update note');
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(row)}
                      >
                        Edit <i className="bi bi-pencil"></i>
                      </button>
                    )}
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
        <Modal.Body>
          Are you sure you want to delete this note?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotesTable;
