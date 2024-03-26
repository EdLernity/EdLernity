import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../../URL_Config';
import { showSnackbar } from '../../Utils/enQueSnackBar';
function ReVerifyMail() {
let nav=useNavigate()
    const [email, setEmail] = useState('');
  useEffect(() => {
    // Check if localStorage item "_isVE" exists and its value is "Y"
    if (localStorage.getItem("_isVE") !== "Y") {
      // Redirect user to login page
    //   window.location.href = "/auth/login"; // Adjust the URL as needed
    }
  }, []);


  const handleReverify = () => {
    // Call your API here
    if (email.trim() === '') {
        showSnackbar('Email is required',"error","top")
      return;
    }
    axios.post(BACKEND_URL+"/auth/re-verifyEmail", { email })
        .then(response => {
          showSnackbar(response.data.message,"info","top");
          sessionStorage.setItem("email",response.data.responseData)
          nav("/auth/login",{replace:true}); 
        })
        .catch(error => {
          // Handle error
          showSnackbar(error.response.data.message,"info","top")
        
        });
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-[#fbfbfb]">
        <div className="grid w-80 grid-rows-4 gap-1">
          <p className="font-semibold text-gray-700">📧 Re-verify your email to continue</p>
          <p className="text-sm text-gray-600">We need to re-verify your email to ensure the security of your account.</p>
          <input  value={email}
            onChange={(e) => setEmail(e.target.value)} type="email" className="h-10 w-full rounded border p-2 text-sm" placeholder="Your email" />
          <button onClick={handleReverify} className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Re-verify email</button>
        </div>
      </div>
    </>
  );
}

export default ReVerifyMail;
