import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Logo from '../../images/applogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  
  // TODO:
  // Create a navigation bar with
  //  - for smaller screens, collapsable navbar
  //  - stays on top of screen when scrolling 

  return (
    <div className='navbar flex flex-sb'>
      <div className='navbar-logo'>
        <Link to= "/" className='navbar-logo flex flex-c'>
          <img className='logo-img' src={Logo} alt="logo" />
        </Link>
      </div>
      <div className='navbar-nav flex flex-sb'>
        <button className='nav-item'>
          <Link to = "/about" exact={"true"} className='nav-link text-uppercase fs-13'>about</Link>
        </button>
        <button className='nav-item'>
          <Link to = "/chat" exact={"true"} className='nav-link text-uppercase fs-13'>chat</Link>
        </button>
        <button className='nav-item'>
          <Link to = "/profile" exact={"true"} className='nav-link text-uppercase fs-13'>profile</Link>
        </button>
        <button className='nav-item'>
          <Link to = "/settings" exact={"true"} className='nav-link text-uppercase fs-13'>settings</Link>
        </button>
      </div>
    </div>
  )
}

export default Navbar