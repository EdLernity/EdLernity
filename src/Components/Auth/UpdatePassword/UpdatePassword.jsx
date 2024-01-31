import React, { useState } from "react";
import {
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import InputButton from "../../Input/InputButton";
import { useLocation } from 'react-router-dom'
import Password from "./Password/Password";
import ErrorPage from "../ErrorPage/ErrorPage";

function UpdatePassword() {
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);

  console.log("queryParam",queryParam)

  const token = queryParam.get('token')
  // this.token = tokenData;
  console.log("location",location);

    let tokenPayload = {
      token : token
    }

  const isValidateLink = async () => {
    if (token){
      let response = await axios.post("http://localhost:3001/auth//verify-token",tokenPayload);
  
      console.log("Response ===> ",response)
  
      if (response.success === 200){
        return true;
      } else{
        // const error =
        console.log(response)
      }
    }
    return false;
  }

  return (
    <div className="flex justify-center items-center xl:w-2/4 md:w-2/4">
        <div className="p-6 w-full flex justify-center items-center flex-col">
          {isValidateLink() ? <Password/> : <ErrorPage/>}
        </div>
    </div>
  );
}

export default UpdatePassword;
