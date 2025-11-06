'use client';
import React, { useState, useEffect } from 'react';
import PrevDayProductionTable from './PrevDayProductionTable';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import Select from 'react-select';

const PrevDayProductionForm = () => {
  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    partName: '',
    machineNumber: '',
    capacity: '',
    shift1: '',
    shift2: '',
    totalNumbers: '',
    productionAchieved: '',
    inspectedQuantity: '',
    sortedOK: '',
    sortedRejected: '',
    totalSorted: '',
    forSorting: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
const [selectedPart, setSelectedPart] = useState(null); // new state

  const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
const dd = String(today.getDate()).padStart(2, '0');
const todayLocal = `${yyyy}-${mm}-${dd}`;

  // ✅ Fetch parts from API
  useEffect(() => {
    const fetchParts = async () => {
      try {
        setPartsLoading(true);
        const res = await axios.get('/api/parts');
        const data = res.data || [];
const options = data.map(p => ({
  value: `${p.part_name} - ${p.drawing_no || 'N/A'}`, // combine PartName and DrawingNo
  label: `${p.part_name} - ${p.drawing_no || 'N/A'}`, // what user sees
}));
setParts(options);

setParts(options);

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      'capacity', 'shift1', 'shift2', 'productionAchieved',
      'inspectedQuantity', 'sortedOK', 'sortedRejected', 'forSorting'
    ];
    const newValue = numericFields.includes(name) ? value.replace(/\D/g, '') : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };

      // Auto-calculate totals
      const shift1 = parseInt(updated.shift1 || 0);
      const shift2 = parseInt(updated.shift2 || 0);
      const totalNumbers = shift1 + shift2;
      updated.totalNumbers = totalNumbers;

      const sortedOK = parseInt(updated.sortedOK || 0);
      const sortedRejected = parseInt(updated.sortedRejected || 0);
      updated.totalSorted = sortedOK + sortedRejected;

      // Auto-calculate % Production Achieved if capacity > 0
    // Auto-calculate % Production Achieved if capacity > 0
const capacity = parseFloat(updated.capacity || 0);
updated.productionAchieved = capacity > 0
  ? ((totalNumbers / capacity) * 100).toFixed(2)
  : '';


      return updated;
    });

    setErrors(prev => ({ ...prev, [name]: '' }));
  };


