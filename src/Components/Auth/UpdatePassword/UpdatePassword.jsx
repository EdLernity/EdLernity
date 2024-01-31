import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Password from "./Password/Password";
import ErrorPage from "../ErrorPage/ErrorPage";
import ErrorComponent from "./ErrorComponent/ErrorComponent";

function UpdatePassword() {
  const [error, setError] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);
  const token = queryParam.get("token");

  let errorMsg;

  let tokenPayload = {
    token: token,
  };

  const divStyle = {
    paddingBottom: "100px",
  };

  useEffect(() => {
    const validateLink = async () => {
      if (token) {
        try {
          let response = await axios.post(
            "http://localhost:3001/auth/verify-token",
            tokenPayload
          );

          console.log(response)

          if (response.status === 200) {
            setIsValidLink(true);
          } else {
            errorMsg = response.data.message
            setIsValidLink(false)
            setError(true);
          }
        } catch (error) {
          console.error("Error during token verification:", error);
          setError(true);
        }
      }
    };

    validateLink();
  }, [token]);

  return (
    <div
      className="flex justify-center items-center xl:w-2/4 md:w-2/4"
      style={error ? divStyle : {}}
    >
      <div className="p-6 w-full flex justify-center items-center flex-col">
        {isValidLink ? <Password /> : <ErrorComponent error={errorMsg} />}
      </div>
    </div>
  );
}

export default UpdatePassword;
