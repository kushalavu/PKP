'use client'
import React, { useState, useEffect } from 'react';
import NewRequirementForm from '@/components/newRequirement/NewRequirementForm';
import '@/components/newRequirement/requirment.css'
import NewRequirementSkeleton from '@/components/CommonComponents/newRequermentSkeleton'

const NewRequirementPage = () => {
    const [loading, setLoading] = useState(true);
         useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
      }, []);
  return (
    <div className="container-fluid">
      <div className="row">
          {loading ? <NewRequirementSkeleton /> : <NewRequirementForm />} </div>
    </div>
  );
};
export default NewRequirementPage;
