import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  // This line was failing, but will now work
  const { user, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/" onClick={closeMenu}>
          ForeXcure
        </Link>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink className="nav-links" to="/" onClick={closeMenu} end>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-links" to="/blog" onClick={closeMenu}>
              Blog
            </NavLink>
          </li>
          {user && (
            <>
              <li className="nav-item">
                <NavLink className="nav-links" to="/doctors" onClick={closeMenu}>
                  Find a Doctor
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-links" to="/store" onClick={closeMenu}>
                  Medical Store
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-links" to="/chatbot" onClick={closeMenu}>
                  Symptom Checker
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-links" to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
            </>
          )}
          <li className="nav-item">
            {user ? (
              <Link className="nav-links nav-button" to="/" onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <Link className="nav-links nav-button" to="/login" onClick={closeMenu}>
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;