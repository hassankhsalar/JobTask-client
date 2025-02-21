import React, { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

const Login = () => {

const { googleSignIn } = useAuth();
const axiosPublic = useAxiosPublic();
const navigate = useNavigate();

const handleGoogleSignIn = () => {
    googleSignIn()
    .then(result => {
        console.log(result.user);
        const userInfo = {
            email: result.user.email,
            name: result.user.displayName,
        }
        axiosPublic.post('/users', userInfo)
        .then(res =>{
            console.log(res.data);
            navigate('/');
        })
    })
    navigate('/');
}


  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card h-80 flex flex-col justify-evenly  bg-base-100 w-62 max-w-sm shrink-0 shadow-2xl">
            <h2 className="text-3xl">Login!</h2>
            <button className="btn" onClick={handleGoogleSignIn}>Google Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
