import axios from 'axios'; // Import axios for making API calls
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../../URL_Config';
import { showSnackbar } from '../../Utils/enQueSnackBar';

function VerifyMail() {
    let naviagte=useNavigate()
  useEffect(() => {
    // Function to extract token from query URL
    const getTokenFromQuery = () => {
      const queryParams = new URLSearchParams(window.location.search);
      return queryParams.get('token');
    };

    // Call the API if token exists
    const token = getTokenFromQuery();
   
    if (token) {
      // Make API call to verify email using the token
      axios.post(BACKEND_URL+"/auth/verify-token", { token,action:"verifyEmail" })
        .then(response => {
          // Handle successful response
          
          
          if(response.data.message==="Account verified successfully")
          {
            showSnackbar("Account verified successfully","info","top")
            naviagte("/auth/login",{replace:true}); 
          }
          // Perform any additional actions upon successful verification
        })
        .catch(error => {
          // Handle error
          if(error.response.data.message==="Link Expired! Please verify yourself.")
          {
            localStorage.setItem("_isVE","Y")
            window.location.replace("/reverify-email")
          }
          
          // Perform any error handling or display error message to the user
        });
    }
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return (
    <>
      <section>
        <div class="py-16">
          <div class="mx-auto px-6 max-w-6xl text-gray-500">
            <div class="text-center">
              <h2 class="text-3xl text-gray-950 dark:text-white font-semibold">Please wait, we are verifying your email</h2>
              <p class="mt-6 text-gray-700 dark:text-gray-300">This may take a moment...</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default VerifyMail;
