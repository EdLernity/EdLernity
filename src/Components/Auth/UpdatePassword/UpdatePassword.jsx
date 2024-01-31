import React from "react";
import PasswordComponent from "./PasswordComponent/PasswordComponent";
import ErrorComponent from "./ErrorComponent/ErrorComponent";

function UpdatePassword() {
    let isSucess=false
  return (
    <div className="flex justify-center items-center xl:w-2/4 md:w-2/4 pb-24">
        <div className="p-6 w-full flex justify-center items-center flex-col">
          {isSucess ? <PasswordComponent/> : <ErrorComponent/>}
        </div>
    </div>
  );
}

export default UpdatePassword;
