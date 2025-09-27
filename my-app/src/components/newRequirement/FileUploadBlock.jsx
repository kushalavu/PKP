'use client';
import React from 'react';
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";


const FileUploadBlock = ({ file, setFile, setFileBase64 }) => {

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
    }
  };

  return (
    <>
      <div className="row p-4 bg-white rounded">
        <h5 className="fw-bold mb-4">Import file</h5>
        <div className="col-sm-12 p-5 text-center mb-3 custom-upload-file position-relative">
          <FaFileCirclePlus className='cus-upload-icon' />
          <p className="mb-1 mt-3 fw-semibold text-black">Select a file to upload</p>
          <small className="text-muted fw-semibold">or drag and drop it here</small>
          <input
            type="file"
            className="position-absolute w-100 h-100 top-0 start-0 opacity-0"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-sm-12 mb-3 mt-4">
          <div className='row'>
            <div className="col-xxl-9 col-xl-6 col-lg-4 col-md-7 col-5">
              <small className="text-muted init-nav-co">Need help importing files?</small>
            </div>

            <div className='col-auto gx-0'>
              <button
                type="button"
                className="btn btn-cancel me-3 px-3"
                onClick={() => {
                  setFile(null);
                  setFileBase64('');
                }}
              >
                Cancel
              </button>
            </div>

            <div className='col-auto gx-0'>
              <button type="button" className="btn btn-blue-clr px-3">Import</button>
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 bg-white rounded mt-4'>
        <div className="row g-5">
          {file && (
            <div className="col-lg-auto col-3 me-3 object-fit-contain">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                width={100}
                height={100}
              />
            </div>
          )}
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
