import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  console.log(user);
  
  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.log(error));
  };


  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">JobTask</a>
        </div>

        <div className="navbar-end gap-2">
          <h2>{user?.displayName}</h2>

          {
            user ? <><Link to="/login">
            <button onClick={handleLogout} className="btn">Log out</button>
          </Link></> : <><Link to="/login">
            <button className="btn">Login</button>
          </Link></>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
