'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Dropdown, DropdownButton, Row, Col, Spinner, Pagination } from 'react-bootstrap';
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function NewRequirementTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterPartName, setFilterPartName] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');
  const [filterDrawing, setFilterDrawing] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  const [filterOptions, setFilterOptions] = useState({ parts: [], materials: [], drawings: [], industries: [] });

  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/new-requirement');
      if (res.data.success) setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
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
    fetchFilterOptions();
  }, []);

  // Apply filters on client-side (optional: can send to backend if needed)
  const filteredData = data.filter(item => {
    return (
      (!filterPartName || item.PartName === filterPartName) &&
      (!filterMaterial || item.RawMaterial === filterMaterial) &&
      (!filterDrawing || item.RawMaterialDrawing === filterDrawing) &&
      (!filterIndustry || item.RawMaterialCompany === filterIndustry)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handleClearFilters = () => {
    setFilterPartName('');
    setFilterMaterial('');
    setFilterDrawing('');
    setFilterIndustry('');
  };

  return (
    <>
      <h5 className="fw-bold mb-3">New Requirement List</h5>

      {/* Filters */}
      <Row className="g-2 mb-3 align-items-center">
        <Col xs="auto" >
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

      {/* Table */}
      <div className="table-responsive">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table bordered hover className="text-center">
            <thead className="table-primary">
              <tr>
                <th>Date</th>
                <th>Part Name</th>
                <th>Raw Material</th>
                <th>Raw Material Size</th>
                <th>Industry</th>
                <th>Drawing</th>
                <th>File Upload</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length ? (
                paginatedData.map(item => (
                  <tr key={item.Id}>
                    <td>{new Date(item.Date).toLocaleDateString()}</td>
                    <td>{item.PartName}</td>
                    <td>{item.RawMaterial}</td>
                    <td>{item.RawMaterialSize}</td>
                    <td>{item.RawMaterialCompany}</td>
                    <td>{item.RawMaterialDrawing}</td>
                    <td>{item.FileUpload ? <a href={item.FileUpload} target="_blank" rel="noopener noreferrer">View</a> : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No data found</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev disabled={activePage === 1} onClick={() => setActivePage(prev => prev - 1)} />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item key={idx + 1} active={activePage === idx + 1} onClick={() => setActivePage(idx + 1)}>
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={activePage === totalPages} onClick={() => setActivePage(prev => prev + 1)} />
        </Pagination>
      )}
      </>
  );
}
