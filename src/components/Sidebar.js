import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

function SideBar() {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link to="/supressionlist" className="nav-link">
            <i className="bi bi-list"></i>
            <span>Suppression List</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default SideBar;