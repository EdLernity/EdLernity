import React, { useState, useEffect } from "react";
import ForgotPasswod from "./ForgotPassword/ForgotPasswod";
import SucessPage from "../SuccessPage/SuccessPage";
import ErrorComponent from "../UpdatePassword/ErrorComponent/ErrorComponent";

const ForgetPasswordComponent = () => {
  const [showUi, setShowUi] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [responseData, setResponseData] = useState({});

  const handleChildResponse = async (response) => {
    const {data} = response
    setResponseData(data);
    if (response.status === 200) {
      console.log(response);
      setShowUi(!showUi);
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    console.log(responseData);
  }, [responseData]);

  console.log(responseData)

  const req = {
    success: responseData.message,
    path: "",
  };

  return (
    <div className="flex justify-center items-center xl:w-2/5 md:w-2/4">
      <div className="p-6 w-full flex justify-center items-center flex-col gap-6">
        {showUi ? (
          <ForgotPasswod onResponse={handleChildResponse} />
        ) : success ? (
          <SucessPage req={req} />
        ) : (
          <ErrorComponent error={"error"} />
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordComponent;
