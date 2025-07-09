'use client';
import React, { useState } from 'react';
import PresentDayDispatchTable from './PresentDayDispatchTable';

const PresentDayDispatchForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        customer: '',
        partName: '',
        quantity: '',
        newProcess: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted:', formData);
        // API submission logic here
    };

    return (
        <div className="container-fluid form-complete-bg p-4">
            <h5 className="fw-bold mt-2">Present Day Dispatch</h5>
            <p className="text-muted small init-nav-co">
                Please fill out the form to submit <strong>Present Day Dispatch</strong> Details
            </p>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label clr-label">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control frm-input-style" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label clr-label">Customer</label>
                        <select name="customer" value={formData.customer} onChange={handleChange} className="form-select frm-input-style">
                            <option value="">Select a category</option>
                            <option value="Customer A">Customer A</option>
                            <option value="Customer B">Customer B</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label clr-label">Part Name</label>
                        <select name="partName" value={formData.partName} onChange={handleChange} className="form-select frm-input-style">
                            <option value="">Select a category</option>
                            <option value="Part X">Part X</option>
                            <option value="Part Y">Part Y</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-4">
                        <label className="form-label clr-label">Quantity</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control frm-input-style" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label clr-label">Add New Process</label>
                        <input type="text" name="newProcess" value={formData.newProcess} onChange={handleChange} className="form-control frm-input-style" placeholder="Add New Process" />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <button type="submit" className="btn btn-blue-clr px-4">Submit</button>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-sm-12">
                    <PresentDayDispatchTable />
                </div>
            </div>

        </div>
    );
};

export default PresentDayDispatchForm;
