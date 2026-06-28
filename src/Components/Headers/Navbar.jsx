import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { AlignJustify } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const location = useLocation();
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  const handleLogout = () =>{
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/")
  }
  return (
    <>
      {/* <nav className="flex justify-between items-center border shadow-lg px-4 py-2 bg-white text-black"> */}
      <nav
        class={` border-gray-200 px-1 lg:px-6 py-2.5 mx-auto dark:bg-gray-800 ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div class="flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" class="flex items-center space-x-2">
            <img src="/Image/Logo1.svg" alt="Logo" className="w-10" />
            <span class="self-center text-xl  font-semibold whitespace-nowrap dark:text-white">
              EdLernity
            </span>
          </Link>
          <div class="flex justify-end items-end lg:order-2">
            {/* <IconButton
              onClick={toggleDarkMode}
              className={`bg-${isDarkMode ? "white" : "black"} text-${
                isDarkMode ? "black" : "white"
              } px-4 py-2 rounded-lg me-3 `}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </IconButton> */}
            {/* {localStorage.getItem("_userAuth") ? (
              <Profile />
            ) : ( */}
              <>
                {/* <Link to="/auth/signup" class="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 text-white bg-cyan-700  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 lg:ml-auto">Login</Link> */}

                {localStorage.getItem("_userAuth") ? (<><Link
                  to="/mycourses"
                  className="py-2 px-7 hidden md:block text-white font-bold bg-gradient-to-r hover:-translate-y-1 transition-all duration-500 from-blue-500 to-pink-200 rounded-3xl group relative overflow-hidden"
                >
                  My Courses
                </Link>&nbsp;
                <div onClick={handleLogout} class="group flex cursor-pointer items-center justify-center rounded-3xl bg-[#7c44e3] px-4 py-1 text-white transition">
  <span class="group flex w-full items-center justify-center rounded-xl py-1 text-center font-bold text-white">Logout</span>
  <svg class="flex-0 ml-2 h-5 w-5 transition-all group-hover:ml-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
</div>

 
                </>):(
                <Link
                  to="/auth/login"
                  className="py-2 px-7 hidden md:block text-white font-bold bg-gradient-to-r hover:-translate-y-1 transition-all duration-500 from-blue-500 to-pink-200 rounded-3xl group relative overflow-hidden"
                >
                  Login
                </Link>)}
                <div className="lg:hidden md:hidden">
                  <AlignJustify
                    className="w-8 h-8 cursor-pointer mb-1"
                    onClick={toggleDrawer}
                  />
                </div>
              </>
            {/* )} */}
          </div>
          <div
            class="hidden justify-start items-start w-full lg:flex lg:w-auto  lg:order-1"
            id="mobile-menu-2"
          >
            <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  to="/"
                  class={location.pathname==="/"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  class={location.pathname==="/about"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}

                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/overview"
                  class={location.pathname==="/courses/overview"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                  
                >
                  Courses
                </Link>
              </li>

              <li>
                <Link
                  to="/internship-programs"
                  className={location.pathname==="/internship-programs"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                >
                  Internship Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  class={location.pathname==="/contact"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                  
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  class={location.pathname==="/careers"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  class={location.pathname==="/reviews"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  class={location.pathname==="/blog"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                >
                  EdLernity Academics
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* for small device */}
      <Drawer open={openDrawer} onClose={toggleDrawer} className="">
        <div className="mb-6 p-2 flex items-center justify-between z-[4] ">
          <Link to="/" class="flex items-center space-x-2 pt-2 mx-auto">
            <img src="/Image/Logo1.svg" alt="Logo" className="w-10" />
            <span class="self-center text-xl  font-semibold whitespace-nowrap dark:text-white">
              Edlernity
            </span>
          </Link>
          <IconButton variant="text" color="white" onClick={toggleDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        <div className="mb-8 pr-4 ml-4 text-base  flex flex-col space-y-3">
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/">Home</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/about">About</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/courses/overview">Courses</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/internship-programs">Internship Programs</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/contact">Contact</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/careers">Careers</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/reviews">Reviews</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/blog">EdLernity Academics</NavLink>
          </Typography>
        {localStorage.getItem("_userAuth") ? (
            <>
             <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink to="/mycourses">My Courses</NavLink>
          </Typography>
          <hr className="border border-gray-200" />
          <Typography
            color="gray"
            className="font-bold"
            style={{
              fontFamily: "Tenor Sans, sans-serif",
              textTransform: "uppercase",
              color: "#000",
              fontWeight: "400",
            }}
          >
            <NavLink onClick={handleLogout} >Logout</NavLink>
          </Typography>
          {/* <Link to="/courses/overview" class="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" >Browse Courses</Link> */}
            {/* <Link to="/profile" class="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" >My Profile</Link> */}
            {/* <Link to="/mycourses" class="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" >My Courses</Link> */}
            {/* <Link onClick={handleLogout} class="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" >Logout</Link> */}
            </>
            ) : (<div className="flex ml-4 justify-between gap-2">
          <Link
            to="/auth/login"
            class="text-white hover:bg-indigo-700 w-full text-center  hover:text-white hover:-translate-y-1 transition-all duration-500 bg-blue-700  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Login
          </Link>
        </div>)}
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
