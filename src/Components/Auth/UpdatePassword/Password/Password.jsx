import {
  Button,
  CardBody,
  CardFooter
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../../URL_Config";
import { axiosInstanceWithoutToken } from "../../../../Utils/AxiosInstance";
import InputButton from "../../../Input/InputButton";
import { showSnackbar } from "../../../Utils/enQueSnackBar";

function Password() {
  const [newPassword, setNewPaasword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseData, setResponseData] = useState({});
  const location = useLocation();
  const [error, setError] = useState(false);
  const navigate=useNavigate();
  const queryParam = new URLSearchParams(location.search);

  const token = queryParam.get("token");

  const { pathname, search, hash } = location;

  // Combine them to form the current URL
  const currentUrl = pathname + search + hash;

  const authIndex = currentUrl.indexOf("/updatePassword?");

  // Extract the substring starting from the index of "/auth"
  const extractedUrl = currentUrl.substring(authIndex);

 


  const payload = {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
    token: token,
  };

  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: "15px",
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    // Trim whitespaces from passwords
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
  
    // Check if either password is empty or they don't match
    if (trimmedNewPassword === "" || trimmedConfirmPassword === "") {
      showSnackbar("Please enter your new password and confirm password", "error", "top");
      return;
    } else if (trimmedNewPassword !== trimmedConfirmPassword) {
      showSnackbar("Passwords do not match", "error", "top");
      return;
    }
  
    
      await axiosInstanceWithoutToken.post(
        BACKEND_URL + "/auth/update-password",
        payload
      ).then((response) => {
       
        if(response?.data.message=="Password reset successfully.")
        {
          showSnackbar("Password reset successfully.", "success", "top")
          navigate(response.data.redirectTo,{replace:true});
        }
        
      }).finally(() => {

      });
  
      
   
      
  };
  

  

  return (
    <>
      
        <>
          <CardBody className="flex flex-col gap-4 w-full">
            <InputButton
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPaasword(e.target.value)}
            />
            <InputButton
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
           
          </CardBody>
          <CardFooter className="pt-0 flex flex-col w-[80%]">
            <Button style={buttonColor} onClick={updatePassword}>
              Submit
            </Button>
          </CardFooter>
        </>
      
    </>
  );
}

export default Password;
