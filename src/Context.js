import React, { createContext, useEffect, useState } from "react";
import { apiInstancePrivate } from "./Utils/AxiosInstance";

export const Store = createContext();
export const Context = ({ children }) => {
  const [profile, setProfile] = useState();
  const [userProfile, setUserProfile] = useState();
  const [myCourses, setCourses] = useState([]);
  const [enrolledList, setEnrolledList] = useState([])
  
  let isLogin = false;
  const Token = localStorage.getItem("_userAuth");
 
  if (Token !== null) {
    if (Token.length >= 200) {
      isLogin = true;
    }
  } else {
    isLogin = false;
  }
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };
  useEffect(() => {
   if(isLogin)
   {
     apiInstancePrivate.get("/api/v1/enroll/fetch").then((response) => {
    console.log(response);
    setProfile(response.data[0].userId);
    setCourses(response.data[0].courseIds)
     }).catch((error) => {

     })
     apiInstancePrivate.get("/api/v1/enroll/check-enrollment").then((response) => {
      console.log(response);
      setEnrolledList(response.data.enrollList)
      
       }).catch((error) => {
  
       })
     apiInstancePrivate.get("/auth/user-details").then((response) => {
       
        setUserProfile(response.data.user)
         }).catch((error) => {
    
         })
   }
  }, []);





  return (
    <Store.Provider
      value={{
        
        profile,
        handleLogout,
        myCourses,
        userProfile,
        enrolledList
        
      }}
    >
      {children}
    </Store.Provider>
  );
};
