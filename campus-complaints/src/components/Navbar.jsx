import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <NavLink
        to={user.role === 'admin' ? '/admin' : '/dashboard'}
        className="navbar-brand"
      >
        <div className="logo-icon">🎓</div>
        <span>CampusDesk</span>
      </NavLink>

      <div className="navbar-links">
        {user.role === 'student' ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/submit" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Submit
            </NavLink>
            <NavLink to="/my-complaints" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              My Complaints
            </NavLink>
          </>
        ) : (
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Admin Panel
          </NavLink>
        )}
        <span className="nav-badge">{user.role}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
