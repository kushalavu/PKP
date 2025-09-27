'use client'
import React, { useState, useEffect } from 'react';
import MachineStoppageForm from "@/components/MachineStoppageForm/MachineStoppageForm";
import CommonSkeletonLoader from '@/components/CommonComponents/CommonSkeletonLoader'
const page = () => {
     const [loading, setLoading] = useState(true);
         useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
      }, []);
  return (
    <> {loading ? <CommonSkeletonLoader /> : <MachineStoppageForm />}</>
  );
}

export default page;
