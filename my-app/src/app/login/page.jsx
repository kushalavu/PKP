'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RightImage from '../../../public/assets/rightimage.png';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdRadioButtonUnchecked, MdCheckCircle } from "react-icons/md";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// import ForgotPassword from '@/componants/LoginPage/ForgotPassword' const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [role, setRole] = useState('');
           const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
      const router = useRouter();
      useEffect(() => {
  const cookieRole = Cookies.get('userRole');
  if (cookieRole) {
    setRole(cookieRole);
  }
}, []);

const signIn = () =>{
    if(role === 'admin'){
        router.push('/new-requirement-admin');
    }else{
    router.push('/new-requirement');
    }
}
const forgotPassword = () =>{
router.push('/login');
}
    return (
        <>
        <div className="container-fluid">
            <div className="row">
                {/* RIGHT IMAGE SECTION: Goes left on small screens, right on large */}
                <div className="col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center bg-right-img order-1 order-lg-2">
                        <div className="mt-lg-5 mt-2 d-lg-none d-block">
                        <Image
                            src="/assets/logo.svg"
                            alt="PKP Logo"
                            className="img-fluid object-fit-contain mx-5"
                            width={80}
                            height={80}
                            loading="lazy"
                        />
                    </div>
                    <h3 className='fw-bold'>PKP Component</h3>
                    <h3 className='fw-bold'>Management Tool</h3>
                    <Image
                        src={RightImage}
                        className="img-fluid right-img-login mt-lg-5"
                        alt="Illustration"
                    />
                </div>

                {/* LOGIN FORM SECTION: Goes right on small screens, left on large */}
                <div className="col-md-6 col-sm-9 col-12 mx-auto order-2 order-lg-1">
                    <div className="mt-5 d-lg-block d-none">
                        <Image
                            src="/assets/logo.svg"
                            alt="PKP Logo"
                            className="img-fluid object-fit-contain mx-5"
                            width={200}
                            height={200}
                            loading="lazy"
                        />
                    </div>
                    <div className="row mt-5">
                        <div className="col-xl-6 col-12 mx-auto mt-lg-5">
                            <div className="flex-column justify-content-center align-items-center bg-white">
                                <h3 className="mb-5 fw-bold text-center">Login to your account</h3>
                                <form>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 rounded py-lg-3 py-2 px-3"
                                            placeholder="User ID"
                                        />
                                    </div>
                                    <div className="mb-4 position-relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                                            placeholder="Password"
                                        />
                                        <button
                                            type="button"
                                            className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div
                                            className="d-flex align-items-center"
                                            onClick={() => setRemember(!remember)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {remember ? (
                                                <MdCheckCircle size={20} className="text-primary me-2" />
                                            ) : (
                                                <MdRadioButtonUnchecked size={20} className="text-secondary me-2" />
                                            )}
                                            <span>Remember me</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn fw-semibold btn-link text-danger text-decoration-none p-0"
                                            data-bs-toggle="modal"
                                            data-bs-target="#resetMpinModal"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                    {/* <Link href="/new-requirement" className="btn btn-primary mt-4 w-100 p-3">
                                        Sign in
                                    </Link> */}
                                              <button
                                            type="button"
                                            className="btn common-pink-btn text-center text-decoration-none w-100 py-lg-3 py-2 px-3"
                                         onClick={signIn}
                                
                                        >
                                            Sign in
                                        </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

      {/* Modal */}
              <div
      className="modal fade"
      id="resetMpinModal"
      tabIndex="-1"
      aria-labelledby="resetMpinModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 rounded-4 shadow">
          <div className="modal-body p-5">
            <h3 className="fw-bold mb-3">Create new password</h3>
            <p className="text-muted mb-4">
              Please enter a new password. Your new password must be different from the previous password.
            </p>

            {/* New Password Field */}
            <div className="mb-3 position-relative">
              <input
                type={isNewPasswordVisible ? 'text' : 'password'}
                className="form-control form-control-lg text-decoration-none rounded-3"
                placeholder="Enter new password"
              />
              <span
                className="position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              >
                {isNewPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 position-relative">
              <input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                className="form-control form-control-lg text-decoration-none rounded-3"
                placeholder="Confirm new password"
              />
              <span
                className="position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button type='submit' className="btn common-pink-btn w-100 p-3 rounded-3" >
                                          
              Reset Password
            </button>

          </div>
        </div>
      </div>
    </div>
        </div>
    
    </>
    );
};

export default Login;
