// Navbar.js

import React from "react";
import "./Navbar.css";

const Navbar = ({
  tables,
  activeTable,
  onTableClick,
  isNavbarOpen,
  onToggleNavbar,
}) => {
  return (
    <div className={`side-navbar ${isNavbarOpen ? "open" : ""}`}>
      <ul>
        {tables.map((tableName) => (
          <li
            key={tableName}
            className={activeTable === tableName ? "active" : ""}
            onClick={() => onTableClick(tableName)}
          >
            {tableName.replace("_", " ")}
          </li>
        ))}
      </ul>
      {/* Collapsible Navbar Toggle Button */}
      <button
        className={`navbar-toggle ${isNavbarOpen ? "open" : ""}`}
        onClick={onToggleNavbar}
      >
        ☰
      </button>
    </div>
  );
};

export default Navbar;
