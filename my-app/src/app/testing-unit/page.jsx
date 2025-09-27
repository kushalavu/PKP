'use client'
import React, { useState, useEffect } from 'react';
import TestingUnitsForm from '@/components/TestingUnitsForm/TestingUnitsForm';
import TestingUnitsTable from '@/components/TestingUnitsForm/TestingUnitsTable';
import CommonSkeletonLoader from '@/components/CommonComponents/CommonSkeletonLoader'

const Page = () => {
    const [loading, setLoading] = useState(true);
     useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
    return (
        <div className="container-fluid">
            <div className="row form-complete-bg p-2">
                  {loading ? <CommonSkeletonLoader /> : <TestingUnitsForm />}
               
            </div>
        </div>
    );
};
export default Page;