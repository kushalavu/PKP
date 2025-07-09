'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RightImage from '../../../public/assets/rightimage.png';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdRadioButtonUnchecked, MdCheckCircle } from "react-icons/md";
// import ForgotPassword from '@/componants/LoginPage/ForgotPassword'


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="mt-5">
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
                        <div className="col-6 mx-auto mt-5">
                            <div className="flex-column justify-content-center align-items-center bg-white">
                                <h3 className="mb-5 fw-bold">Login to your account</h3>
                                <form>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 rounded py-2 px-3"
                                            placeholder="User ID"
                                        />
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control bg-light border-0 rounded py-2 px-3 pe-5"
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
                                    <div className="d-flex justify-content-between align-items-center mb-3">
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
                                        <button type="button" className="btn btn-link text-danger text-decoration-none p-0"
                                            data-bs-toggle="modal"
                                            data-bs-target="#forgotPasswordModal"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <Link href="/new-requirement" className="btn btn-primary mt-4 w-100 p-3">
                                        Sign in
                                    </Link>

                                </form>
                                {/* <ForgotPassword /> */}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-center align-items-center bg-right-img">
                    <h3 className='fw-bold'>PKP Component</h3>
                    <h3 className='fw-bold'>Management Tool</h3>
                    <Image
                        src={RightImage}
                        className="img-fluid right-img-login mt-5"
                        alt="Illustration"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
