import React from "react";
import Tooltip from "@mui/material/Tooltip";
import "../App.css";
import Logo from "../assets/cw.png";
import SmallLogo from "../assets/cw-black.png";
import { Link } from "react-router-dom";
import { RiShutDownLine } from "react-icons/ri";
import "./header.css";

// Header component
const Header = ({ handleLogout, userName }) => {
  const handleToggleSidebar = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    document.body.classList.toggle("toggle-sidebar");
  };

  return (
    // Header container with logo, title, and user info
    <header
      id="header"
      className="header fixed-top d-flex align-items-center justify-content-between"
    >
      <Link to="/">
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo d-flex align-items-center">
            <span className="d-lg-block">
              <img src={Logo} className="cw-logo" alt="Logo" />
              {/* Alternative Logo image for screen size < 768px */}
              <img src={SmallLogo} className="cw-logo1" alt="Logo1" />{" "}
            </span>
          </div>
          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={handleToggleSidebar}
          ></i>
        </div>
      </Link>
      <div className="header-title"></div>
      <div className="user-info">
        <span>Welcome, {userName}!</span>
        <Tooltip title="Logout">
          <span>
            <RiShutDownLine className="logout-icon" onClick={handleLogout} />
          </span>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
