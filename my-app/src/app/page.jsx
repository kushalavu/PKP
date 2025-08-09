"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';


const AdminManager = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = () => {
    if (selectedRole) {
        Cookies.set('userRole', selectedRole);
      // Optional: store selected role if needed
      localStorage.setItem("userRole", selectedRole);
      router.push("/login");
    }
  };

  const adminImage =
    selectedRole === "admin" ? "/assets/Admin.svg" : "/assets/adminsvg.svg";
  const managerImage =
    selectedRole === "manager"
      ? "/assets/Manager.svg"
      : "/assets/manager2.svg";

  return (
    <div className="text-center w-100 px-3">
      {/* Logo */}
      <div className="text-start mb-5 mt-5">
        <Image
          src="/assets/logo.svg"
          className="img-fluid object-fit-contain"
          width={150}
          height={64.26}
          alt="logo"
        />
      </div>

      {/* Heading */}
      <h2 className="fw-bold mb-5 mt-5">What’s your role</h2>

      {/* Role Images */}
      <div className="d-flex justify-content-center gap-3 mb-5 mt-5 flex-wrap my-auto">
        <div
          onClick={() => handleSelect("admin")}
          style={{ cursor: "pointer" }}
          className="mt-lg-5"
        >
          <Image
            src={adminImage}
            className="img-fluid role-image"
            width={300}
            height={300}
            alt="Admin"
          />
        </div>

        <div
          onClick={() => handleSelect("manager")}
          style={{ cursor: "pointer" }}
          className="mt-lg-5"
        >
          <Image
            src={managerImage}
            className="img-fluid role-image"
            width={300}
            height={300}
            alt="Manager"
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedRole}
        className={`btn px-5 py-lg-3 py-2 mt-5 rounded-pill fw-semibold transition-all ${
          selectedRole
            ? "btn-primary"
            : "btn-secondary bg-secondary border-0 text-light"
        }`}
        style={{
          filter: selectedRole ? "none" : "blur(1px)",
          opacity: selectedRole ? 1 : 0.6,
          pointerEvents: selectedRole ? "auto" : "none",
        }}
      >
        {selectedRole ? "Continue to Login" : "Select Role"}
      </button>
    </div>
  );
};

export default AdminManager;
