
import React, { useContext, useEffect, useRef, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Context.js";
import BaseLayout from "../../Layout/BaseLayout.jsx";
import { BACKEND_URL } from "../../URL_Config.js";
import { apiInstancePrivate } from "../../Utils/AxiosInstance.js";




function MyCourses() {

const {myCourses,profile,userProfile}=useContext(Store);
const [userData, setUserData] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [courseId, setCourseId] = useState("")
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const courseIdRef = useRef(null);
  // Catch Rating value
  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigate('/auth/login',{replace:true});
    }
  }, [navigate]);
  const handleRating = (courseId,rating) => {
    //console.log(rating)
    apiInstancePrivate.post(BACKEND_URL+"/api/v1/course/rate-course",{courseId:courseId, rating:rating}).then((res)=>{
    //console.log(res)
    }).catch((err) => {
      //console.log(err)
    }).finally(()=>{

    })
    

    // other logic
  }
  // Optinal callback functions

  const handleClick = (course) => {
    navigate(`/mycourses/${course._id}`, {
      state: { course },
    });
  };


  


  return (
    <BaseLayout>
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Hi {userProfile?.firstName},</h1>
       
      </div>
      <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
        <p class="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">{myCourses.length==0?"No Courses Enrolled":"Enrolled Courses"}</p>
          
        {myCourses.map((course, index) => (
  <div key={index} class="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
    <div class="pb-4 md:pb-8 w-full md:w-40">
      <img class="w-full hidden md:block" src={course.courseBanner} alt="dress" />
      <img class="w-full md:hidden" src={course.courseBanner} alt="dress" />
    </div>
    <div class="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
      <div class="w-full flex flex-col justify-start items-start space-y-8">
        <h3 class="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{course.courseTitle}</h3>
        <div class="flex justify-start items-start flex-col space-y-2">
          <div class="flex justify-end gap-4">
           
           
          </div>
          <p class="text-sm dark:text-white leading-none text-gray-800" ></p>
          <p class="text-sm dark:text-white leading-none text-gray-800"></p>
          <input ref={courseIdRef} type="hidden" value={course.id} />
        </div>
      </div>
      <div class="flex justify-between space-x-8 items-start w-full">
        <p class="text-base dark:text-white xl:text-lg leading-6"></p>
        <p onClick={() => handleClick(course)} class="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-center inline-flex items-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to Course
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            viewBox="0 0 24 24" class="w-6 h-6 ml-2">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </p>
      </div>
    </div>
  </div>
))}

        
          {/* <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:p-6 xl:p-8 w-full">
          
          </div> */}
          
        </div>
        
      </div>
     
      
    </div>
    </BaseLayout>
  );
}

export default MyCourses;
