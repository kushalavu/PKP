'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiFilePlus } from "react-icons/fi";
import { TbChecklist } from "react-icons/tb";
import { HiOutlineRefresh } from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";
import { FaUserCog, FaRegStickyNote } from "react-icons/fa";
import { RiTruckLine, RiLogoutBoxRLine } from "react-icons/ri";
import { BsGearWideConnected } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { VscError } from "react-icons/vsc";
import { FaBars, FaTimes } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import Cookies from 'js-cookie';
const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [role, setRole] = useState(null);
  useEffect(() => {
    const cookieRole = Cookies.get('userRole');
    if (cookieRole) {
      setRole(cookieRole);
      console.log('User role from cookie:', cookieRole);
    } else {
      console.warn('No role cookie found');
    }
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    setShowModal(false);
    router.push('/');
  };

    const menuItemsAdmin = [
      { label: 'New Requirement', icon: <FiFilePlus />, href: '/new-requirement-admin' },
      { label: 'Testing Units(OSM)', icon: <TbChecklist />, href: '/testing-unit-admin' },
      { label: 'Prev Day Production', icon: <HiOutlineRefresh />, href: '/prev-production-admin' },
      { label: 'Sec Operation Details', icon: <MdOutlineSettings />, href: '/sec-operation-admin' },
      { label: 'Pre Day Workers Allotted', icon: <FaUserCog />, href: '/workers-allotted-admin' },
      { label: 'Present Day Dispatch', icon: <RiTruckLine />, href: '/dispatch-admin' },
      { label: 'Work in Progress', icon: <BsGearWideConnected />, href: '/work-in-progress-admin' },
      { label: 'Dashboard', icon: <LuLayoutDashboard />, href: '/dashboard' },
      { label: 'Notes', icon: <FaRegStickyNote />, href: '/notes-admin' },
      { label: 'Machine Stoppage Details', icon: <VscError />, href: '/stoppage-admin' },
      { label: 'Logout', icon: <RiLogoutBoxRLine />, action: () => setShowModal(true) },
    ];
  
    const menuItemsManager = [
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
  
    const menuItems = role === 'admin' ? menuItemsAdmin : menuItemsManager;

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [showMenu]);

  return (
    <>
      {/* Desktop Header */}
      <nav className="custom-sidebar-2 text-white border-bottom p-3 d-lg-block d-none">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xxl-3 col-lg-5 col-6">
              <h5 className="navbar-brand text-white mt-3">{role === 'admin' ? 'Adam Let’s check your inventory today' : 'Lokhi Let’s check your inventory today'}</h5>
            </div>
            <div className="col-xxl-7 col-lg-5 col-4">
              <input className="form-control me-5" type="search" placeholder="Search..." />
            </div>
            <div className="col-xxl-2 col-lg-2 d-flex align-items-center justify-content-end">
           <Link href="/profile" className='text-decoration-none text-white'>
  <Image
    src="/assets/user.png"
    alt="User Profile"
    width={40}
    height={40}
    className="rounded-circle me-3"
    style={{ cursor: 'pointer' }}
  />
              <span>{role === 'admin' ? 'Admin' : 'Manager'}</span></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="container-fluid mobile-header custom-sidebar-2 sticky-top border-bottom d-lg-none d-block">
        <div className="row">
          <div className="col-3">
            <button type='button' className="btn btn-stop-focus boarder-dec text-white me-3 p-3" onClick={() => setShowMenu(!showMenu)}>
              {showMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
          <div className="col-9 text-end p-3">
            <Image
              src="/assets/logo.svg"
              alt="PKP Logo"
              width={100}
              height={80}
              className="img-fluid object-fit-contain"
            />
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {/* Slide-down Mobile Menu */}
 {showMenu && (
  <>
    <div className="mobile-menu-backdrop" onClick={() => setShowMenu(false)} />
    <div className="humburger-small border-bottom shadow-sm p-3 d-lg-none d-block">
      <ul className="list-unstyled nav-pills init-nav-co mb-0">
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            {item.action ? (
              <button
                className="btn btn-danger nav-cus w-100 text-start d-flex align-items-center gap-2"
                onClick={() => handleItemClick(item)}
              >
                {item.icon}
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className={`btn w-100 nav-cus text-start d-flex align-items-center gap-2 ${pathname === item.href
                  ? 'hover-css-sidebar fw-semibold'
                  : 'init-nav-co'
                  }`}
                onClick={() => setShowMenu(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  </>
)}


      {/* Logout Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                <button className="btn btn-danger" onClick={handleLogout}>Yes, Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
