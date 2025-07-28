import React from 'react';
import NewRequirementForm from '@/components/newRequirement/NewRequirementForm';
import FileUploadBlock from '@/components/newRequirement/FileUploadBlock';
import '@/components/newRequirement/requirment.css'

const NewRequirementPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xxl-4 col-lg-6 col-12 mb-4">
          <NewRequirementForm />
        </div>
        <div className="col-xxl-8 col-lg-6 col-12">
          <FileUploadBlock />
        </div>
      </div>
    </div>
  );
};
export default NewRequirementPage;
