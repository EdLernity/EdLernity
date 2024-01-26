import React from "react";
import {
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import InputButton from "../Input/InputButton";
import { Link } from "react-router-dom";

function Login() {
  const textColor = {
    color: "#181FC5",
  };
  const buttonColor = {
    background: "#181FC5",
    color: "white",
    borderRadius: '15px'
  };

  return (
    <div className="flex justify-center items-center xl:w-2/4 md:w-2/4">
        <div className="p-6 w-full flex justify-center items-center flex-col">
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
            <p
              className="flex justify-center font-bold font-sans"
            >
              <span className="flex justify-center w-1/6 rounded-full border border-[#607d8b]" style={textColor}>or</span>
            </p>
            <InputButton fullWidth label="Email" type="email"/>
            <InputButton fullWidth label="Password" type="password"/>
            <div className="-ml-2.5 flex">
              <Checkbox label="Remember Me" />
              <Link className="flex items-center ml-12">Forget Password?</Link>
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col">
            <Button style={buttonColor}>Log in</Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don&apos;t have an account?
              <Typography
                as="a"
                href="/auth/signup"
                variant="small"
                style={textColor}
                className="ml-1 font-bold"
              >
                Create Account
              </Typography>
            </Typography>
          </CardFooter>
        </div>
    </div>
  );
}

export default Login;
