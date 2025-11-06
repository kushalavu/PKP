'use client'
import { useState, useEffect } from 'react';
import { Table, Form, Dropdown, Row, Col, Placeholder, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const TestingUnitAdmin = () => {
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [dateFilter, setDateFilter] = useState('');
  const [partFilter, setPartFilter] = useState('');
  const [osmFilter, setOsmFilter] = useState('');

  // Dropdown options (derived from fetched rows)
  const [partOptions, setPartOptions] = useState([]);
  const [osmOptions, setOsmOptions] = useState([]);

  const [pages, setPages] = useState([1]);

  // Clear filters function
  const handleClearFilters = () => {
    setDateFilter('');
    setPartFilter('');
    setOsmFilter('');
    setActivePage(1);
  };

  // Fetch table data
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/testing-units', {
          params: {
            date: dateFilter || undefined,
            partName: partFilter || undefined,
            osmNumber: osmFilter || undefined,
            page: activePage,
            limit: rowsPerPage
          }
        });

        if (data.success) {
          setUnits(data.data.items || []);
          setPages(Array.from({ length: data.data.totalPages || 1 }, (_, i) => i + 1));
        }
      } catch (err) {
        console.error("Units fetch error:", err);
        setUnits([]);
        setPages([1]);
      }
      setLoading(false);
    };

    fetchUnits();
  }, [dateFilter, partFilter, osmFilter, activePage, rowsPerPage]);

  // Update dropdown options dynamically from fetched rows
  useEffect(() => {
    if (units.length > 0) {
      const uniqueParts = [...new Set(units.map(u => u.PartName))];
      const uniqueOSMs = [...new Set(units.map(u => u.OSMNumber))];
      setPartOptions(uniqueParts);
      setOsmOptions(uniqueOSMs);
    }
  }, [units]);

  // Skeleton rows
  const renderSkeleton = () => {
    return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i}>
        <td><Placeholder as="span" animation="glow" className="light-placeholder"><Placeholder xs={8} /></Placeholder></td>
        <td><Placeholder as="span" animation="glow" className="light-placeholder"><Placeholder xs={6} /></Placeholder></td>
        <td><Placeholder as="span" animation="glow" className="light-placeholder"><Placeholder xs={6} /></Placeholder></td>
        <td><Placeholder as="span" animation="glow" className="light-placeholder"><Placeholder xs={4} /></Placeholder></td>
        <td><Placeholder as="span" animation="glow" className="light-placeholder"><Placeholder xs={4} /></Placeholder></td>
        <td><Placeholder as="span" animation="glow" className="light-placeholder"><Placeholder xs={4} /></Placeholder></td>
      </tr>
    ));
  };

  return (
 <>
      <Row className="g-2 mb-4 align-items-center">
        <Col xxl={7} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Testing Units (OSM)</h5>
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
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              {partFilter || "Part Name"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {partOptions.map(p => (
                <Dropdown.Item key={p} onClick={() => setPartFilter(p)}>{p}</Dropdown.Item>
              ))}
              <Dropdown.Item onClick={() => setPartFilter('')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xs="auto">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              {osmFilter || "OSM Number"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {osmOptions.map(o => (
                <Dropdown.Item key={o} onClick={() => setOsmFilter(o)}>{o}</Dropdown.Item>
              ))}
              <Dropdown.Item onClick={() => setOsmFilter('')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xs="auto">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear<IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>
<hr className='mb-3 hr-sty-all'/>
      <div className="table-responsive mt-4">
        <Table bordered hover className='text-center customTable'>
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Part Name</th>
              <th>OSM Number</th>
              <th>Accepted</th>
              <th>Rejected</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? renderSkeleton() : (
              units.length > 0 ? units.map((u, i) => (
                <tr key={i}>
                  <td>{new Date(u.Date).toLocaleDateString()}</td>
                  <td>{u.PartName}</td>
                  <td>{u.OSMNumber}</td>
                  <td>{u.Accepted}</td>
                  <td>{u.Rejected}</td>
                  <td>{u.Accepted + u.Rejected}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center">No records found</td></tr>
              )
            )}
          </tbody>
        </Table>
      </div>

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

export default TestingUnitAdmin;
