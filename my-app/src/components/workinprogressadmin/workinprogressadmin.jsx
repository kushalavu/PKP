'use client'
import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Pagination, Placeholder } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';

export default function WorkInProgressAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/workinprogress?page=${page}&date=${selectedDate}`);
      setData(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setActivePage(page);
    } catch (err) {
      console.error('Fetch error:', err);
      setData([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleClearFilters = () => {
    setSelectedDate('');
  };

  const renderSkeleton = () => {
    return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 13 }).map((_, j) => (
          <td key={j}>
            <Placeholder as="span" animation="glow" className="light-placeholder">
              <Placeholder xs={8} />
            </Placeholder>
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      {/* Filters */}
      <Row className="g-2 mb-4">
        <Col xxl={9} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Work In Progress</h5>
        </Col>
        <Col xs="auto">
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-filed-admin"
          />
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear<IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      <hr className="mb-3 hr-sty-all" />

      {/* Table */}
      <div className="table-responsive">
        <Table bordered hover className="customTable text-center">
          <thead>
            <tr>
              <th>Date</th>
              <th>Part Name</th>
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
            </tr>
          </thead>
          <tbody>
            {loading
              ? renderSkeleton()
              : data.length > 0
              ? data.map((row) => (
                  <tr key={row.id}>
                    <td>{new Date(row.date).toLocaleDateString()}</td>
                    <td>{row.partName}</td>
                    <td>{row.packed}</td>
                    <td>{row.forPacking}</td>
                    <td>{row.underPacking}</td>
                    <td>{row.forPlating}</td>
                    <td>{row.underHeatTreatment}</td>
                    <td>{row.underPTFE}</td>
                    <td>{row.forPTFE}</td>
                    <td>{row.forHeatTreatment}</td>
                    <td>{row.sortedOK}</td>
                    <td>{row.sortedRejected}</td>
                    <td>{row.totalSorted}</td>
                  </tr>
                ))
              : (
                  <tr>
                    <td colSpan={13} className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center mb-5">
        <Pagination.Prev
          disabled={activePage === 1}
          onClick={() => fetchData(activePage - 1)}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={activePage === i + 1}
            onClick={() => fetchData(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={activePage === totalPages}
          onClick={() => fetchData(activePage + 1)}
        />
      </Pagination>
    </>
  );
}
