import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import {LogIn, UserCircle2, LogOut} from "lucide-react";

function Profile () {

  const navigate = useNavigate();

  const handleMyCourses = () =>{
    navigate('/mycourses')
  }

  return (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt="tania andrew"
          className="cursor-pointer rounded-full w-10 h-10"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        />
      </MenuHandler>
      <MenuList className="space-y-5 bg-[#1649FF]">
        {/* <MenuItem className="flex items-center gap-2 ">
          <UserCircle2 className="" style={{color: "white"}} />
          <Typography variant="small" className="font-semibold">
            <Link to="/profile">
              <button className="text-white">My Profile</button>
            </Link>
          </Typography>
        </MenuItem> */}
        {/* <hr className="border-blue-gray-50"></hr> */}
        <MenuItem className="flex items-center gap-3">
          <LogIn className="w-5 h-5" style={{color: "white"}} />
          <Typography variant="small" className="font-semibold">
            <Link to="/auth/login">
              <button className="text-white">Sign in</button>
            </Link>
          </Typography>
        </MenuItem>
        <hr className="my-2 border-blue-gray-50" />
        <MenuItem className="flex items-center gap-3 ">
          <Typography variant="small" className="font-semibold">
              <button className="text-white" onClick={handleMyCourses}>My Courses</button>
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
export default Profile ;