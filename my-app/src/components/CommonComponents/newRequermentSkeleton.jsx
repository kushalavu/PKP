'use client';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NewRequirementSkeleton = () => {
  return (
    <SkeletonTheme 
      baseColor="#f8f6f6ff"
      highlightColor="#fefefeff"
      duration={1.2}
    >
      <div className="container-fluid p-3 ">
        <div className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4 rounded form-bg mb-3">
            <Skeleton height={30} className='mt-3'/>
              <Skeleton height={20} />
                <hr />
              <Skeleton height={40}  className='mt-4'/>
              <Skeleton height={40} className='mt-4'/>
              <Skeleton height={40} className='mt-4'/>
              <Skeleton height={40} className='mt-4'/>
              <Skeleton height={40} className='mt-4'/>
              <Skeleton height={40} className='mt-4'/>
              <Skeleton height={40} className='mt-4'/>
              <div className="col-sm-2">
                <Skeleton height={40} className='mt-3'/>
              </div>
           </div>
            <div className="col-md-8 rounded form-bg">
             <Skeleton height={25} className='mt-3'/>
             <Skeleton height={200} className='shadow-sm mt-3'/>
                <Skeleton height={35} className='mt-3'/>
                <Skeleton height={150} className='shadow-sm mt-5'/>
            </div>
     </div>
   </div>
        {/* Table Skeleton */}
      </div>
    </SkeletonTheme>
  );
};
export default NewRequirementSkeleton;
