'use client';
import React, { useState } from 'react';
import PreDayWorkersTable from './PreDayWorkersTable';

const PreDayWorkersForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        coreDrilling: '',
        coreVisual: '',
        magneticDrilling: '',
        magneticVisual: '',
        pip: '',
        sortingOut: '',
        platedVisual: '',
        poleTap: '',
        osm: '',
        newProcess: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted:', formData);
        // API call logic here
    };

    return (
        <div className="container-fluid form-complete-bg p-4">
                <h5 className="fw-bold mt-2">Pre Day Workers Allotted</h5>
                <p className="text-muted small init-nav-co">Please fill out the form to submit Pre Day Workers Allotted Details</p>
                <hr/>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label clr-label">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control frm-input-style" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">Core Drilling</label>
                            <input type="number" name="coreDrilling" value={formData.coreDrilling} onChange={handleChange} className="form-control frm-input-style"placeholder='Core drilling' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">Core Visual</label>
                            <input type="number" name="coreVisual" value={formData.coreVisual} onChange={handleChange} className="form-control frm-input-style" placeholder='Core visual'/>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label clr-label">Magnetic Core Drilling</label>
                            <input type="number" name="magneticDrilling" value={formData.magneticDrilling} onChange={handleChange} className="form-control frm-input-style" placeholder='Magnetic core drilling'/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">Magnetic Core Visual</label>
                            <input type="number" name="magneticVisual" value={formData.magneticVisual} onChange={handleChange} className="form-control frm-input-style"placeholder='Magnetic core visual' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">PIP</label>
                            <input type="number" name="pip" value={formData.pip} onChange={handleChange} className="form-control frm-input-style"placeholder='PIP' />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label clr-label">Sorting Out</label>
                            <input type="number" name="sortingOut" value={formData.sortingOut} onChange={handleChange} className="form-control frm-input-style"placeholder='Sorting out' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">Plated Visual</label>
                            <input type="number" name="platedVisual" value={formData.platedVisual} onChange={handleChange} className="form-control frm-input-style" placeholder='Plated visual'/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">Pole Tap</label>
                            <input type="number" name="poleTap" value={formData.poleTap} onChange={handleChange} className="form-control frm-input-style"placeholder='Pole tap' />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <label className="form-label clr-label">OSM</label>
                            <input type="text" name="osm" value={formData.osm} onChange={handleChange} className="form-control frm-input-style"placeholder='OMS' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label clr-label">Add New Process</label>
                            <input type="text" name="newProcess" value={formData.newProcess} onChange={handleChange} className="form-control frm-input-style"placeholder='Add new process' />
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button type="submit" className="btn btn-blue-clr px-4">Submit</button>
                        </div>
                    </div>
                </form>
            <div className="row">
                <div className="col-sm-12">
                    <PreDayWorkersTable />
                </div>
            </div>

        </div>
    );
};

export default PreDayWorkersForm;
