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
    <div className="bg-primary">
      <div className="navbar">
        <div className="navbar-start">
          <a className="btn btn-ghost text-white text-xl">JobTask</a>
        </div>

        <div className="navbar-end gap-2 text-white">
          <h2>{user?.displayName}</h2>

          {
            user ? <><Link to="/login">
            <button onClick={handleLogout} className="btn font-bold border-b-2 border-red-700 bg-white text-accent">Log out</button>
          </Link></> : <><Link to="/login">
            <button className="btn font-bold border-b-2 border-red-700 bg-white text-accent">Login</button>
          </Link></>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
