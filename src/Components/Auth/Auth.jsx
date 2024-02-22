import React from "react";
import Login from "./Login/Login";
import { useLocation } from 'react-router-dom'
import Signup from "./Signup/Signup";
import UpdatePassword from "./UpdatePassword/UpdatePassword";
import ForgetPasswordComponent from "./Forget/ForgetPasswordComponent";

function Auth() {

  const location = useLocation();

  let isLogin = location.pathname.includes("/login");
  let isForget = location.pathname.includes("/reset");
  let isUpdatePassword = location.pathname.includes("/updatePassword");

  return (
    <div className="image flex justify-center items-center w-screen h-screen">
      <div className="md:w-full xl:w-3/4 w-full h-full pt-0 md:pt-0 xl:pt-0 md:h-3/6 xl:h-4/6 flex md:flex-row-reverse xl:flex-row-reverse flex-col shadow-none">
        <div className="md:w-2/4 xl:w-2/4 w-full flex md:flex xl:flex justify-center md:h-full xl:h-full items-center mt-4 md:mt-0 xl:mt-0">
          <img src="/Image/Secure data-bro.svg" alt="loginImage" className="h-36 md:flex xl:flex mb-2 md:mt-0 xl:mt-0 md:h-full xl:h-full"/>
        </div>
        {isLogin ? <Login /> : isForget ? <ForgetPasswordComponent /> : isUpdatePassword ? <UpdatePassword/> : <Signup/> }
      </div>
    </div>
  );
}

export default Auth;