import React from "react";
import { useLocation } from 'react-router-dom';
import ForgetPasswordComponent from "./Forget/ForgetPasswordComponent";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import UpdatePassword from "./UpdatePassword/UpdatePassword";

function Auth() {

  const location = useLocation();

  let isForget = location.pathname.includes("/reset");
  let isUpdatePassword = location.pathname.includes("/updatePassword");

  return (
    <div 
      className="min-h-screen w-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden bg-slate-950"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(24, 31, 197, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated Floating Background Tech Blobs */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-[#181FC5]/20 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row min-h-[550px] relative z-10">
        {/* Left/Right Column: Image Illustration (hidden on small screens, shown on md+) */}
        <div className="hidden md:flex md:w-1/2 bg-[#181FC5]/5 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#181FC5]/10 rounded-full filter blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none"></div>
          
          <div className="relative text-center space-y-6 z-10 flex flex-col items-center">
            <img 
              src="/Image/IMG_8841.PNG"
              alt="EdLernity authentication"
              className="w-full max-w-xs lg:max-w-sm h-auto rounded-2xl object-contain"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">Secure & Seamless</h2>
              <p className="text-sm text-slate-500 max-w-xs">Access your professional dashboard and courses with peace of mind.</p>
            </div>
          </div>
        </div>

        {/* Content Column: Forms */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
          <div className="w-full max-w-md">
            {location.pathname.includes("/login") ? <Login /> : isForget ? <ForgetPasswordComponent /> : isUpdatePassword ? <UpdatePassword/> : <Signup/> }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;