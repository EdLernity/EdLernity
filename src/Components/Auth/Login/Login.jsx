import {
  Button,
  CardBody,
  CardFooter,
  Typography
} from "@material-tailwind/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const { course } = location?.state ?? {};
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
        let res = await axiosInstanceWithoutToken.post("/auth/login", googleSignInData);
        
        if (res?.data?.success) {
          localStorage.setItem("_userAuth", res?.data?.token);
          showSnackbar("Login Successful", "success", "top");

          navigate(redirectUrl)
          navigate(redirectUrl, {
            state: {course:course }
        });
        }
      } catch (error) {
        console.error("Error during signup:", error.response.message);
       
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
    password: password,
    googleSignUp:false
  }

  const handleSignup = async () => {
    if(email.trim().length===0 || password.trim().length===0|| password.trim().length<8)
    {
      showSnackbar("Please enter email and password","info","top");
      return;
    }
      handlePassord(data.password);
      try {
        let res = await axiosInstanceWithoutToken.post("/auth/login", data);
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
           
              <svg className="flex text-xs mt-px mr-0.5 w-6 h-6" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
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
              <Typography as='a' href="/auth/reset" className="flex items-center ml-5 font-bold" style={textColor}>Forget Password?</Typography>
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
