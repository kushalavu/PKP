'use client'
import { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Placeholder, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { IoMdCloseCircleOutline } from 'react-icons/io';

export default function MachineStoppageDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // rows per page

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/machine-stoppage', {
        params: {
          date: dateFilter || undefined,
          page,
          limit
        }
      });
      if (res.data.success) {
        setData(res.data.data || []);
        setTotalPages(res.data.pages || 1);
        setActivePage(page);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1); // reset to first page when filters change
  }, [dateFilter]);

  const renderSkeleton = () =>
    Array.from({ length: limit }).map((_, idx) => (
      <tr key={idx}>
        {Array.from({ length: 8 }).map((_, j) => (
          <td key={j}>
            <Placeholder as="span" animation="glow" className="light-placeholder">
              <Placeholder xs={8} />
            </Placeholder>
          </td>
        ))}
      </tr>
    ));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page);
    }
  };

  return (
    <>
      <Row className="g-2 mb-4">
        <Col xxl={8} xs={12}>
          <h5 className="fw-bold mb-3">Machine Stoppage Details</h5>
        </Col>

        <Col xs="auto">
          <Form.Control
            type="date"
            className="date-filed-admin"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </Col>

        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={() => {
              setDateFilter('');
              fetchData(1);
            }}
          >
            Clear <IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      <hr className="mb-3 hr-sty-all" />

      <div className="table-responsive mt-4">
        <Table bordered hover className="customTable text-center">
          <thead>
            <tr>
              <th>Date</th>
              <th>Machines Allotted</th>
              <th>Running</th>
              <th>Not Running</th>
              <th>Under Setting</th>
              <th>Maintenance</th>
              <th>Remarks</th>
              <th>New Process</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeleton()
            ) : data.length ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>{new Date(row.Date).toLocaleDateString()}</td>
                  <td>{row.MachinesAllotted}</td>
                  <td>{row.Running}</td>
                  <td>{row.NotRunning}</td>
                  <td>{row.UnderSetting}</td>
                  <td>{row.Maintenance}</td>
                  <td>{row.Remarks}</td>
                  <td>{row.NewProcess}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center mt-3 mb-5">
        <Pagination.Prev
          onClick={() => handlePageChange(activePage - 1)}
          disabled={activePage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === activePage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(activePage + 1)}
          disabled={activePage === totalPages}
        />
      </Pagination>
    </>
  );
}
