import React from 'react'
import { NavLink , useNavigate } from 'react-router-dom';
import BaseLayout from '../../Layout/BaseLayout';
function Courses1() {

  const navigate = useNavigate();

  const cardStyle = {
    position: 'relative',
    width: '300px',
    margin: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  };

  const textStyle = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff', // Text color
    fontSize: '2.0rem', // Adjust font size as needed
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Optional text shadow for better readability
  };

  const handleClick = async () =>{
    // localStorage.setItem("current_course", "Chat_GPT_Course_EdLernity");
    localStorage.setItem("current_course", "Angular Framework");
    navigate(window.location.pathname + '/angular')
  }
  return (
    <BaseLayout>
      <h1 className='text-3xl mt-10 lg:ml-10 font-bold ' style={{ color: "#181FC5" }}>Explore Courses</h1>
      <div className=''>

        <div className="flex flex-wrap justify-around p-20">
          <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded-2xl overflow-hidden">
            <img src='/Image/Intern1.png' alt='Internship 1' style={imageStyle} className="w-full h-auto rounded-2xl" />
            <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
              UI/UX Design
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
                <button className='text-black bg-gray-200 px-6 text-center py-2  rounded-3xl justify-center ' onClick={handleClick}>Explore</button>
            </div>
          </div>
          <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded-2xl overflow-hidden">
            <img src='/Image/Intern1.png' alt='Internship 1' style={imageStyle} className="w-full h-auto rounded-2xl" />
            <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
              Angular Framework (MEAN STACK)
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <div>
                <button className='text-black bg-gray-200 px-6 text-center py-2  rounded-3xl justify-center' onClick={handleClick}>Explore</button>
              </div>
            </div>
          </div>
          <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded-2xl overflow-hidden">
            <img src='/Image/Intern1.png' alt='Internship 1' style={imageStyle} className="w-full h-auto rounded-2xl" />
            <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
              Python
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <NavLink to="#">
                <button className='text-black bg-gray-200 px-6 text-center py-2  rounded-3xl justify-center '>Explore</button>
              </NavLink>
            </div>
          </div>
          <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded-2xl overflow-hidden">
            <img src='/Image/Intern1.png' alt='Internship 1' style={imageStyle} className="w-full h-auto rounded-2xl" />
            <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
              Other
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <NavLink to="#">
                <button className='text-black bg-gray-200 px-6 text-center py-2  rounded-3xl justify-center '>Explore</button>
              </NavLink>
            </div>
          </div>
        </div>
        <div className=''>
          <h1 className='text-3xl mt-10 lg:ml-10 font-bold ' style={{ color: "#181FC5" }}>Popular Courses</h1>
          <div className='bg-[#282D99] items-center justify-between ml-12 mr-12 mt-8  rounded-2xl py-4 flex  px-8 '>
            <div>
              <h1 className='text-xl text-white'>UI/UX Designing</h1>
            </div>

            <div>
              <img src='/Image/Ui.png'alt='' className='w-24' />
            </div>
          </div>
          <div className='bg-[#282D99] flex items-center justify-between ml-12 mr-12 mt-8  rounded-2xl py-4  px-8 '>
            <div>
              <h1 className='text-xl text-white'>Web Development</h1>
            </div>

            <div>
              <img src='/Image/Web.png' alt='' className='w-24' />
            </div>
          </div>
          <div className='bg-[#282D99] items-center justify-between ml-12 mr-12 mt-8  rounded-2xl py-4 flex  px-8 '>
            <div>
              <h1 className='text-xl text-white'>Other</h1>
            </div>

            <div>
              <img src='/Image/Ui.png' alt='' className='w-24' />
            </div>
          </div>
        </div>
        <div>
          <h1 className='text-3xl mt-10 lg:ml-10 font-bold ' style={{ color: "#181FC5" }}>About Price & Subscription</h1>
        </div>
      </div>
     
   
   
    </BaseLayout>
  )
}

export default Courses1
