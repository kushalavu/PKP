'use client'
import { useState, useEffect } from 'react';
import { Table, Form, Dropdown, Button, Pagination, Row, Col, Placeholder } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';

export default function PreDayworkAllotment() {
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [dateFilter, setDateFilter] = useState('');
  const [partFilter, setPartFilter] = useState('');
  const [partOptions, setPartOptions] = useState([]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/predayworkallotment`, {
        params: { page, date: dateFilter || undefined, partName: partFilter || undefined }
      });
      setData(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setPartOptions(res.data.partOptions || []);
    } catch (err) {
      console.error(err);
      setData([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(activePage);
  }, [dateFilter, partFilter, activePage]);

  const handleClearFilters = () => {
    setDateFilter('');
    setPartFilter('');
  };

  const renderSkeleton = () => {
  return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 10 }).map((_, j) => (
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
      <Row className="g-2 mb-4">
        <Col xxl={8} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Present Day Workers Allotted</h5>
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
            Clear<IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      <hr className='mb-3 hr-sty-all'/>

      <div className="table-responsive mt-4">
        <Table bordered hover className='customTable text-center'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Core Drilling</th>
              <th>Core Visual</th>
              <th>Magnetic Core Drilling</th>
              <th>Magnetic Core Visual</th>
              <th>PIP</th>
              <th>Sorting Out</th>
              <th>Plated Visual</th>
              <th>Pole Tap</th>
              <th>OSM</th>
            </tr>
          </thead>
          <tbody>
            {loading ? renderSkeleton() : (
              data.length > 0 ? data.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.date).toLocaleDateString()}</td>
                  <td>{row.coreDrilling}</td>
                  <td>{row.coreVisual}</td>
                  <td>{row.magneticCoreDrilling}</td>
                  <td>{row.magneticCoreVisual}</td>
                  <td>{row.pip}</td>
                  <td>{row.sortingOut}</td>
                  <td>{row.platedVisual}</td>
                  <td>{row.poleTap}</td>
                  <td>{row.osm}</td>
                </tr>
              )) : (
                <tr><td colSpan={10} className="text-center">No records found</td></tr>
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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <Pagination.Item key={p} active={p === activePage} onClick={() => setActivePage(p)}>
            {p}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          disabled={activePage === totalPages} 
          onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))}
        />
      </Pagination>
    </>
  );
}
