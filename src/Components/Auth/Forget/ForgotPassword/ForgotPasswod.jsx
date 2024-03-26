import { Button } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../../URL_Config";
import InputButton from "../../../Input/InputButton";
import { showSnackbar } from "../../../Utils/enQueSnackBar";

function ForgotPasswod({onResponse}) {
  const [email,setEmail] = useState('');
  let payload = {
    email : email
  }
  const textColor = {
    color: "#1539cf",
  };
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: "15px",
  };
  
  const handleForgetPassword = async () => {
    try {
      if(email.trim().length===0)
      {
        showSnackbar("Please enter email","error","top")
        return;
      }
      let res = await axios.post(BACKEND_URL+"/auth/reset-password", payload);
     
  
      if (res.status === 200) {
        onResponse(res);
      } else {
        // Handle non-200 status codes or other conditions
        onResponse(res);
      }
    } catch (error) {
      // Handle the error gracefully (e.g., show an error message to the user)
      console.error("Error during reset password request:", error);
      onResponse(error.response.data);
    }
  };
  
  return (
    <>
      <InputButton type="email" fullWidth="true" label="email" value={email} onChange={(e) =>  setEmail(e.target.value)} />
        <Button
          fullWidth={true}
          rounded="true"
          onClick={handleForgetPassword}
          style={buttonColor}
        >
          Submit
        </Button>
        <div className=" flex items-center justify-between">
          <Link to="/auth/login">
            <p
              className="flex items-center gap-x-2 text-richblack-5"
              style={textColor}
            >
              <BiArrowBack /> Back To Login
            </p>
          </Link>
        </div>
    </>
  )
}

export default ForgotPasswod