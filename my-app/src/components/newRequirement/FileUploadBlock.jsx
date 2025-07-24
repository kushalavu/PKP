'use client';
import React from 'react';
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
const FileUploadBlock = () => {
  return (
    <>
    <div className="row p-4 bg-white rounded">
    
      <h5 className="fw-bold mb-4">Import file</h5>
      <div
        className="col-sm-12 p-5 text-center mb-3 custom-upload-file"
      >
        <FaFileCirclePlus className='cus-upload-icon'/>
        <p className="mb-1 mt-3 fw-semibold text-black">Select a file to upload</p>
        <small className="text-muted fw-semibold">or drag and drop it here</small>
      </div>

      <div className="col-sm-12 mb-3 mt-4">
        <div className='row'>
        <div className="col-xl-9 col-md-7 col-6">
 <small className="text-muted init-nav-co">Need help importing files?</small>
        </div>
       
        <div className='col-auto gx-0'>
          <button className="btn btn-cancel me-3 px-3">Cancel</button>
        </div>
               
        <div className='col-auto gx-0'>
          <button className="btn btn-blue-clr px-3">Import</button>
        </div>
      </div>
      </div>
</div>
<div className='p-4 bg-white rounded mt-4'>
      <div className="row g-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="col-lg-auto col-3 me-3 object-fit-contain">
              <img src="/assets/preview.png" alt="preview" width={100} height={100} />
          </div>
        ))}
        <div className="col-lg-auto col-md-3 col-4">
          <div className="bg-light border d-flex align-items-center justify-content-center p-4 mt-lg-0 mt-2">
           <FaPlusCircle className='cus-upload-icon-plus'/>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default FileUploadBlock;
