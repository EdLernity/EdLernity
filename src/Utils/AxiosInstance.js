import axios from "axios";

import { showSnackbar } from "../Components/Utils/enQueSnackBar";
import { BACKEND_URL } from "../URL_Config";

const getApiHeaders = () => {
    const token = localStorage.getItem("_userAuth");
    
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

export const axiosInstanceWithoutToken = axios.create({
  baseURL: BACKEND_URL,
});
export const apiInstancePrivate = axios.create({
  baseURL: BACKEND_URL,
  headers: getApiHeaders(),
});
axiosInstanceWithoutToken.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "An error occurred";
    showSnackbar(errorMessage, "error", "top");
    if (errorMessage === "Account not verified!") {
      window.location.replace("/reverify-email");
    }  else if (
      errorMessage === "Error updating password."||errorMessage === "Your link has already used. Please try to generate again."
    ) {
      window.location.replace(error.response.data.redirectTo);
      
    }
    
    
  }
);

apiInstancePrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "An error occurred";
    showSnackbar(errorMessage, "error", "top");
    if (errorMessage === "Session Expired") {
      window.location.replace("/auth/login");
      localStorage.clear();
      sessionStorage.clear();
    }
  }
);