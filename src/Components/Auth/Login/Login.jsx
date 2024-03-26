import {
  Button,
  CardBody,
  CardFooter,
  Typography
} from "@material-tailwind/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../URL_Config";
import { axiosInstanceWithoutToken } from "../../../Utils/AxiosInstance";
import InputButton from "../../Input/InputButton";
import { showSnackbar } from "../../Utils/enQueSnackBar";
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
  const location = useLocation();
  const redirectUrl = location?.state?.redirectUrl || '/';
  const handlePassord = (password) => {
    if ( password.length <8 ) {
      setPasswordError('Minimum 8  characters are required');
    } else {
      setPasswordError("")
      setPassword(password);
    }
  };

   const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await axios
    .get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    })
    .then(async (response)=>{
      try {
        let googleSignInData = {
          email:response.data.email,
          googleSignUp:true
        };
        let res = await axios.post(BACKEND_URL+"/auth/login", googleSignInData);
        
        if (res?.data?.success) {
          localStorage.setItem("auth_token", res?.data?.token);
          showSnackbar("Login Successful", "success", "top");

          navigate(redirectUrl)
        }
      } catch (error) {
        console.error("Error during signup:", error.message);
       
      }
    });

    },
  });

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
        let res = await axiosInstanceWithoutToken.post(BACKEND_URL+"/auth/login", data);
        if (res?.data?.success) {
          localStorage.setItem("_userAuth", res?.data?.token);
          showSnackbar("Login Successful", "success", "top");

          navigate(redirectUrl)
        }
      } catch (error) {
        console.error("Error during signup:", error.message);
        return <ErrorComponent error={error.message} />;
    }
  };

  return (
    <div className="flex justify-center items-center xl:w-2/4 md:w-2/4">
        <div className="p-6 w-full flex justify-center items-center flex-col">
          <CardBody className="flex flex-col gap-4 w-full">
            <Button
              size="sm"
              variant="outlined"
              color="blue-gray"
              className="flex items-center gap-2 justify-center"
              onClick={() => login()}
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
              {/* <Checkbox label="Remember Me" /> */}
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
