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

function UpdatePassword() {
  const [newPassword,setNewPaasword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);

  const token = queryParam.get('token')

  console.log(token);

  const payload = {
    newPassword : newPassword,
    confirmPassword: confirmPassword,
    token:token
  }
  
  let tokenPayload = {
    token : token
  }

  const textColor = {
    color: "#1539cf",
  };
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: '15px'
  };

  (async function verifyUser (){
    if(token){
      let response = await axios.post("http://localhost:3001/auth//verify-token",tokenPayload);
    }
  })();

  const handleUpdate = async (e) => {

    e.preventDefault();
    
    let res = await axios.post("http://localhost:3001/auth/update-password",payload);

    console.log(res)

    if (res.status === 200) {
      console.log("Success");
      alert("Your password has been updated successfully!");
      location.reload()
    }
  };

  return (
    <div className="flex justify-center items-center xl:w-2/4 md:w-2/4">
        <div className="p-6 w-full flex justify-center items-center flex-col">
          <CardBody className="flex flex-col gap-4 w-full">
            <InputButton fullWidth label="New Password" type="password" value={newPassword} onChange={(e) =>  setNewPaasword(e.target.value)}/>
            <InputButton fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <div className="-ml-2.5 flex ">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col w-[80%]">
            <Button style={buttonColor} onClick={handleUpdate}>Submit</Button>
          </CardFooter>
        </div>
    </div>
  );
}

export default UpdatePassword;
