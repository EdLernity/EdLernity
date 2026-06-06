import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../URL_Config";
import { showSnackbar } from "../../Utils/enQueSnackBar";
import ErrorComponent from "./ErrorComponent/ErrorComponent";
import Password from "./Password/Password";
function UpdatePassword() {
  const [error, setError] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [responseData, setResponseData] = useState({});
  const location = useLocation();
  const navigate=useNavigate();
  const queryParam = new URLSearchParams(location.search);
  const token = queryParam.get("token");
 
  const divStyle = {
    paddingBottom: "100px",
  };

  useEffect(() => {
    const validateLink = async () => {
      if (token) {
        axios.post(BACKEND_URL+"/auth/verify-token", { token,action:"resetPassword" })
        .then(response => {
          // Handle successful response
          
          
         
          if(response.data?.responseData)
          {
            setIsValidLink(true);
          }
          
          // Perform any additional actions upon successful verification
        })
        .catch(error => {
          // Handle error
          if(error.response.data.message==="Link Expired! Please verify yourself.")
          {
            showSnackbar("Link Expired! Please enter you email and proceed again.","error","top")
            navigate("/auth/reset")
          }
          
          // Perform any error handling or display error message to the user
        });
      }
    };

    validateLink();
  }, [token]);

  //console.log(responseData)
  const req ={ 
    message : responseData.message,
    path : responseData.redirectTo,
    text : responseData.text
  }

  const setErrorValue = (val) => {
    setError(val)
  }

  return (
    <div
      className="flex justify-center items-center xl:w-2/4 md:w-2/4"
      style={error ? divStyle : {}}
    >
      <div className="p-6 w-full flex justify-center items-center flex-col">
        {isValidLink ? <Password /> : <ErrorComponent setErrorValue={setErrorValue} req={req} />}
      </div>
    </div>
  );
}

export default UpdatePassword;
