import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios'
function CoursesOffered() {

    return (
        <>
        <div className="container mx-auto gap-32 p-4 md:flex md:items-start">
            {/* Left side with text */}
            <div className="w-[60%]">
                <h1 className="text-2xl font-bold mb-4">Our Courses</h1>
                <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac ligula eu lacus dictum fermentum. Duis ut quam vel risus congue iaculis. Proin rhoncus commodo enim, eu sollicitudin orci convallis eu. Vivamus non justo vel tortor fringilla iaculis.
                </p>
                <p className="text-gray-700">
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed dapibus, libero at ultrices feugiat, quam ex fringilla dolor, in tincidunt orci ex id sapien. Quisque vehicula purus non ligula scelerisque, eu hendrerit mauris eleifend.
                </p>
            </div>

            {/* Right side with image and text overlay */}
            <div className="relative w-[40%]">
                <img
                    src="/Image/Intern2.png" 
                    alt="Course"
                    className="w-96 h-[280px] rounded-lg"
                />
                <div className="absolute inset-0 top-5 right-20 flex flex-col items-center">
                    <p className="text-white text-center font-bold">Our Courses</p>
                    <p className="text-white text-center">Featured Courses</p>
                </div>
            </div>
        </div>

        <div className="container mx-auto gap-32 p-4 md:flex md:items-start">
            {/* Left side with text */}

            <div className="relative">
                <img
                    src="/Image/Graph12.png"  // Replace with your actual image URL
                    alt="Course"
                    className="w-96 h-64 rounded-lg"
                />
                <div className="absolute top-5 left-0 w-full h-full flex flex-col ">
                    <p className="text-white text-center font-bold">Our Courses</p>
                    <p className="text-white text-center">Featured Courses</p>
                </div>
            </div>
            <div className="">
                <h1 className="text-2xl font-bold mb-4">Our Courses</h1>
                <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac ligula eu lacus dictum fermentum. Duis ut quam vel risus congue iaculis. Proin rhoncus commodo enim, eu sollicitudin orci convallis eu. Vivamus non justo vel tortor fringilla iaculis.
                </p>
                <p className="text-gray-700">
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed dapibus, libero at ultrices feugiat, quam ex fringilla dolor, in tincidunt orci ex id sapien. Quisque vehicula purus non ligula scelerisque, eu hendrerit mauris eleifend.
                </p>
            </div>

            {/* Right side with image and text overlay */}
          
        </div>

        <div className="container mx-auto gap-32 p-4 md:flex md:items-start">
            {/* Left side with text */}
            <div className="">
                <h1 className="text-2xl font-bold mb-4">Our Courses</h1>
                <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac ligula eu lacus dictum fermentum. Duis ut quam vel risus congue iaculis. Proin rhoncus commodo enim, eu sollicitudin orci convallis eu. Vivamus non justo vel tortor fringilla iaculis.
                </p>
                <p className="text-gray-700">
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed dapibus, libero at ultrices feugiat, quam ex fringilla dolor, in tincidunt orci ex id sapien. Quisque vehicula purus non ligula scelerisque, eu hendrerit mauris eleifend.
                </p>
            </div>

            {/* Right side with image and text overlay */}
            <div className="relative">
                <img
                    src="/Image/Graph13.png"  
                    alt="Course"
                    className="w-96 h-64 rounded-lg"
                />
                {/* <div className="absolute top-5 left-0 w-full h-full flex flex-col ">
                    <p className="text-white text-center font-bold">Our Courses</p>
                    <p className="text-white text-center">Featured Courses</p>
                </div> */}
            </div>
        </div>
</>
    );
}

export default CoursesOffered;
