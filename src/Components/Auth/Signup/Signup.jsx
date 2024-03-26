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
import { FcGoogle } from "react-icons/fc";
import { BACKEND_URL } from "../../../URL_Config";
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
        let res = await axios.post(BACKEND_URL+"/auth/register", data);
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
      try {
        let googleSignInData = {
          firstName:response.data.given_name,
          lastName:response.data.family_name,
          email:response.data.email,
          googleSignUp:true
        };
        let res = await axios.post(BACKEND_URL+"/auth/register", googleSignInData);
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
    });

    },
  });

  return (
    <div className="block md:flex xl:flex justify-center items-center xl:w-2/4 md:w-2/4">
      <div className="p-6 w-full block md:flex xl:flex justify-center items-center flex-col">
        {isResgisterSucess ? (
          <SucessPage req={req} />
        ) :  isError ? (
          <ErrorComponent setErrorValue={setErrorValue} req={req} />
        ) : (
          <>
            <CardBody className="flex flex-col gap-4">
              <Button
               onClick={() => googleSignUp()}
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
              <div className="grid flex-col md:flex-row xl:flex-row gap-3 items-end md:flex xl:flex ">
                <div>
                <InputButton
                  fullWidth
                  label="First Name"
                  type="text"
                  required
                  value={firstName}
                  error={firstNameError}
                  onChange={handleFirstNameChange}
                />
                </div>
                <div>
                <InputButton
                  fullWidth
                  label="Last Name"
                  type="text"
                  value={lastName}
                  error={lastNameError}
                  onChange={handleLastNameChange}
                />
                </div>
              </div>
              <div className="flex flex-col gap-3">
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
                  label="Phone no."
                  type="tel"
                  value={phone}
                  error={phoneNumberError}
                  onChange={handlePhoneChange}
                />
              </div>
              <div className="w-full flex flex-col xl:flex-row gap-3">
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
              <div className="-ml-2.5 flex">
                <Checkbox
                  onChange={(e) => setTermsAndConditions(e.target.checked)}
                  label="Terms and condition"
                />
              </div>
            </CardBody>
            <CardFooter className="pt-0 flex flex-col">
              <Button
                style={buttonColor}
                onClick={handleSignup}
                disabled={!termsAndConditions}
              >
                Sign up
              </Button>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
