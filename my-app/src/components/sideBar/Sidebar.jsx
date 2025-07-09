'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// React Icons imports
import { FiFilePlus } from "react-icons/fi";
import { TbChecklist } from "react-icons/tb";
import { HiOutlineRefresh } from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";
import { FaUserCog, FaRegStickyNote } from "react-icons/fa";
import { RiTruckLine, RiLogoutBoxRLine } from "react-icons/ri";
import { BsGearWideConnected } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { VscError } from "react-icons/vsc";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setShowModal(false);
    router.push('/login');
  };

  const menuItems = [
    { label: 'New Requirement', icon: <FiFilePlus />, href: '/new-requirement' },
    { label: 'Testing Units(OSM)', icon: <TbChecklist />, href: '/testing-unit' },
    { label: 'Prev Day Production', icon: <HiOutlineRefresh />, href: '/prev-production' },
    { label: 'Sec Operation Details', icon: <MdOutlineSettings />, href: '/sec-operation' },
    { label: 'Pre Day Workers Allotted', icon: <FaUserCog />, href: '/workers-allotted' },
    { label: 'Present Day Dispatch', icon: <RiTruckLine />, href: '/dispatch' },
    { label: 'Work in Progress', icon: <BsGearWideConnected />, href: '/work-in-progress' },
    { label: 'Dashboard', icon: <LuLayoutDashboard />, href: '/dashboard' },
    { label: 'Notes', icon: <FaRegStickyNote />, href: '/notes' },
    { label: 'Machine Stoppage Details', icon: <VscError />, href: '/stoppage' },
    { label: 'Logout', icon: <RiLogoutBoxRLine />, action: () => setShowModal(true) },
  ];

  return (
    <>
      <aside className="min-vh-100 d-flex flex-column">
        {/* Logo */}
        <div className="d-flex flex-column align-items-center justify-content-center text-center p-3">
          <Image
            src="/assets/pkplogo.png"
            alt="PKP Logo"
            width={100}
            height={80}
            className="img-fluid object-fit-contain"
          />
        </div>

        <div className="custom-sidebar min-vh-100 d-flex flex-column mt-1">
          <ul className="nav nav-pills flex-column init-nav-co mt-2">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item p-2">
                {item.action ? (
                  <button
                    className="nav-link btn-danger nav-cus d-flex align-items-center fw-semibold gap-2 px-3 py-2 rounded text-start w-100"
                    onClick={item.action}
                  >
                    <span className="fs-5">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`nav-link nav-cus d-flex align-items-center fw-semibold gap-2 px-3 py-2 rounded ${
                      pathname === item.href ? 'hover-css-sidebar fw-semibold' : 'init-nav-co'
                    }`}
                  >
                    <span className="fs-5">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  No
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
