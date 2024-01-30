import React from "react";
import {
  CardBody,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import InputButton from "../../Input/InputButton";

function UpdatePassword() {
  
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: '15px'
  };

  return (
    <div className="flex justify-center items-center xl:w-2/5 md:w-2/4">
        <div className="p-6 w-full flex justify-center items-center flex-col">
          <CardBody className="flex flex-col gap-4 w-full">
            <InputButton fullWidth label="New Password" type="password"/>
            <InputButton fullWidth label="Confirm Password" type="password"/>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col w-[80%]">
            <Button style={buttonColor}>Submit</Button>
          </CardFooter>
        </div>
    </div>
  );
}

export default UpdatePassword;
