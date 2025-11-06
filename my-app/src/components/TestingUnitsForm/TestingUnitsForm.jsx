'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import TestingUnitsTable from './TestingUnitsTable';

const TestingUnitsForm = () => {
  const [osmOptions, setOsmOptions] = useState([]);
  const [osmLoading, setOsmLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    osmNumber: '',
    accepted: '',
    rejected: '',
    total: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const tableRef = useRef();
 const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
const dd = String(today.getDate()).padStart(2, '0');
const todayLocal = `${yyyy}-${mm}-${dd}`;
  useEffect(() => {
    const fetchOsm = async () => {
      try {
        setOsmLoading(true);
        const res = await axios.get('/api/osm');
        const osmData = res.data || [];
        const options = osmData.map(o => ({
          value: o.osm_number,
          label: `${o.osm_number}${o.description ? ` - ${o.description}` : ''}`,
        }));
        setOsmOptions(options);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load OSM numbers');
      } finally {
        setOsmLoading(false);
      }
    };
    fetchOsm();
  }, []);
  // Fetch parts
  useEffect(() => {
    const fetchParts = async () => {
      try {
        setPartsLoading(true);
        const res = await axios.get('/api/parts');
        const partsData = res.data || [];
        const options = partsData.map(p => ({
          value: `${p.part_name} - ${p.drawing_no || 'N/A'}`, // combined value
          label: `${p.part_name} - ${p.drawing_no || 'N/A'}`,
          partName: p.part_name,
          drawingNo: p.drawing_no,
        }));
        setParts(options);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load parts');
      } finally {
        setPartsLoading(false);
      }
    };
    fetchParts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'accepted' || name === 'rejected') {
        updated.total = (parseInt(updated.accepted || 0) + parseInt(updated.rejected || 0));
      }
      return updated;
    });
  };

  const handlePartSelect = (selected) => {
    setFormData(prev => ({
      ...prev,
      partName: selected ? selected.value : '', // combined "part - drawing"
    }));
    setErrors(prev => ({ ...prev, partName: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.partName) newErrors.partName = 'Part name is required';
    if (!formData.osmNumber) newErrors.osmNumber = 'OSM number is required';
    if (!formData.accepted) newErrors.accepted = 'Accepted count is required';
    if (!formData.rejected) newErrors.rejected = 'Rejected count is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('/api/testing-units', formData);
      toast.success('Testing Unit submitted successfully');
      setFormData({
        date: '',
        partName: '',
        osmNumber: '',
        accepted: '',
        rejected: '',
        total: '',
      });
      if (tableRef.current) tableRef.current.fetchUnits();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-sm-12 mt-3">
        <h4 className="fw-bold">Testing Unit (OSM)</h4>
        <p className="text-muted small">Please fill out the form below.</p>
        <hr className="mb-3 hr-sty-all" />

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="clr-label">Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={todayLocal}
                  isInvalid={!!errors.date}
                  className="frm-input-style"
                />
                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="clr-label">Part Name</Form.Label>
                <Select
                  options={parts}
                  isLoading={partsLoading}
                  placeholder="Select Part"
                  value={formData.partName ? parts.find(p => p.value === formData.partName) : null}
                  onChange={handlePartSelect}
                  isClearable
                  classNamePrefix="react-select"
                />
                {errors.partName && <div className="text-danger small mt-1">{errors.partName}</div>}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="clr-label">OSM Number</Form.Label>
                <Select
                  options={osmOptions}
                  isLoading={osmLoading}
                  placeholder="Select OSM Number"
                  value={formData.osmNumber ? osmOptions.find(o => o.value === formData.osmNumber) : null}
                  onChange={selected => setFormData(prev => ({ ...prev, osmNumber: selected ? selected.value : '' }))}
                  isClearable
                  classNamePrefix="react-select"
                />
                {errors.osmNumber && <div className="text-danger small mt-1">{errors.osmNumber}</div>}
              </Form.Group>
            </Col>


            <Col md={4}>
              <Form.Group>
                <Form.Label className="clr-label">Accepted</Form.Label>
                <Form.Control
                  type="number"
                  name="accepted"
                  value={formData.accepted}
                  onChange={handleNumberChange}
                  isInvalid={!!errors.accepted}
                  placeholder="Accepted count"
                  className="frm-input-style"
                />
                <Form.Control.Feedback type="invalid">{errors.accepted}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="clr-label">Rejected</Form.Label>
                <Form.Control
                  type="number"
                  name="rejected"
                  value={formData.rejected}
                  onChange={handleNumberChange}
                  isInvalid={!!errors.rejected}
                  placeholder="Rejected count"
                  className="frm-input-style"
                />
                <Form.Control.Feedback type="invalid">{errors.rejected}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="clr-label">Total</Form.Label>
                <Form.Control
                  type="number"
                  name="total"
                  value={formData.total}
                  disabled
                  className="frm-input-style"
                />
              </Form.Group>
            </Col>

            <Col xs={12} className="mt-4">
              <Button type="submit" disabled={loading} className="btn btn-blue-clr px-4">
                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="col-sm-12 mt-4">
        <TestingUnitsTable ref={tableRef} />
      </div>
    </>
  );
};

export default TestingUnitsForm;
