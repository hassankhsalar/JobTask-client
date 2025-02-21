import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">JobTask</a>
        </div>

        <div className="navbar-end">
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
