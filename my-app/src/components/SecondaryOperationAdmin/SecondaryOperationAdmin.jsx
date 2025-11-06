'use client';
import { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Placeholder, Button, Pagination } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';

export default function SecondaryOperationAdmin() {
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [dateFilter, setDateFilter] = useState('');

  const [pages, setPages] = useState([1]);

  // Fetch data
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/secondary-operation', {
          params: {
            date: dateFilter || undefined,
            page: activePage,
            limit: rowsPerPage
          }
        });

        setUnits(data.data || []);
        setPages(Array.from({ length: data.totalPages || 1 }, (_, i) => i + 1));
      } catch (err) {
        console.error("Units fetch error:", err);
        setUnits([]);
        setPages([1]);
      }
      setLoading(false);
    };

    fetchUnits();
  }, [dateFilter, activePage, rowsPerPage]);

  const handleClearFilters = () => {
    setDateFilter('');
  };

  // Skeleton rows
  const renderSkeleton = () => {
    return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 7 }).map((_, j) => (
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
        <Col xxl={8} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Secondary Operation Details</h5>
        </Col>
        <Col xs="auto">
          <Form.Control 
            type="date" 
            className='date-filed-admin' 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear <IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      <hr className='mb-3 hr-sty-all'/>

      {/* Table */}
      <div className="table-responsive mt-4">
        <Table bordered hover className='customTable text-center'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Core CSK Done (Qty)</th>
              <th>Core Visual Done (Qty)</th>
              <th>Magnetic Drill (Qty)</th>
              <th>Magnetic Visual (Qty)</th>
              <th>Pivot Pin</th>
            </tr>
          </thead>
          <tbody>
            {loading ? renderSkeleton() : (
              units.length > 0 ? units.map((u, i) => (
                <tr key={i}>
                  <td>{new Date(u.Date).toLocaleDateString()}</td>
                  <td>{u.CoreCSKDone}</td>
                  <td>{u.CoreVisualDone}</td>
                  <td>{u.MagneticDrill}</td>
                  <td>{u.MagneticVisual}</td>
                  <td>{u.PivotPin}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center">No records found</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center mb-5">
        <Pagination.Prev 
          disabled={activePage === 1} 
          onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
        />
        {pages.map(p => (
          <Pagination.Item
            key={p}
            active={p === activePage}
            onClick={() => setActivePage(p)}
          >
            {p}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          disabled={activePage === pages.length} 
          onClick={() => setActivePage(prev => Math.min(prev + 1, pages.length))}
        />
      </Pagination>
    </>
  );
}
