'use client'
import React, { useState, useEffect } from 'react';
import CommonSkeletonLoader from '@/components/CommonComponents/CommonSkeletonLoader'
import PreDayWorkersForm from "@/components/PreDayWorkersForm/PreDayWorkersForm";

const page = () => {
          const [loading, setLoading] = useState(true);
               useEffect(() => {
              // Simulate API fetch
              const timer = setTimeout(() => setLoading(false), 1500);
              return () => clearTimeout(timer);
            }, []);
  return (
      <>
          <div className="container-fluid form-complete-bg p-4">
            {loading ? <CommonSkeletonLoader /> : <PreDayWorkersForm />}
          </div>
  </> 
  )
}

export default page;
