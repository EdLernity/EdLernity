import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Drawer, Button, Typography, IconButton, } from "@material-tailwind/react";
import { AlignJustify, LineChart, User, Search, ChevronDown , Moon, Sun } from "lucide-react";
import Profile from '../Profilepage/Profile';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add logic here to toggle your dark/light mode styles or classes
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <nav className="flex justify-between items-center border shadow-lg px-4 py-2 bg-white text-black">
        <div className="lg:hidden md:hidden">
          <AlignJustify
            className="w-8 h-8 cursor-pointer"
            onClick={toggleDrawer}
          />
        </div>
        <div>
          <NavLink to={"/"}>
            <img src="/Image/Logo1.svg" alt="Logo" className="w-10" />
          </NavLink>
        </div>
        <div className="hidden lg:flex ml-12 space-x-6">
          <Link to="/" className="text-black font-md text-lg">Home</Link>
          <Link to="/about" className="text-black font-md text-lg">About</Link>
          <Link to="/course" className="text-black font-md text-lg">Course</Link>
          <Link to="/blog" className="text-black font-md text-lg">Blogs</Link>
        </div>
        {/* <div className="flex  space-x-4 ml-auto">
      
          <Link to="/profile" className="text-black font-md text-lg"><i className="fa fa-user"></i></Link>
          <Profile/>
        </div> */}


        <div className="flex space-x-4 ml-auto">
          <IconButton onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </IconButton>
          <Link to="/profile" className="text-black font-md text-lg"><i className="fa fa-user"></i></Link>
          <Profile />
        </div>
      </nav>

      {/* for small device */}
      <Drawer open={openDrawer} onClose={toggleDrawer} className="p-4 ">
        <div className="mb-6 flex items-center justify-between z-[4]">
          <NavLink to="/home">
            <Typography variant="h5" color="blue-gray">
              Edlernity            </Typography>
          </NavLink>
          <IconButton variant="text" color="blue-gray" onClick={toggleDrawer}>
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
        <Typography
          color="gray"
          className="mb-8 pr-4 text-base  flex flex-col space-y-3"
          style={{
            fontFamily: "Tenor Sans,sans-serif",
            textTransform: "uppercase",
            color: "#000",
            fontWeight: "400",
          }}
        >
          <NavLink to="/" className="hover:text-orange-600  ">
            Home
          </NavLink>
          <hr className="border border-gray-200"></hr>
          <NavLink to="/contact-us" className="hover:text-orange-600 ">
            About
          </NavLink>
          <hr className="border border-gray-200"></hr>
          <NavLink to="/about-us" className="hover:text-orange-600">
            Course
          </NavLink>
          <hr className="border border-gray-200"></hr>
        
          <NavLink to="/about-us" className="hover:text-orange-600">
            Blog
          </NavLink>
        </Typography>
        <div className="flex justify-between gap-2">
          <NavLink to="/login">
            <Button
              className="hover:bg-[#1649FF]  hover:text-white cursor-pointer"
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








// <nav className={`flex justify-between items-center border shadow-lg px-4 py-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
//         <div className="lg:hidden md:hidden">
//           <AlignJustify
//             className="w-8 h-8 cursor-pointer"
//             onClick={toggleDrawer}
//           />
//         </div>
//         <div>
//           <NavLink to={"/"}>
//             <img src="/Image/Logo1.svg" alt="Logo" className="w-10" />
//           </NavLink>
//         </div>
//         <div className="hidden lg:flex ml-12 space-x-6">
//           <Link to="/" className={`font-md text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Home</Link>
//           <Link to="/about" className={`font-md text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>About</Link>
//           <Link to="/course" className={`font-md text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Course</Link>
//           <Link to="/blog" className={`font-md text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Blogs</Link>
//         </div>
//         <div className="flex space-x-4 ml-auto">
//           <IconButton onClick={toggleDarkMode}>
//             {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
//           </IconButton>
//           <Link to="/profile" className={`font-md text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
//             <i className="fa fa-user"></i>
//           </Link>
//           <Profile />
//         </div>
//       </nav>