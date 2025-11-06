'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Dropdown, DropdownButton, Row, Col, Placeholder, Pagination, Form, Spinner } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function NewRequirementTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterPartName, setFilterPartName] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');
  const [filterDrawing, setFilterDrawing] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  const [filterOptions, setFilterOptions] = useState({
    parts: [],
    materials: [],
    drawings: [],
    industries: []
  });

  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch table data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        date: filterDate || undefined,
        part: filterPartName || undefined,
        material: filterMaterial || undefined,
        drawing: filterDrawing || undefined,
        industry: filterIndustry || undefined,
        page: activePage,
        limit: itemsPerPage
      };

      const res = await axios.get('/api/new-requirement', { params });
      if (res.data.success) {
        setData(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter dropdown options
  const fetchFilterOptions = async () => {
    try {
      const res = await axios.get('/api/new-requirement-filter');
      if (res.data.success) setFilterOptions(res.data.filters);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDate, filterPartName, filterMaterial, filterDrawing, filterIndustry, activePage]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterPartName('');
    setFilterMaterial('');
    setFilterDrawing('');
    setFilterIndustry('');
  };

  const renderSkeleton = () =>
    Array.from({ length: 10 }).map((_, idx) => (
      <tr key={idx}>
        {Array.from({ length: 8 }).map((_, j) => (
          <td key={j}>
            <Placeholder as="span" animation="glow" className="light-placeholder">
              <Placeholder xs={8}/>
            </Placeholder>
          </td>
        ))}
      </tr>
    ));

  return (
    <>
      {/* Filters */}
      <Row className="g-2 mb-4 align-items-center">
        <Col xxl={6} xl={12} xs={12}>
          <h5 className="fw-bold mb-3">New Requirement List</h5>
        </Col>

        <Col xs="auto">
          <Form.Control
            type="date"
            value={filterDate}
            className='date-filed-admin'
            onChange={(e) => {
              setFilterDate(e.target.value);
              setActivePage(1);
            }}
          />
        </Col>

        <Col xs="auto">
          <DropdownButton title={filterPartName || "Part Name"} variant="outline-secondary">
            <Dropdown.Item onClick={() => setFilterPartName('')}>All</Dropdown.Item>
            {filterOptions.parts.map((p, idx) => (
              <Dropdown.Item key={idx} onClick={() => setFilterPartName(p)}>{p}</Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>

        <Col xs="auto">
          <DropdownButton title={filterMaterial || "Material"} variant="outline-secondary">
            <Dropdown.Item onClick={() => setFilterMaterial('')}>All</Dropdown.Item>
            {filterOptions.materials.map((m, idx) => (
              <Dropdown.Item key={idx} onClick={() => setFilterMaterial(m)}>{m}</Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>

        <Col xs="auto">
          <DropdownButton title={filterDrawing || "Drawing"} variant="outline-secondary">
            <Dropdown.Item onClick={() => setFilterDrawing('')}>All</Dropdown.Item>
            {filterOptions.drawings.map((d, idx) => (
              <Dropdown.Item key={idx} onClick={() => setFilterDrawing(d)}>{d}</Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>

        <Col xs="auto">
          <DropdownButton title={filterIndustry || "Industry"} variant="outline-secondary">
            <Dropdown.Item onClick={() => setFilterIndustry('')}>All</Dropdown.Item>
            {filterOptions.industries.map((i, idx) => (
              <Dropdown.Item key={idx} onClick={() => setFilterIndustry(i)}>{i}</Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>

        <Col xs="auto">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear <IoMdCloseCircleOutline />
          </Button>
        </Col>
      </Row>

      <hr className="mb-3 hr-sty-all" />

      {/* Table */}
      <div className="table-responsive mt-4">
        <Table bordered hover className="text-center customTable">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Part Name</th>
               <th>Drawing No.</th>
              <th>Raw Material</th>
              <th>Raw Material Size</th>
              <th>Industry</th>
              <th>File Upload</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeleton()
            ) : data.length ? (
              data.map(item => (
                <tr key={item.Id}>
                  <td>{item.Date ? new Date(item.Date).toLocaleDateString() : '-'}</td>
                  <td>{item.Customer} - {item.CustomerLocation}</td>
                  <td>{item.PartName || '-'}</td>
                   <td>{item.RawMaterialDrawing || '-'}</td>
                  <td>{item.RawMaterial || '-'}</td>
                  <td>{item.RawMaterialSize || '-'}</td>
                  <td>{item.RawMaterialCompany || '-'}</td>
                  <td>
                    {item.FileUpload ? (
                      <a
                        href={item.FileUpload}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary px-3 py-1 rounded-pill"
                      >
                        View File
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No data found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3 mb-5">
          <Pagination.Prev
            disabled={activePage === 1}
            onClick={() => setActivePage(prev => prev - 1)}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={activePage === idx + 1}
              onClick={() => setActivePage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={activePage === totalPages}
            onClick={() => setActivePage(prev => prev + 1)}
          />
        </Pagination>
      )}
    </>
  );
}
