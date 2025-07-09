'use client';
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <nav className="custom-sidebar-2 text-white border-bottom p-3">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
  <h5 className="navbar-brand text-white mt-2 justify-content-between">Loki - Let’s check your inventory today</h5>
          </div>
          <div className="col-sm-7">
             <input className="form-control me-5" type="search" placeholder="Search..." />
        
          </div>
          <div className="col-sm-2 justify-content-between">
               <Image
            src="/assets/user.png"
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-circle me-3"
          />

            <span className="me-2 fw-semibold">User Profile</span>
<span>Manager</span>
          </div>
        </div>
      
      </div>
    </nav>
  );
};

export default Header;
