'use client'
import { useState } from 'react';
import { Table, Form, Dropdown, DropdownButton, Pagination, Row, Col } from 'react-bootstrap';

export default function TestingUnitAdmin() {
  const [activePage, setActivePage] = useState(1);

  const pages = [1, 2, 3];

  return (
    <div className="container-fluid mt-4">
     <Row className="g-2 mb-4">
          <Col xxl={7} xs={12}>
              <h5 className="fw-bold mb-0">Testing Units(OSM)</h5>
          </Col>
        <Col xs="auto">
          <Form.Control type="date" className='frm-table-style' />
        </Col>
        <Col xs="auto">
            <Dropdown>
      <Dropdown.Toggle variant="outline-secondary">Part Name</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>Option 1</Dropdown.Item>
        <Dropdown.Item>Option 2</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
        </Col>
        <Col xs="auto">
          <DropdownButton variant="outline-secondary" title="Accepted/Rejected" className="w-100">
            <Dropdown.Item>Accepted</Dropdown.Item>
            <Dropdown.Item>Rejected</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs="auto">
          <DropdownButton variant="outline-secondary" title="Deleted" className="w-100">
            <Dropdown.Item>Yes</Dropdown.Item>
            <Dropdown.Item>No</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>


<hr className='mb-3 hr-sty-all'/>
      {/* Table */}
      <div className="table-responsive mt-4">
        <Table bordered hover className='customTable'>
       <thead>
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
    <tr>
      <td>2025-08-01</td>
      <td>Part A</td>
      <td>OSM123</td>
      <td>10</td>
      <td>2</td>
      <td>12</td>
    </tr>
  </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev disabled={activePage === 1} />
        {pages.map((p) => (
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
    </div>
  );
}
