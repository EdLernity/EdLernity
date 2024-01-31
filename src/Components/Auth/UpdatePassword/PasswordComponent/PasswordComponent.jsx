import React from 'react'
import {
    CardBody,
    CardFooter,
    Button,
  } from "@material-tailwind/react";
  import InputButton from "../../../Input/InputButton.jsx";
    
function PasswordComponent() {
     
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: '15px'
  }

  return (
    <>
    <CardBody className="flex flex-col gap-4 w-full">
    <InputButton fullWidth label="New Password" type="password"/>
    <InputButton fullWidth label="Confirm Password" type="password"/>
  </CardBody>
  <CardFooter className="pt-0 flex flex-col w-[80%]">
    <Button style={buttonColor}>Submit</Button>
  </CardFooter>
    </>
  )
}

export default PasswordComponent