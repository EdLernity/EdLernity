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
import { Link } from "react-router-dom";
function Signup() {
  const textColor = {
    color: "#1539cf",
  };
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: "15px",
  };

  return (
    <div className="block md:flex xl:flex justify-center items-center xl:w-2/4 md:w-2/4">
      <div className="p-6 w-full block md:flex xl:flex justify-center items-center flex-col">
        <CardBody className="flex flex-col gap-4">
          <Button
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="flex items-center gap-2 justify-center"
          >
            <FcGoogle className="flex text-xs mt-px mr-0.5" />
            Continue With Google
          </Button>
          <p className="flex justify-center font-bold font-sans">
            <span
              className="flex justify-center w-1/6 rounded-full border border-[#607d8b]"
              style={textColor}
            >
              or
            </span>
          </p>
          <div className="flex flex-col md:flex-row xl:flex-row gap-3">
            <InputButton fullWidth label="First Name" type="text" />
            <InputButton fullWidth label="Last Name" type="text" />
          </div>
          <div className="flex flex-col gap-3">
            <InputButton fullWidth label="Email" type="email" />
            <InputButton fullWidth label="Phone no." type="number" />
          </div>
          <div className="w-full flex flex-col xl:flex-row gap-3">
            <InputButton fullWidth label="Password" type="password" />
            <InputButton fullWidth label="Confirm password" type="password" />
          </div>
          <div className="-ml-2.5 flex">
            <Checkbox label="Terms and condition" />
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex flex-col">
          <Button style={buttonColor}>Sign up</Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              href="/auth/login"
              variant="small"
              style={textColor}
              className="ml-1 font-bold"
            >
              Login
            </Typography>
          </Typography>
        </CardFooter>
      </div>
    </div>
  );
}

export default Signup;
