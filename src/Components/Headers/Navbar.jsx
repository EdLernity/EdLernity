import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { AlignJustify, Moon, Sun } from "lucide-react";
import Profile from "../Profilepage/Profile";
import cn from "../../Utils/cn";

function Navbar({ isDarkMode, toggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };



  return (
    <>
      {/* <nav className="flex justify-between items-center border shadow-lg px-4 py-2 bg-white text-black"> */}
      <nav
        className={`flex justify-between items-center border shadow-lg px-4 py-2 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
      >
        <div className="lg:hidden md:hidden">
          <AlignJustify
            className="w-8 h-8 cursor-pointer"
            onClick={toggleDrawer}
          />
        </div>
        <div className="flex items-center max-sm:ml-4 justify-center">
          <NavLink to={"/"}>
            <img src="/Image/Logo1.svg" alt="Logo" className="w-10" />
          </NavLink>
          <Typography variant="h3" color="black" className="" style={{color:"#1539cf"}}>
              Edlernity{" "}
            </Typography>
        </div>

        <div className="hidden lg:flex ml-12 space-x-6">
          <NavLink
            exact="true"
            to="/"
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-[#181FC5] active-link"
                  : isDarkMode
                    ? "text-white"
                    : "text-black",
                "hover:text-[#181FC5] font-md text-lg font-bold"
              )
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-[#181FC5] active-link"
                  : isDarkMode
                    ? "text-white"
                    : "text-black",
                "hover:text-[#181FC5] font-md text-lg font-bold"
              )
            }
          >
            About
          </NavLink>

          <NavLink
            exact="true"
            to="/courses/overview"
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-[#181FC5] active-link"
                  : isDarkMode
                    ? "text-white"
                    : "text-black",
                "hover:text-[#181FC5] font-md text-lg font-bold"
              )
            }
          >
            Courses
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-[#181FC5] active-link"
                  : isDarkMode
                    ? "text-white"
                    : "text-black",
                "hover:text-[#181FC5] font-md text-lg font-bold"
              )
            }
          >
            Contact
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-[#181FC5] active-link"
                  : isDarkMode
                    ? "text-white"
                    : "text-black",
                "hover:text-[#181FC5] font-md text-lg font-bold"
              )
            }
          >
            Blog
          </NavLink>
        </div>

        <div className="flex space-x-4 ml-auto">
          <IconButton
            onClick={toggleDarkMode}
            className={`bg-${isDarkMode ? "white" : "black"} text-${isDarkMode ? "black" : "white"
              } px-4 py-2 rounded`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </IconButton>

          <Link to="/profile" className="text-black font-md text-lg">
            <i className="fa fa-user"></i>
          </Link>
          <Profile />
        </div>
      </nav>

      {/* for small device */}
      <Drawer open={openDrawer} onClose={toggleDrawer} className="">
        <div className="mb-6 p-2 flex items-center justify-between z-[4] " style={{ backgroundColor: 'rgb(21, 57, 207)' }}>
          <NavLink to="/home">
            <Typography variant="h5" color="white" className="ml-4">
              Edlernity{" "}
            </Typography>
          </NavLink>
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
          <NavLink to="/auth/login">
            <Button
              className="hover:bg-[#2F35CB]  hover:text-white cursor-pointer"
              variant="outlined"
            >
              Login
            </Button>
          </NavLink>
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
