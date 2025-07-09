'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AdminManager = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const router = useRouter();

  const adminImage = selectedRole === 'admin' ? '/assets/Admin.svg' : '/assets/reset-admin.png';
  const managerImage = selectedRole === 'manager' ? '/assets/Manager.svg' : '/assets/manager2.svg';

  const handleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Optional: store selected role for later use
      localStorage.setItem('userRole', selectedRole);
      router.push('/login');
    }
  };

  return (
    <div className="container text-center py-5">
      <div className="logo mb-4">
        <Image src="/assets/logo.svg" width={170.45} height={64.26} alt="logo" />
      </div>


      <div className="row justify-content-center mb-4">
        <h2 className="title">What's your role?</h2>
        <div

          className={`cardAdmin col-sm-4 ${selectedRole === 'admin' ? 'border-primary' : ''}`}
          onClick={() => handleSelect('admin')}
          style={{ cursor: 'pointer' }}
        >
          <Image src={adminImage} width={228.41} height={253.32} alt="admin" />
        </div>

        <div
          className={`cardManager col-sm-4 ${selectedRole === 'manager' ? 'border-primary' : ''}`}
          onClick={() => handleSelect('manager')}
          style={{ cursor: 'pointer' }}
        >
          <Image src={managerImage} width={228.41} height={253.32} alt="manager" />
        </div>

        <div className='col-sm-4'>
<button
  type="button"
  className={`btn btn-center-init mt-4 px-5 ${
    selectedRole ? 'btn-continue' : 'btn-select'
  }`}
  disabled={!selectedRole}
  onClick={handleContinue}
>
  {selectedRole ? 'Continue to Login' : 'Select a user'}
</button>

        </div>

      </div>

    </div>
  );
};

export default AdminManager;
