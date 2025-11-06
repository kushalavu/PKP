'use client'
import { useState, useEffect } from 'react';
import { Table, Form, Button, Pagination, Row, Col, Placeholder } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';

export default function Notes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notes', {
        params: {
          date: dateFilter || undefined,
          page,
          limit
        }
      });
      if (res.data.success) {
        setData(res.data.data);
        setTotalPages(res.data.pages);
        setActivePage(page);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setData([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, [dateFilter]);

  const renderSkeleton = () =>
    Array.from({ length: limit }).map((_, idx) => (
      <tr key={idx}>
        {Array.from({ length: 3 }).map((_, j) => (
          <td key={j}>
            <Placeholder as="span" animation="glow" className="light-placeholder">
              <Placeholder xs={4} />
            </Placeholder>
          </td>
        ))}
      </tr>
    ));

  return (
    <>
      <Row className="g-2 mb-4">
        <Col xxl={9} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">Notes</h5>
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
          <Button
            variant="secondary"
            onClick={() => setDateFilter('')}
          >
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
              <th>Subject</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? renderSkeleton() : (
              data.length ? data.map((row, idx) => (
                <tr key={idx}>
                  <td>{new Date(row.Date).toLocaleDateString()}</td>
                  <td>{row.ForPlating || '--'}</td>
                  <td>{row.Note}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="text-center">No records found</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center mb-5">
        <Pagination.Prev
          disabled={activePage === 1}
          onClick={() => fetchData(activePage - 1)}
        />
        {Array.from({ length: totalPages }).map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === activePage}
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
