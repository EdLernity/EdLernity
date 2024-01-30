import React from "react";
import {
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import InputButton from "../../Input/InputButton";

function UpdatePassword() {
  const textColor = {
    color: "#1539cf",
  };
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: '15px'
  };

  return (
    <div className="flex justify-center items-center xl:w-2/4 md:w-2/4">
        <div className="p-6 w-full flex justify-center items-center flex-col">
          <CardBody className="flex flex-col gap-4 w-full">
            <InputButton fullWidth label="New Password" type="password"/>
            <InputButton fullWidth label="Confirm Password" type="password"/>
            <div className="-ml-2.5 flex ">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col w-[80%]">
            <Button style={buttonColor}>Submit</Button>
          </CardFooter>
        </div>
    </div>
  );
}

export default UpdatePassword;
