import React, { useState, useEffect } from "react";
import ForgotPasswod from "./ForgotPassword/ForgotPasswod";
import SucessPage from "../SuccessPage/SuccessPage";
import ErrorComponent from "../UpdatePassword/ErrorComponent/ErrorComponent";

const ForgetPasswordComponent = () => {
  const [showUi, setShowUi] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [responseData, setResponseData] = useState({});

  const handleChildResponse = async (data) => {
    console.log(data)
    if (data.status === 200) {
      setShowUi(!showUi);
      setSuccess(true);
      setResponseData(data.data);
    } else {
      setResponseData(data);
      setShowUi(!showUi);
      setError(true);
    }
  };

  useEffect(() => {
    console.log(responseData);
  }, [responseData]);

  const req = {
    message: responseData.message,
    path: responseData.redirectTo, 
    text: responseData.text,
  };

  const setErrorValue = (val) => {
    setError(val)
    setShowUi(!showUi);
  }

  return (
    <div className="flex justify-center items-center xl:w-2/5 md:w-2/4">
      <div className="p-6 w-full flex justify-center items-center flex-col gap-6">
        {showUi ? (
          <ForgotPasswod onResponse={handleChildResponse} />
        ) : error ?(
          <ErrorComponent setErrorValue={setErrorValue} req={req} />
        ) : success ? (
          <SucessPage req={req} />
        ) : ""}
      </div>
    </div>
  );
};

export default ForgetPasswordComponent;
