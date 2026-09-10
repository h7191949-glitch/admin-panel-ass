import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>Dashboard</h1>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="notification">
          🔔
        </div>

        <div className="profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;