'use client'
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const PresentdayDispatch = () => {
  const [activePage, setActivePage] = useState(1);
  const pages = [1, 2, 3];

  return (
    <div className="container-fluid mt-4">
      <Row className="g-2 mb-4">
        <Col xxl={7} xs={12}>
          <h5 className="fw-bold mb-3">Present Day Dispatch</h5>
        </Col>
        <Col xs="auto">
          <Form.Control type="date" className='frm-table-style' />
        </Col>
        <Col xs="auto">
          <DropdownButton variant="outline-secondary" title="Part Name">
            <Dropdown.Item>Part A</Dropdown.Item>
            <Dropdown.Item>Part B</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs="auto">
          <DropdownButton variant="outline-secondary" title="Accepted/Rejected">
            <Dropdown.Item>Accepted</Dropdown.Item>
            <Dropdown.Item>Rejected</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col xs="auto">
          <DropdownButton variant="outline-secondary" title="Deleted">
            <Dropdown.Item>Yes</Dropdown.Item>
            <Dropdown.Item>No</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      <hr className='mb-3 hr-sty-all' />

      <div className="table-responsive mt-4">
        <Table bordered hover className='customTable'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Part Name</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, idx) => (
              <tr key={idx} style={{ height: '40px' }}>
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
  )
}
export default PresentdayDispatch;
