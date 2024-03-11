import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Password from "./Password/Password";
import ErrorComponent from "./ErrorComponent/ErrorComponent";

function UpdatePassword() {
  const [error, setError] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [responseData, setResponseData] = useState({});
  const location = useLocation();

  const queryParam = new URLSearchParams(location.search);
  const token = queryParam.get("token");
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
            "http://3.110.210.79:3001/auth/verify-token",
            tokenPayload
          );

          if (response.status === 200) {
            setResponseData(response?.data);
            setIsValidLink(true);
          } else {
            setResponseData(response?.data?.message);
            setIsValidLink(false)
            setError(true);
          }
        } catch (error) {
          console.log(error);
          setIsValidLink(false)
          setResponseData(error?.response?.data);
          setError(true);
        }
      }
    };

    validateLink();
  }, [token]);

  console.log(responseData)
  const req ={ 
    message : responseData.message,
    path : responseData.redirectTo,
    text : responseData.text
  }

  const setErrorValue = (val) => {
    setError(val)
  }

  return (
    <div
      className="flex justify-center items-center xl:w-2/4 md:w-2/4"
      style={error ? divStyle : {}}
    >
      <div className="p-6 w-full flex justify-center items-center flex-col">
        {isValidLink ? <Password /> : <ErrorComponent setErrorValue={setErrorValue} req={req} />}
      </div>
    </div>
  );
}

export default UpdatePassword;
