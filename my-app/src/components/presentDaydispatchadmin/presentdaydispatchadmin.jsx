'use client';
import { useState, useEffect } from 'react';
import { Table, Form, Dropdown, Row, Col, Placeholder, Button, Pagination } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';

const PresentdayDispatch = () => {
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [dispatchData, setDispatchData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [partFilter, setPartFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  // Dropdown options
  const [partOptions, setPartOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  const [pages, setPages] = useState([1]);

  useEffect(() => {
    const fetchDispatchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/present-day-dispatch', {
          params: {
            date: dateFilter || undefined,
            partName: partFilter || undefined,
            customer: customerFilter || undefined,
            page: activePage,
            limit: rowsPerPage
          }
        });

        if (data.success) {
          setDispatchData(data.data || []);
          console.log(data.data)
          setPartOptions(data.partOptions || []);
          setCustomerOptions(data.customerOptions || []);
        } else {
          setDispatchData([]);
        }

        setPages([1]); // Static since pagination not implemented from backend
      } catch (err) {
        console.error("Fetch error:", err);
        setDispatchData([]);
      }
      setLoading(false);
    };

    fetchDispatchData();
  }, [dateFilter, partFilter, customerFilter, activePage]);

  const handleClearFilters = () => {
    setDateFilter('');
    setPartFilter('');
    setCustomerFilter('');
  };

  const renderSkeleton = () => {
    return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 5 }).map((_, j) => (
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
        <Col xxl={7} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Present Day Dispatch</h5>
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
                <Dropdown.Item key={p} onClick={() => setPartFilter(p)}>
                  {p}
                </Dropdown.Item>
              ))}
              <Dropdown.Item onClick={() => setPartFilter('')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs="auto">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              {customerFilter || "Customer"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {customerOptions.map(c => (
                <Dropdown.Item key={c} onClick={() => setCustomerFilter(c)}>
                  {c}
                </Dropdown.Item>
              ))}
              <Dropdown.Item onClick={() => setCustomerFilter('')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear<IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      <hr className='mb-3 hr-sty-all' />

      <div className="table-responsive mt-4">
        <Table bordered hover className='customTable text-center'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Part Name</th>
              <th>Quantity</th>
              <th>New Process</th>
            </tr>
          </thead>
          <tbody>
            {loading ? renderSkeleton() :
              dispatchData.length > 0 ? dispatchData.map((d, i) => (
                <tr key={i}>
                   <td>{new Date(d.date).toLocaleDateString()}</td>
                  <td>{d.customer}</td>
                  <td>{d.partName}</td>
                  <td>{d.quantity}</td>
                  <td>{d.newProcess}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center">No records found</td></tr>
              )
            }
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center mb-5">
        <Pagination.Prev disabled={activePage === 1} />
        {pages.map(p => (
          <Pagination.Item
            key={p}
            active={p === activePage}
            onClick={() => setActivePage(p)}
          >
            {p}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={activePage === pages.length} />
      </Pagination>
    </>
  );
};

export default PresentdayDispatch;
