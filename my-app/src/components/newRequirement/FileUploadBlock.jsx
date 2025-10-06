'use client';
import React, { useRef } from 'react';
import { FaFileCirclePlus } from "react-icons/fa6";

const FileUploadBlock = ({ file, setFile, setFileBase64 }) => {
  const fileInputRef = useRef(null);

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

  const openFilePicker = () => {
    fileInputRef.current.click(); // programmatically open file picker
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
            ref={fileInputRef}
            className="position-absolute w-100 h-100 top-0 start-0 opacity-0"
            onChange={handleFileChange}
          />
        </div>

 <div className="col-12 mb-3 mt-4">
  <div className="d-flex flex-wrap align-items-center justify-content-between">
    
    {/* Left text */}
    <div className="mb-2 mb-sm-0">
      <small className="text-muted init-nav-co">Need help importing files?</small>
    </div>

    {/* Buttons */}
    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-cancel px-3"
        onClick={() => {
          setFile(null);
          setFileBase64('');
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        className="btn btn-blue-clr px-3"
        onClick={openFilePicker}
      >
        Import
      </button>
    </div>

  </div>
</div>

      </div>
      {file && (
        <div className='p-4 bg-white rounded mt-4'>
          <div className="row">
            <h5 className="fw-bold mb-3">Preview</h5>

            <div className="col-lg-auto col-3 me-3 object-fit-contain">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                width={100}
                height={100}
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadBlock;
