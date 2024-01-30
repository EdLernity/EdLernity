import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Button } from "@material-tailwind/react";
import InputButton from "./../../Input/InputButton";
import { Link } from "react-router-dom";
import axios from "axios";

function Forgetpassword() {
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
    let res = await axios.post("http://localhost:3001/auth/reset-password",payload);

    console.log(res)

    if (res.status === 200) {
    }
  };

  return (
    <div className="flex justify-center items-center xl:w-2/5 md:w-2/4">
      <div className="p-6 w-full flex justify-center items-center flex-col gap-6">
        <InputButton type="email" fullWidth="true" label="email" value={email} onChange={(e) =>  setEmail(e.target.value)} />
        <Button
          fullWidth={true}
          rounded={true}
          color="transparent"
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
      </div>
    </div>
  );
}

export default Forgetpassword;
