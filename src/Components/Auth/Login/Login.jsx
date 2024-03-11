import React, { useState } from "react";
import {
  CardBody,
  CardFooter,
  Typography,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import InputButton from "../../Input/InputButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorComponent from "../UpdatePassword/ErrorComponent/ErrorComponent";

function Login() {;
  const textColor = {
    color: "#1539cf",
  };
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: '15px'
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError,setPasswordError] =  useState("");
  const navigate = useNavigate();
  // const history = useHistory();

  const handlePassord = (password) => {
    if ( password.length <8 ) {
      setPasswordError('Senha deve ter no mínimo 8 caracteres');
    } else {
      setPasswordError("")
      setPassword(password);
    }
  };

  const handleEmailChange = (event) => {
    if (event && event.target) {
      const enteredEmail = event.target.value;
      setEmail(enteredEmail);

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(enteredEmail);

      // Set error message based on validation
      setEmailError(isValidEmail ? "" : "Invalid email");
    }
  };

  const data = {
    email : email,
    password: password
  }

  const handleSignup = async () => {
      handlePassord(data.password);
      try {
        let res = await axios.post("http://3.110.210.79:3001/auth/login", data);
        if (res?.data?.success) {
          localStorage.setItem("jwt_token", res?.data?.token);
          alert("login sucess")
          navigate(res?.data?.redirectTo)
        }
      } catch (error) {
        console.error("Error during signup:", error.message);
        return <ErrorComponent error={error.message} />;
    }
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
            <InputButton
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  error={emailError}
                  onChange={handleEmailChange}
            />
            <InputButton
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  error={passwordError}
                  onChange={(e) => setPassword(e.target.value)}
            />
            <div className="-ml-2.5 flex">
              <Checkbox label="Remember Me" />
              <Typography as='a' href="/auth/reset" className="flex items-center ml-12 font-bold" style={textColor}>Forget Password?</Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col">
            <Button style={buttonColor} onClick={handleSignup}>Log in</Button>
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
