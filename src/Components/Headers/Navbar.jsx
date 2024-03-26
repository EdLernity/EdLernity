import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { AlignJustify } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Profile from "../Profilepage/Profile";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const location = useLocation();
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

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
              Edlernity
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
            {localStorage.getItem("_userAuth") ? (
              <Profile />
            ) : (
              <>
                {/* <Link to="/auth/signup" class="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 text-white bg-cyan-700  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 lg:ml-auto">Login</Link> */}

                <Link
                  to="/auth/login"
                  className="text-white hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 hidden md:block"
                >
                  Login
                </Link>

                <div className="lg:hidden md:hidden">
                  <AlignJustify
                    className="w-8 h-8 cursor-pointer mb-1"
                    onClick={toggleDrawer}
                  />
                </div>
              </>
            )}
          </div>
          <div
            class="hidden justify-start items-start w-full lg:flex lg:w-auto me-[50rem] lg:order-1"
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
                  to="/contact"
                  class={location.pathname==="/contact"?"block py-2 pr-4 pl-3 text-white rounded bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:p-0 dark:text-white":"block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"}
                  
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Blog
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
            <NavLink to="/blog">Blog</NavLink>
          </Typography>
        </div>
        <div className="flex ml-4 justify-between gap-2">
          <Link
            to="/auth/login"
            class="text-white hover:bg-indigo-700 w-full text-center  hover:text-white hover:-translate-y-1 transition-all duration-500 bg-blue-700  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Login
          </Link>
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
