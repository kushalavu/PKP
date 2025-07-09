import React from 'react';

const NotesTable = () => {
  return (
    <div className="mt-5">
      <h5><strong>Notes</strong></h5>
      <p className="text-muted">Please fill out the form to submit Testing Unit (OSM) Details</p>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Notes</th>
              <th>View</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12-03-2025</td>
              <td>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
              </td>
              <td>
                <button className="btn btn-outline-primary btn-sm">
                  View <i className="bi bi-eye"></i>
                </button>
              </td>
              <td>
                <button className="btn btn-outline-primary btn-sm">
                  Edit <i className="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan="4">No additional notes.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotesTable;
