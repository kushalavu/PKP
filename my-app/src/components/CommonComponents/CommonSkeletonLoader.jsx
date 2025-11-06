'use client';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommonSkeletonLoader = () => {
  return (
    <SkeletonTheme 
      baseColor="#ffff"
      
      highlightColor="#f6f3f3ff"
      duration={1.2}
    >
      <div className="container-fluid p-4">
        {/* Form Skeleton */}
        <div className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4 mb-3">
              <Skeleton height={25} />
              <Skeleton height={10} />
            </div>
            <hr className="mb-3 hr-sty-all" />
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm '/>
            </div>
             <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Skeleton height={35} className='shadow-sm'/>
            </div>
          </div>

          <Skeleton height={40} width={120} className='shadow-sm'/>
        </div>

        {/* Table Skeleton */}
        <div>
          <h5 className="fw-bold mb-2"><Skeleton width={150} /></h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  {Array(8).fill().map((_, i) => (
                    <th key={i}><Skeleton /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(3).fill().map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array(8).fill().map((_, colIndex) => (
                      <td key={colIndex}><Skeleton /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
export default CommonSkeletonLoader;
