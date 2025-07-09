import React from 'react';
import NewRequirementForm from '@/components/newRequirement/NewRequirementForm';
import FileUploadBlock from '@/components/newRequirement/FileUploadBlock';
import '@/components/newRequirement/requirment.css'

const NewRequirementPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 mb-4">
          <NewRequirementForm />
        </div>
        <div className="col-lg-8">
          <FileUploadBlock />
        </div>
      </div>
    </div>
  );
};
export default NewRequirementPage;
