'use client'
import { useState, useEffect } from 'react';
import { Table, Form, Dropdown, Row, Col, Placeholder, Button, Pagination, DropdownButton } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';

export default function PrevDayProductionAdmin() {
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [partFilter, setPartFilter] = useState('');
  const [machineFilter, setMachineFilter] = useState('');

  // Dropdown options
  const [partOptions, setPartOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);

  const [pages, setPages] = useState([1]);

  const handleClearFilters = () => {
    setDateFilter('');
    setPartFilter('');
    setMachineFilter('');
    setActivePage(1);
  };

  // Fetch table data
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/prev-day-production', {
          params: {
            date: dateFilter || undefined,
            partName: partFilter || undefined,
            osmNumber: machineFilter || undefined,
            page: activePage,
            limit: rowsPerPage
          }
        });

        if (data.success) {
          setUnits(data.data.items || data.data || []);
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
  }, [dateFilter, partFilter, machineFilter, activePage, rowsPerPage]);

  // Update dropdown options dynamically
  useEffect(() => {
    if (units.length > 0) {
      const uniqueParts = [...new Set(units.map(u => u.PartName))];
      const uniqueMachines = [...new Set(units.map(u => u.MachineNumber))];
      setPartOptions(uniqueParts);
      setMachineOptions(uniqueMachines);
    }
  }, [units]);

  const renderSkeleton = () => {
    return Array.from({ length: rowsPerPage }).map((_, idx) => (
      <tr key={idx}>
        {Array.from({ length: 14 }).map((_, i) => (
          <td key={i}>
            <Placeholder as="span" animation="glow" className="light-placeholder">
              <Placeholder xs={8} bg="light"/>
            </Placeholder>
          </td>
        ))}
      </tr>
    ));
  };

  return (
  <>
      {/* Filters */}
      <Row className="g-2 mb-4 align-items-center">
        <Col xxl={7} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Prev Day Production</h5>
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
              {machineFilter || "Machine Number"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {machineOptions.map(m => (
                <Dropdown.Item key={m} onClick={() => setMachineFilter(m)}>
                  {m}
                </Dropdown.Item>
              ))}
              <Dropdown.Item onClick={() => setMachineFilter('')}>All</Dropdown.Item>
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

      {/* Table */}
      <div className="table-responsive mt-4">
        <Table bordered hover className='customTable text-center'>
          <thead>
            <tr>
             <th>Date</th>
              <th>Part Name</th>
              <th>Machine Number</th>
              <th>Capacity</th>
              <th>1st Shift</th>
              <th>2nd Shift</th>
              <th>Total Production</th>
              <th>% Production Achieved</th>
              <th>Inspected Quantity</th>
              <th>For Sorting</th>
              <th>OK</th>
              <th>Rejected</th>
              <th>Total Sorted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? renderSkeleton() : (
              units.length > 0 ? units.map((u, idx) => (
            <tr key={idx}>
      <td>{new Date(u.Date).toLocaleDateString()}</td>
          <td>{u.PartName}</td>
          <td>{u.MachineNumber}</td>
          <td>{u.Capacity}</td>
          <td>{u.Shift1}</td>
          <td>{u.Shift2}</td>
          <td>{u.TotalNumbers}</td>
          <td>{u.ProductionAchieved}</td>
          <td>{u.InspectedQuantity}</td>
          <td>{u.ForSorting}</td>
          <td>{u.SortedOK}</td>
          <td>{u.SortedRejected}</td>
          <td>{u.TotalSorted}</td>
</tr>

              )) : (
                <tr>
                  <td colSpan={9} className="text-center">No records found</td>
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
