import React, { useState } from "react";
import {
  CardBody,
  CardFooter,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InputButton from "../../../Input/InputButton";
import ErrorComponent from "../ErrorComponent/ErrorComponent";

function Password() {
  const [newPassword, setNewPaasword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseData, setResponseData] = useState({});
  const location = useLocation();
  const [error, setError] = useState(false);

  const queryParam = new URLSearchParams(location.search);

  const token = queryParam.get("token");

  const { pathname, search, hash } = location;

  // Combine them to form the current URL
  const currentUrl = pathname + search + hash;

  const authIndex = currentUrl.indexOf("/updatePassword?");

  // Extract the substring starting from the index of "/auth"
  const extractedUrl = currentUrl.substring(authIndex);

  console.log(extractedUrl);

  localStorage.setItem('url',extractedUrl)

  console.log(currentUrl);

  const payload = {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
    token: token,
  };

  const buttonColor = {
    background: "#1539cf",
    color: "white",
    borderRadius: "15px",
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    try {
      let res = await axios.post(
        "http://3.110.210.79:3001/auth/update-password",
        payload
      );

      // console.log(res)

      if (res.status === 200) {
        setResponseData(res.response.data.message);
        setError(false);
        console.log("Success");
      }
    } catch (err) {
      console.log(err);
      setResponseData(err.response.data);
      setError(true);
    }
  };

  console.log(responseData);

  let path = localStorage.getItem("url");

  const req = {
    message: responseData.message,
    path: path,
    text: responseData.text,
  };

  const setErrorValue = (val) => {
    setError(val);
  };

  console.log(req);

  return (
    <>
      {error ? (
        <ErrorComponent setErrorValue={setErrorValue} req={req} />
      ) : (
        <>
          <CardBody className="flex flex-col gap-4 w-full">
            <InputButton
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPaasword(e.target.value)}
            />
            <InputButton
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="-ml-2.5 flex ">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0 flex flex-col w-[80%]">
            <Button style={buttonColor} onClick={updatePassword}>
              Submit
            </Button>
          </CardFooter>
        </>
      )}
    </>
  );
}

export default Password;
