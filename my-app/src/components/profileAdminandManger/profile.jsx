'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdEmail } from "react-icons/md";

export default function ProfileSetting({ userData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    gender: '',
    country: '',
    timeZone: '',
    email: '',
    createdAt: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        nickName: userData.nickName || '',
        gender: userData.gender || '',
        country: userData.country || '',
        timeZone: userData.timeZone || '',
        email: userData.email || '',
        createdAt: userData.createdAt || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', formData);
    // Call API here
  };

  return (
    <div className="container-fluid bg-white rounded p-4">
      <h4 className="fw-bold mb-4 border-bottom pb-2">Profile Setting</h4>

      <form onSubmit={handleSubmit}>
        <div className="row mt-5">
          {/* Left side form */}
          <div className="col-md-8">
            <div className="row mb-3">
              <div className="col-md-5 mb-3">
                <label className="form-label fw-medium clr-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-control bg-light form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                  placeholder="Your First Name"
                />
              </div>
              <div className="col-md-5 mb-3">
                <label className="form-label fw-medium clr-label">Nick Name</label>
                <input
                  type="text"
                  name="nickName"
                  value={formData.nickName}
                  onChange={handleChange}
                  className="form-control bg-light form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                  placeholder="Your First Name"
                />
              </div>
              <div className="col-md-5 mb-3">
                <label className="form-label fw-medium clr-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select bg-light form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-5 mb-3">
                <label className="form-label fw-medium clr-label">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-select bg-light form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                >
                  <option value="">Country</option>
                  <option value="India">India</option>
                  <option value="US">United States</option>
                  {/* Add more countries */}
                </select>
              </div>
              <div className="col-md-5 mb-4">
                <label className="form-label fw-medium clr-label">Time Zone</label>
                <input
                  type="text"
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                  className="form-control bg-light form-control bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5"
                  placeholder="Your Time Zone"
                />
              </div>
            </div>

            <div>
              <h6 className="fw-bold mb-2 clr-label">My email Address</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <MdEmail size={22} color='#4182F9'/>
                  <span className="text-white fw-bold">{formData.email?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="mb-0 fw-medium small">{formData.email}</p>
                  <p className="mb-0 text-muted small">{formData.createdAt}</p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-light border bg-light border-0 rounded py-lg-3 py-2 px-3 pe-5 clr-label mt-3"
              >
                + Add Email Address
              </button>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn btn-blue-clr px-4">
                Submit
              </button>
            </div>
          </div>

          {/* Right side image */}
          <div className="col-md-4 text-center">
            <div
              className="mx-auto"
              style={{ width: 120, height: 120, cursor: 'pointer' }}
              onClick={() => router.push('/profile')}
            >
              <Image
                src="/assets/user.png"
                alt="User"
                width={120}
                height={120}
                className="rounded-circle object-fit-cover"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
