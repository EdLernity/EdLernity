import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../URL_Config";
import { showSnackbar } from "../Utils/enQueSnackBar";
import FreeCourse from "./5562402_21421.svg";
function Payment() {
  let navigation = useNavigate();
  const location = useLocation();
  const { course,enrollingAllCourses } = location?.state ?? {};

  
  const [ccode, setCcode] = useState("");
  const [couponStatus, setCouponStatus] = useState();
  const [couponData, setCouponData] = useState();
  
  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigation('/auth/login',{replace:true});
    }
  }, [navigation]);
  const initPayment = (data,user,enrollingAllCourses) => {
    
    var options = {
      key: "rzp_live_VAGF8Cc0ors5Zj",
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      description: enrollingAllCourses?"EdLernity's Lifetime subscription":course.courseTitle,
      image: "https://edlernity.s3.ap-south-1.amazonaws.com/Logo.svg",
      prefill: {
        name:user.firstName,
        email: user.email,
        contact: user.phone
      },
      handler: async (response) => {
        //////console.log('response',response)
        try {
          const CEdata = {
            courseId: enrollingAllCourses?"lifeTimeFinalPrice":course._id,
            response,
          };
          const { data } = await axios.post(
            BACKEND_URL + "/api/v1/enroll/verify",
            CEdata,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("_userAuth"),
              },
            }
          );
          //////console.log(data)
          if (data.message === "Payment verified successfully") {
            window.location.replace("/mycourses");
          }
        } catch (error) {
          ////console.log("error",error)
        }
      },
    };
    //////console.log(options)
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  const handlePayment = (enrollingAllCourses) => {
    if(enrollingAllCourses)
    {
      const data = {
        courseId: "lifeTimeFinalPrice",
        enrollingAllCourses:true
      };
      //////console.log(data)
      
      const token = localStorage.getItem("_userAuth");
    axios.post(BACKEND_URL+"/api/v1/enroll/add", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then((response) => {
          // ////console.log(response)
          if (response.data.data === "enrolled") {
            window.location.replace("/encourses");
          }
  
          initPayment(response.data.data,response.data.userData,enrollingAllCourses);
        })
        .catch((error) => {
          //console.log(error)
        });
    }
    else{
    const data = {
      courseId: course._id,
    };
    //////console.log(data)
    const token = localStorage.getItem("_userAuth");
    axios.post(BACKEND_URL+"/api/v1/enroll/add", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      // ////console.log(response)
      if (response.data.data === "enrolled") {
        window.location.replace("/encourses");
      }
    
      initPayment(response.data.data, response.data.userData, enrollingAllCourses);
    })
    .catch((error) => {
      //console.log(error)
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
    });
    }
  };

  return (
    <div class="py-16">
      <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div class="mb-12 space-y-2 text-center">
          <h2 class="text-2xl text-cyan-900 font-bold md:text-4xl">Checkout</h2>
        </div>

        {course&&<div class="mt-8 lg:-mx-6 lg:flex lg:items-center">
          <img
            class="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-[30rem]"
            src={course?.courseBanner}
            alt=""
          />

          <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
            <span
              href="#"
              class="block mt-4 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl"
            >
              {course?.courseTitle}
            </span>
            <div class="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
          <div class="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div class="flex justify-between w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">&#8377;{course?.initialPrice}</p>
            </div>
            <div class="flex justify-between items-center w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Discount</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">{course?.discountInPercentage}%</p>
            </div>
            
          </div>
          <div class="flex justify-between items-center w-full">
            <p class="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
            <p class="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">&#8377;{course?.offeredPrice}</p>
          </div>
        </div>
            <div class="pl-0 p-5">
              <div class="space-y-2">
                <div class="space-y-4">
                  

                  <div class="flex justify-end">
                    <p
                      onClick={() => handlePayment()}
                      title="Checkout"
                      class="w-max py-3 px-12 text-center rounded-xl transition bg-white shadow-md hover:bg-purple-100 active:bg-purple-200 focus:bg-purple-100"
                    >
                      <span class="text-purple-600 font-semibold cursor-pointer">
                        Proceed to Pay
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
        {(!course&&enrollingAllCourses)&&<div class="mt-8 lg:-mx-6 lg:flex lg:items-center">
          <img
            class="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96"
            src={FreeCourse}
            alt="Test"
          />

          <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
            <div class="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          {/* <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3> */}
            <span
            
              class="block mt-4 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl"
            >
              EdLernity's Lifetime subscription
            </span>
          <div class="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            
            
            
          </div>
          <div class="flex justify-between items-center w-full">
            <p class="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
            <p class="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">&#8377;689</p>
          </div>
        </div>
            <div class="pl-0 p-5">
              <div class="space-y-2">
                <div class="space-y-4">
                  

                  <div class="flex justify-end">
                    <p
                      onClick={() => handlePayment(enrollingAllCourses)}
                      title="Checkout"
                      class="w-max py-3 px-12 text-center rounded-xl transition bg-white shadow-md hover:bg-purple-100 active:bg-purple-200 focus:bg-purple-100"
                    >
                      <span class="text-purple-600 font-semibold cursor-pointer">
                        Proceed to Pay
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
      <div class="py-24 bg-gradient from-green-50 to-cyan-100"> </div>
    </div>
  );
}

export default Payment;
