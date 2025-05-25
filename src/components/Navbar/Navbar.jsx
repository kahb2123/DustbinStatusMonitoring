import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">IoT Waste Management</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/binstatus">Bin Status</NavLink>
        <NavLink to="/collection-route">Collection Route</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;