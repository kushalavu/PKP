'use client'
import React, { useState, useEffect } from 'react';
import NotesForm from "@/components/NotesForm/NotesForm";
import CommonSkeletonLoader from '@/components/CommonComponents/CommonSkeletonLoader'
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
              {loading ? <CommonSkeletonLoader /> : <NotesForm />}     
      </div>
   </>
  )
}

export default page;
