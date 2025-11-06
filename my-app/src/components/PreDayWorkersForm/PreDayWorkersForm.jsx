'use client';
import React, { useState, useEffect } from 'react';
import PreDayWorkersTable from './PreDayWorkersTable';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PreDayWorkersForm = () => {
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [osmList, setOsmList] = useState([]);
    const [formData, setFormData] = useState({
        date: '',
        coreDrilling: '',
        coreVisual: '',
        magneticCoreDrilling: '',
        magneticCoreVisual: '',
        pip: '',
        sortingOut: '',
        platedVisual: '',
        poleTap: '',
        osm: '',
        newProcess: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
   const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
const dd = String(today.getDate()).padStart(2, '0');
const todayLocal = `${yyyy}-${mm}-${dd}`;
    // Fetch OSM list from API
    useEffect(() => {
        const fetchOSM = async () => {
            try {
                const response = await axios.get('/api/osm'); // replace with your API route
                setOsmList(response.data || []);
            } catch (err) {
                console.error('Error fetching OSM list:', err);
            }
        };
        fetchOSM();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.coreDrilling) newErrors.coreDrilling = 'Core Drilling is required';
        if (!formData.coreVisual) newErrors.coreVisual = 'Core Visual is required';
        if (!formData.magneticCoreDrilling) newErrors.magneticCoreDrilling = 'Magnetic Drilling is required';
        if (!formData.magneticCoreVisual) newErrors.magneticCoreVisual = 'Magnetic Visual is required';
        if (!formData.pip) newErrors.pip = 'PIP is required';
        if (!formData.sortingOut) newErrors.sortingOut = 'Sorting Out is required';
        if (!formData.platedVisual) newErrors.platedVisual = 'Plated Visual is required';
        if (!formData.poleTap) newErrors.poleTap = 'Pole Tap is required';
        if (!formData.osm) newErrors.osm = 'OSM is required';
        if (!formData.newProcess) newErrors.newProcess = 'New Process is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('/api/predayworkallotment', formData);
            toast.success('Pre Day Workers Allotted successfully!');
            setFormData({
                date: '',
                coreDrilling: '',
                coreVisual: '',
                magneticCoreDrilling: '',
                magneticCoreVisual: '',
                pip: '',
                sortingOut: '',
                platedVisual: '',
                poleTap: '',
                osm: '',
                newProcess: '',
            });
            setRefreshFlag(prev => !prev);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h5 className="fw-bold mt-2">Present Day Workers Allotted</h5>
            <p className="text-muted small init-nav-co">Please fill out the form to submit Pre Day Workers Allotted Details</p>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    {/* Date */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            max={todayLocal}
                            className={`form-control frm-input-style ${errors.date ? 'is-invalid' : ''}`}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                    </div>

                    {/* Core Drilling */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Core Drilling</label>
                        <input
                            type="number"
                            name="coreDrilling"
                            value={formData.coreDrilling}
                            onChange={handleChange}
                            placeholder='Enter Core Drilling'
                            className={`form-control frm-input-style ${errors.coreDrilling ? 'is-invalid' : ''}`}
                        />
                        {errors.coreDrilling && <div className="invalid-feedback">{errors.coreDrilling}</div>}
                    </div>

                    {/* Core Visual */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Core Visual</label>
                        <input
                            type="number"
                            name="coreVisual"
                            value={formData.coreVisual}
                            onChange={handleChange}
                            placeholder='Enter Core Visual'
                            className={`form-control frm-input-style ${errors.coreVisual ? 'is-invalid' : ''}`}
                        />
                        {errors.coreVisual && <div className="invalid-feedback">{errors.coreVisual}</div>}
                    </div>

                    {/* Magnetic Core Drilling */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Magnetic Core Drilling</label>
                        <input
                            type="number"
                            name="magneticCoreDrilling"
                            value={formData.magneticCoreDrilling}
                            onChange={handleChange}
                            placeholder='Enter Magnetic Core Drilling'
                            className={`form-control frm-input-style ${errors.magneticCoreDrilling ? 'is-invalid' : ''}`}
                        />
                        {errors.magneticCoreDrilling && <div className="invalid-feedback">{errors.magneticCoreDrilling}</div>}
                    </div>

                    {/* Magnetic Core Visual */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Magnetic Core Visual</label>
                        <input
                            type="number"
                            name="magneticCoreVisual"
                            value={formData.magneticCoreVisual}
                            onChange={handleChange}
                            placeholder='Enter Magnetic Core Visual'
                            className={`form-control frm-input-style ${errors.magneticCoreVisual ? 'is-invalid' : ''}`}
                        />
                        {errors.magneticCoreVisual && <div className="invalid-feedback">{errors.magneticCoreVisual}</div>}
                    </div>

                    {/* PIP */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">PIP</label>
                        <input
                            type="number"
                            name="pip"
                            value={formData.pip}
                            onChange={handleChange}
                            placeholder='Enter PIP'
                            className={`form-control frm-input-style ${errors.pip ? 'is-invalid' : ''}`}
                        />
                        {errors.pip && <div className="invalid-feedback">{errors.pip}</div>}
                    </div>

                    {/* Sorting Out */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Sorting Out</label>
                        <input
                            type="number"
                            name="sortingOut"
                            value={formData.sortingOut}
                            onChange={handleChange}
                            placeholder='Sorted out'
                            className={`form-control frm-input-style ${errors.sortingOut ? 'is-invalid' : ''}`}
                        />
                        {errors.sortingOut && <div className="invalid-feedback">{errors.sortingOut}</div>}
                    </div>

                    {/* Plated Visual */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Plated Visual</label>
                        <input
                            type="number"
                            name="platedVisual"
                            value={formData.platedVisual}
                            onChange={handleChange}
                            placeholder='Enter Plated visual'
                            className={`form-control frm-input-style ${errors.platedVisual ? 'is-invalid' : ''}`}
                        />
                        {errors.platedVisual && <div className="invalid-feedback">{errors.platedVisual}</div>}
                    </div>

                    {/* Pole Tap */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Pole Tap</label>
                        <input
                            type="number"
                            name="poleTap"
                            value={formData.poleTap}
                            onChange={handleChange}
                            placeholder='Enter Pole tap'
                            className={`form-control frm-input-style ${errors.poleTap ? 'is-invalid' : ''}`}
                        />
                        {errors.poleTap && <div className="invalid-feedback">{errors.poleTap}</div>}
                    </div>

                    {/* OSM Dropdown */}
                   {/* OSM Dropdown */}
<div className="col-md-4 mt-2">
    <label className="form-label clr-label">OSM</label>
    <select
        name="osm"
        value={formData.osm}
        onChange={handleChange}
        className={`form-control frm-input-style ${errors.osm ? 'is-invalid' : ''}`}
    >
        <option value="">Select OSM</option>
        {osmList.map((osm) => (
            <option key={osm.id || osm.osm_number} value={osm.osm_number}>
                {osm.osm_number}
            </option>
        ))}
    </select>
    {errors.osm && <div className="invalid-feedback">{errors.osm}</div>}
</div>


                    {/* New Process */}
                    <div className="col-md-4 mt-2">
                        <label className="form-label clr-label">Add New Process</label>
                        <input
                            type="text"
                            name="newProcess"
                            value={formData.newProcess}
                            onChange={handleChange}
                            className={`form-control frm-input-style ${errors.newProcess ? 'is-invalid' : ''}`}
                        />
                        {errors.newProcess && <div className="invalid-feedback">{errors.newProcess}</div>}
                    </div>
                </div>

                <div className="col-md-4 d-flex align-items-end mt-2">
                    <button type="submit" className="btn btn-blue-clr px-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>

            <div className="row">
                <div className="col-sm-12">
                    <PreDayWorkersTable refreshFlag={refreshFlag} />
                </div>
            </div>
        </>
    );
};

export default PreDayWorkersForm;
