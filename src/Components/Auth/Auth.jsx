import React from "react";
import {
  CardBody,
} from "@material-tailwind/react";
import Login from "../Login/Login";
import { useLocation } from 'react-router-dom'
import Signup from "../Signup/Signup";

function Auth() {

  const location = useLocation();

  let isLogin = location.pathname.includes("/login");

  return (
    <div className="image flex justify-center items-center w-screen h-screen">
      <div className="md:w-3/4 xl:w-3/4 w-3/4 h-full pt-12 md:h-4/6 xl:h-4/6 flex md:flex-row-reverse xl:flex-row-reverse flex-col overflow-hidden shadow-none">
        <CardBody className="md:w-2/4 xl:w-2/4 w-full flex md:flex xl:flex justify-center h-1/6 md:h-full xl:h-full items-center mt-4 md:mt-0 xl:mt-0">
          <img src="/Image/Secure data-bro.svg" alt="loginImage" className="mb-2 md:mt-0 xl:mt-0"/>
        </CardBody>
        {isLogin ? <Login /> : <Signup /> }
      </div>
    </div>
  );
}

export default Auth;