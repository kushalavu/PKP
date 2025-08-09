'use client'
import { useState } from 'react';
import { Table, Form, Dropdown, DropdownButton, Pagination, Row, Col } from 'react-bootstrap';

export default function NewRequirementList() {
  const [activePage, setActivePage] = useState(1);

  const pages = [1, 2, 3];

  return (
    <div className="container-fluid mt-4">

      {/* Filters */}
      <Row className="g-2 mb-4">
          <Col xxl={7} xs={12}>
               <h5 className="fw-bold mb-3">New Requirement List</h5>
          </Col>
        <Col xs="auto">
          <Form.Control type="date" className='w-100 frm-table-style' />
        </Col>
        <Col xs="auto">
          <DropdownButton variant="outline-secondary" title="Part Name" className="w-100">
            <Dropdown.Item>Part A</Dropdown.Item>
            <Dropdown.Item>Part B</Dropdown.Item>
          </DropdownButton>
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
              <th>Raw Material</th>
              <th>Raw Material Size</th>
              <th>Raw Material Company</th>
              <th>Raw Material Drawing</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, idx) => (
              <tr key={idx} style={{height:'40px'}}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
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
