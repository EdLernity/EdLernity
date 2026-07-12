import axios from "axios";

import { showSnackbar } from "../Components/Utils/enQueSnackBar";
import { BACKEND_URL } from "../URL_Config";

function getStoredToken() {
  const token = localStorage.getItem("_userAuth");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
}

export const axiosInstanceWithoutToken = axios.create({
  baseURL: BACKEND_URL,
});

export const apiInstancePrivate = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

apiInstancePrivate.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
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
    } else if (
      errorMessage === "Error updating password." ||
      errorMessage === "Your link has already used. Please try to generate again."
    ) {
      window.location.replace(error.response.data.redirectTo);
    }
  }
);

apiInstancePrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipAuthRedirect = Boolean(error.config?.skipAuthRedirect);
    const skipErrorToast = Boolean(error.config?.skipErrorToast);
    const errorMessage = error.response?.data?.message;

    if (!skipErrorToast && errorMessage) {
      showSnackbar(errorMessage, "error", "top");
    }

    if (
      !skipAuthRedirect &&
      errorMessage === "Session Expired" &&
      getStoredToken()
    ) {
      window.location.replace("/auth/login");
      localStorage.clear();
      sessionStorage.clear();
    }

    return Promise.reject(error);
  }
);
