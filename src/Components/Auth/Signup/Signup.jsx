import {
  Button,
  CardBody,
  CardFooter,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosInstanceWithoutToken } from "../../../Utils/AxiosInstance";
import InputButton from "../../Input/InputButton";
import SucessPage from "../SuccessPage/SuccessPage";
import ErrorComponent from "../UpdatePassword/ErrorComponent/ErrorComponent";

function Signup() {
  const textColor = {
    color: "#1539cf",
  };
  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: "15px",
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [isResgisterSucess, setIsResgisterSucess] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [isError,setIsError] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setTermsAndConditions(false);
    setError(""); // Clear any error message
  };

  const handleFirstNameChange = (event) => {
    if (event && event.target) {
      const inputValue = event.target.value;
      setFirstName(inputValue);

      // Perform first name validation
      if (inputValue.trim() === "") {
        setFirstNameError("First name is required");
      } else {
        setFirstNameError("");
      }
    }
  };
  const handleLastNameChange = (event) => {
    if (event && event.target) {
      const inputValue = event.target.value;
      setLastName(inputValue);

      // Perform last name validation
      if (inputValue.trim() === "") {
        setLastNameError("Last name is required");
      } else {
        setLastNameError("");
      }
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
  const handlePhoneChange = (event) => {
    if (event && event.target) {
      const inputValue = event.target.value;
      setPhone(inputValue);

      // Perform phone number validation
      const phoneNumberPattern = /^\d{10}$/; // Assuming a 10-digit phone number
      if (!phoneNumberPattern.test(inputValue)) {
        setPhoneNumberError("Please enter a valid 10-digit phone number");
      } else {
        setPhoneNumberError("");
      }
    }
  };

  const handleSignup = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError('');
      try {
        let res = await axiosInstanceWithoutToken.post("/auth/register", data);
        setResponseData(res.data);
        if (res?.data?.success) {
          setIsResgisterSucess(true);
        }
      } catch (error) {
        console.error("Error during signup:", error.message);
        setIsError(true);
        setError(error?.response?.data?.message)
        setResponseData(error?.response?.data);
      }
    }
  };

  useEffect(() => {}, [responseData]);

  const req = {
    message: responseData?.message,
    path: responseData?.redirectTo,
    text : responseData?.text
  };

  let data = {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    googleSignUp:false
  };

  const setErrorValue = (val) => {
    resetForm();
    setIsError(val)
  }
  const googleSignUp = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await axios
    .get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    })
    .then(async (response)=>{
      
        let googleSignInData = {
          firstName:response.data.given_name,
          lastName:response.data.family_name,
          email:response.data.email,
          googleSignUp:true
        };
        let res = await axiosInstanceWithoutToken.post("/auth/register", googleSignInData);
        setResponseData(res.data);
        if (res?.data?.success) {
          window.location.replace("/auth/login")
        }
      
    });

    },
  });

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="w-full flex flex-col justify-center">
        {isResgisterSucess ? (
          <SucessPage req={req} />
        ) :  isError ? (
          <ErrorComponent setErrorValue={setErrorValue} req={req} />
        ) : (
          <>
            {/* Header */}
            <div className="text-center md:text-left mb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">Create Account</h2>
              <p className="text-sm text-slate-500 font-medium">Join EdLernity to start your learning journey</p>
            </div>

            <div className="space-y-4">
              {/* Google Button */}
              <Button
                onClick={() => googleSignUp()}
                size="lg"
                variant="outlined"
                color="blue-gray"
                className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 hover:bg-slate-50/80 rounded-2xl transition-all font-bold text-sm tracking-wide shadow-sm normal-case"
              >
                <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <span className="text-slate-700">Continue with Google</span>
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="h-px flex-grow bg-slate-100"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                <div className="h-px flex-grow bg-slate-100"></div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <InputButton
                  fullWidth
                  label="First Name"
                  type="text"
                  required
                  value={firstName}
                  error={firstNameError}
                  onChange={handleFirstNameChange}
                />
                <InputButton
                  fullWidth
                  label="Last Name"
                  type="text"
                  value={lastName}
                  error={lastNameError}
                  onChange={handleLastNameChange}
                />
              </div>

              {/* Email & Phone */}
              <div className="space-y-4">
                <InputButton
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  error={emailError}
                  onChange={handleEmailChange}
                />
                <InputButton
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  error={phoneNumberError}
                  onChange={handlePhoneChange}
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputButton
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputButton
                  error={error}
                  fullWidth
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  onChange={(e) => setTermsAndConditions(e.target.checked)}
                  id="terms"
                  className="rounded-md border-slate-300 text-[#181FC5] focus:ring-[#181FC5]"
                />
                <label htmlFor="terms" className="text-xs text-slate-500 font-semibold cursor-pointer">
                  I agree to the Terms & Conditions
                </label>
              </div>

              {/* Sign Up Button */}
              <div className="pt-2">
                <Button
                  className="w-full py-4 text-white font-bold bg-gradient-to-r from-[#181FC5] to-[#4F46E5] rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-base normal-case"
                  onClick={handleSignup}
                  disabled={!termsAndConditions}
                >
                  Sign up
                </Button>
              </div>

              {/* Already have account */}
              <div className="text-center pt-2">
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account?{' '}
                  <a href="/auth/login" className="font-bold text-[#181FC5] hover:underline ml-1">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