const handlePartSelect = (option) => {
  setSelectedPart(option); // store full object
  setErrors(prev => ({ ...prev, partName: '' }));
};



  // ✅ Form validation
 const validateForm = () => {
  const tempErrors = {};
  const requiredFields = [
    'date', 'machineNumber', 'capacity', 'shift1', 'shift2',
    'productionAchieved', 'inspectedQuantity', 'sortedOK', 'sortedRejected', 'forSorting'
  ];

  // Check normal fields
  requiredFields.forEach(f => {
    if (!formData[f]) tempErrors[f] = 'This field is required';
  });

  // Check part select separately
  if (!selectedPart) {
    tempErrors.partName = 'This field is required';
  }

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};


  // ✅ Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const payload = {
    ...formData,
    partName: selectedPart ? `${selectedPart.value}` : '', // here we send "PartName - DrawingNo"
  };

  setLoading(true);
  try {
    await axios.post('/api/prev-day-production', payload);
    toast.success('Previous Day Production submitted successfully!');
    setFormData({
      date: '', machineNumber: '', capacity: '',
      shift1: '', shift2: '', totalNumbers: '', productionAchieved: '',
      inspectedQuantity: '', sortedOK: '', sortedRejected: '', totalSorted: '', forSorting: ''
    });
    setSelectedPart(null);
    setErrors({});
    setRefreshTable(prev => !prev);
  } catch (err) {
    console.error(err);
    toast.error('Submission failed! Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <h4 className="fw-bold">Previous Day Production</h4>
      <p className="text-muted small init-nav-co">Please fill out the form completely</p>
      <hr className="mb-3 hr-sty-all" />

      <Form onSubmit={handleSubmit}>
        <div className="row mb-3">

          {/* Date */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                max={todayLocal}
                className='frm-input-style'
                value={formData.date}
                onChange={handleChange}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Part Name */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Part Name</Form.Label>
<Select
  options={parts}
  isLoading={partsLoading}
  placeholder="Select Part"
  value={selectedPart} // use the object
  onChange={handlePartSelect}
  isClearable
  classNamePrefix="react-select"
/>


              {errors.partName && <div className="text-danger small mt-1">{errors.partName}</div>}
            </Form.Group>
          </div>

          {/* Machine Number */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Machine Number</Form.Label>
              <Form.Select
                name="machineNumber"
                className='frm-input-style'
                value={formData.machineNumber}
                onChange={handleChange}
                isInvalid={!!errors.machineNumber}
              >
                <option value="">-- Select Machine --</option>
                <option value="Machine 1">Machine 1</option>
                <option value="Machine 2">Machine 2</option>
                <option value="Machine 3">Machine 3</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.machineNumber}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Capacity */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Capacity</Form.Label>
              <Form.Control
                type="text"
                name="capacity"
                className='frm-input-style'
                placeholder="Enter capacity"
                value={formData.capacity}
                onChange={handleChange}
                isInvalid={!!errors.capacity}
              />
              <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* 1st Shift */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>1st Shift</Form.Label>
              <Form.Control
                type="text"
                name="shift1"
                className='frm-input-style'
                placeholder="1st Shift"
                value={formData.shift1}
                onChange={handleChange}
                isInvalid={!!errors.shift1}
              />
              <Form.Control.Feedback type="invalid">{errors.shift1}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* 2nd Shift */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>2nd Shift</Form.Label>
              <Form.Control
                type="text"
                name="shift2"
                className='frm-input-style'
                placeholder="2nd Shift"
                value={formData.shift2}
                onChange={handleChange}
                isInvalid={!!errors.shift2}
              />
              <Form.Control.Feedback type="invalid">{errors.shift2}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Total Numbers */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Total Production</Form.Label>
              <Form.Control type="text" name="totalNumbers" className='frm-input-style' value={formData.totalNumbers} disabled />
            </Form.Group>
          </div>

          {/* Production Achieved */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>% Production Achieved</Form.Label>
              <Form.Control
                type="text"
                className='frm-input-style'
                name="productionAchieved"
                placeholder="% Production Achieved"
                value={formData.productionAchieved}
                disabled
              />
              <Form.Control.Feedback type="invalid">{errors.productionAchieved}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Inspected Quantity */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Inspected Quantity</Form.Label>
              <Form.Control
                type="text"
                className='frm-input-style'
                name="inspectedQuantity"
                placeholder="Inspected Quantity"
                value={formData.inspectedQuantity}
                onChange={handleChange}
                isInvalid={!!errors.inspectedQuantity}
              />
              <Form.Control.Feedback type="invalid">{errors.inspectedQuantity}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* For Sorting */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>For Sorting</Form.Label>
              <Form.Control
                type="text"
                className='frm-input-style'
                name="forSorting"
                placeholder="For Sorting"
                value={formData.forSorting}
                onChange={handleChange}
                isInvalid={!!errors.forSorting}
              />
              <Form.Control.Feedback type="invalid">{errors.forSorting}</Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>

        <div className="row mb-5">
          <h4 className="fw-bold mt-5">Previous Day Quantity Result</h4>
          <hr className="mb-3 hr-sty-all" />

          {/* Sorted OK */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>OK</Form.Label>
              <Form.Control
                type="text"
                className='frm-input-style'
                name="sortedOK"
                placeholder="Sorted OK"
                value={formData.sortedOK}
                onChange={handleChange}
                isInvalid={!!errors.sortedOK}
              />
              <Form.Control.Feedback type="invalid">{errors.sortedOK}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Sorted Rejected */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Rejected</Form.Label>
              <Form.Control
                type="text"
                className='frm-input-style'
                name="sortedRejected"
                placeholder="Sorted Rejected"
                value={formData.sortedRejected}
                onChange={handleChange}
                isInvalid={!!errors.sortedRejected}
              />
              <Form.Control.Feedback type="invalid">{errors.sortedRejected}</Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Total Sorted */}
          <div className="col-4 mt-2">
            <Form.Group>
              <Form.Label className='clr-label'>Total</Form.Label>
              <Form.Control type="text" className='frm-input-style' name="totalSorted" value={formData.totalSorted} disabled />
            </Form.Group>
          </div>
        </div>

        <Button type="submit" className='btn btn btn-blue-clr px-4' disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>

      <div className="row mt-4">
        <div className="col-sm-12">
          <PrevDayProductionTable refresh={refreshTable} />
        </div>
      </div>
    </>
  );
};

export default PrevDayProductionForm;
