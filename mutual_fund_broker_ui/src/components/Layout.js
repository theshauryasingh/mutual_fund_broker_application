import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">

      <nav className="navbar">
        <ul>
          <li><Link to="/">Login</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>

      <div className="content">
        {children}  {/* This will render the child component, such as Login, Dashboard, etc. */}
      </div>

      <footer className="footer">
        <p>© 2024 My Website</p>
      </footer>

    </div>
  );
};

export default Layout;

