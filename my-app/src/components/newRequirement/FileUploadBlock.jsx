'use client';
import React from 'react';
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
const FileUploadBlock = () => {
  return (
    <>
    <div className="p-4 bg-white rounded">
    
      <h5 className="fw-bold mb-4">Import file</h5>
      <div
        className="p-5 text-center mb-3 custom-upload-file"
      >
        <FaFileCirclePlus className='cus-upload-icon'/>
        <p className="mb-1 mt-3 fw-semibold text-black">Select a file to upload</p>
        <small className="text-muted fw-semibold">or drag and drop it here</small>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <small className="text-muted init-nav-co">Need help importing files?</small>
        <div>
          <button className="btn btn-cancel me-3 px-3">Cancel</button>
          <button className="btn btn-blue-clr px-3">Import</button>
        </div>
      </div>
</div>
<div className='p-4 bg-white rounded mt-4'>
      <div className="row g-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="col-sm-auto object-fit-contain">
              <img src="/assets/preview.png" alt="preview" width={100} height={100} />
          </div>
        ))}
        <div className="col-sm-auto">
          <div className="bg-light border d-flex align-items-center justify-content-center p-4">
           <FaPlusCircle className='cus-upload-icon-plus'/>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default FileUploadBlock;
