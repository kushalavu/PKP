'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import RightImage from '../../../public/assets/rightimage.png';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdRadioButtonUnchecked, MdCheckCircle } from "react-icons/md";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { signIn, getSession } from "next-auth/react";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  // Forgot password states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const router = useRouter();


  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loadingLogin) return; // prevent multiple clicks
    setLoadingLogin(true);
    setError('');

    if (!email || !password) {
      setError("Email and password are required");
      setLoadingLogin(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      setLoadingLogin(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        const session = await getSession();
        const roleFromSession = session?.user?.role || role;
        toast.success(session?.user?.message);
        Cookies.set("userRole", roleFromSession, { expires: 1, sameSite: "Lax" });

        await new Promise((resolve) => setTimeout(resolve, 200));

        if (roleFromSession === 'admin') {
          // router.push('/new-requirement-admin');
           window.location.href = '/new-requirement-admin';
        } else {
          // router.push('/new-requirement');
           window.location.href = '/new-requirement';
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again");
      toast.error("Something went wrong, please try again");
    } finally {
      setLoadingLogin(false);
    }
  };

  // ---------------- VERIFY EMAIL ----------------
const handleVerifyEmail = async () => {
  if (loadingVerify) return;
  setLoadingVerify(true);
  setResetError("");

  if (!email) {
    setResetError("Enter your User ID (email)");
    setLoadingVerify(false);
    return;
  }

  try {
    const { data } = await axios.post("/api/verify-email", { userID: email });

    if (!data.success) {
      setResetError(data.message);
      setLoadingVerify(false);
      return;
    }

    setVerifiedEmail(email);
    setIsEmailVerified(true);
    toast.success(data.message || "Email verified successfully.");
  } catch (err) {
    // Only network errors end up here
    console.error("Network error:", err);
    setResetError("Network error. Please try again.");
  } finally {
    setLoadingVerify(false);
  }
};



  // ---------------- RESET PASSWORD ----------------
const handleResetPassword = async () => {
  if (loadingReset) return;
  setLoadingReset(true);
  setResetError("");

  if (!newPassword || !confirmPassword) {
    setResetError("Enter and confirm new password");
    setLoadingReset(false);
    return;
  }

  if (newPassword !== confirmPassword) {
    setResetError("Passwords do not match");
    setLoadingReset(false);
    return;
  }

  if (newPassword.length < 6) {
    setResetError("Password must be at least 6 characters");
    setLoadingReset(false);
    return;
  }

  if (!verifiedEmail) {
    setResetError("Email not verified");
    setLoadingReset(false);
    return;
  }

  try {
    const { data } = await axios.post("/api/forgot-password", {
      userID: verifiedEmail,
      newPassword,
      confirmPassword
    });

    // Handle response always here
    if (!data.success) {
      setResetError(data.message);
      return;
    }

    // Success
    toast.success(data.message);
    setNewPassword("");
    setConfirmPassword("");
    setIsEmailVerified(false);
    setVerifiedEmail("");
    setShowResetModal(false);
  } catch (err) {
    // Only network errors end up here
    console.error("Network error:", err);
    setResetError("Network error. Please try again.");
  } finally {
    setLoadingReset(false);
  }
};

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* RIGHT IMAGE SECTION */}
          <div className="col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center bg-right-img order-1 order-lg-2">
            <div className="mt-lg-5 mt-2 d-lg-none d-block">
              <Image src="/assets/logo.svg" alt="PKP Logo" width={80} height={80} />
            </div>
            <h3 className='fw-bold'>PKP Component</h3>
            <h3 className='fw-bold'>Management Tool</h3>
            <Image src={RightImage} className="img-fluid right-img-login mt-lg-5" alt="Illustration" />
          </div>

          {/* LOGIN FORM */}
          <div className="col-md-6 col-sm-9 col-12 mx-auto order-2 order-lg-1">
            <div className="d-lg-block d-none">
              <Image src="/assets/logo.svg" alt="PKP Logo" width={150} height={150} />
            </div>
            <div className="row">
              <div className="col-xl-6 col-12 mx-auto">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h3 className="mb-5 fw-bold text-center">Login to your account</h3>

                  {error && <p className="text-danger text-center mb-3">{error}</p>}

                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <input
                        type="text"
                        className="form-control bg-light border-0 rounded py-lg-3 py-2 px-3"
                        placeholder="User ID (Email)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4 position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      {/* <div
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
                      </div> */}
                      <button
                        type="button"
                        className="btn fw-semibold btn-link text-danger text-decoration-none p-0"
                        onClick={() => setShowResetModal(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="btn common-pink-btn w-100 py-lg-3 py-2 px-3"
                      disabled={loadingLogin}
                    >
                      {loadingLogin ? 'Signing in...' : 'Sign in'}
                    </button>


                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESET PASSWORD MODAL */}

        <div
          className={`modal fade ${showResetModal ? 'show d-block' : ''}`}
          id="resetMpinModal"
          tabIndex="-1"
          style={showResetModal ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body p-4">
                <button
                  type="button"
                  className="btn-close float-end"
                  onClick={() => {
                    setShowResetModal(false);      // close modal
                    setIsEmailVerified(false);     // reset step
                    setVerifiedEmail('');          // clear any previously verified email
                    setNewPassword('');
                    setConfirmPassword('');
                    setResetError('');
                  }}
                ></button>


                {/* Step 1: Verify Email */}
                {!isEmailVerified && (
                  <>
                    {resetError && <p className="text-danger">{resetError}</p>}
                    <p className="text-muted fw-semibold mb-4 mt-4">Enter your User ID (email) to verify your account.</p>
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="User ID (Email)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      className="btn common-pink-btn w-100"
                      onClick={handleVerifyEmail}
                      disabled={loadingVerify}
                    >
                      {loadingVerify ? 'Verifying...' : 'Verify Email'}
                    </button>

                  </>
                )}

                {/* Step 2: Reset Password */}
                {isEmailVerified && (
                  <>
                    {resetError && <p className="text-danger">{resetError}</p>}
                    <p className="text-muted fw-semibold mb-4 mt-5">Please enter a new password. Your new password must be different from previous password.</p>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control mb-3"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control mb-3"
                      placeholder="Re-enter New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="btn common-pink-btn w-100"
                      onClick={handleResetPassword}
                      disabled={loadingReset}
                    >
                      {loadingReset ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
