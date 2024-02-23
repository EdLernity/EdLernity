import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BaseLayout from '../../Layout/BaseLayout';
import {
  Button, Dialog, DialogHeader, DialogBody, DialogFooter, IconButton,
} from "@material-tailwind/react";
const coursesData = [
  { title: 'UI/UX Design', image: '/Image/Intern1.png', buttonText: 'Explore', description: 'Learn UI/UX Design' },
  { title: 'Angular Framework (MEAN STACK)', image: '/Image/Intern1.png', buttonText: 'Explore', description: 'Explore Angular Framework' },
  { title: 'Python', image: '/Image/Intern1.png', buttonText: 'Explore', description: 'Discover Python' },
  { title: 'Other', image: '/Image/Intern1.png', buttonText: 'Explore', description: 'Explore other courses' },
];

const popularCoursesData = [
  { title: 'UI/UX Designing', image: '/Image/Ui.png' },
  { title: 'Web Development', image: '/Image/Web.png' },
  { title: 'Other', image: '/Image/Ui.png' },
];


const allCoursesData = [
  { title: 'Python',
   description: 'Learn Python programming language from scratch. Understand basic concepts, syntax, and data structures.',
    image: '/Image/Ui.png',
    buttonText: 'Overview' },
  { title: 'Machine Learning', description: 'Explore the field of machine learning, covering algorithms, models, and applications.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Artificial Intelligence', description: 'Dive into artificial intelligence concepts, including neural networks, deep learning, and natural language processing.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Web Development', description: 'Master web development fundamentals including HTML, CSS, and JavaScript. Build responsive and interactive websites.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Digital Marketing', description: 'Learn digital marketing strategies, including SEO, SEM, social media marketing, and email marketing.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Cloud Computing', description: 'Explore cloud computing platforms and services such as AWS, Azure, and Google Cloud.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Excel', description: 'Master Microsoft Excel for data analysis, reporting, and visualization.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'JavaScript', description: 'Learn JavaScript programming language for building dynamic and interactive web applications.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'ChatGPT', description: 'Discover ChatGPT, a state-of-the-art conversational AI model developed by OpenAI.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Motion Design', description: 'Learn motion design principles and techniques using tools like Adobe After Effects.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Angular', description: 'Master Angular framework for building modern, scalable web applications.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Project Management', description: 'Develop project management skills including planning, execution, and team management.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Tech Interview Preparation', description: 'Prepare for technical interviews with practice questions, coding challenges, and interview strategies.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'UI/UX Designing', description: 'Learn user interface and user experience design principles and best practices.', image: '/Image/Ui.png', buttonText: 'Overview' },
  { title: 'Cyber Security', description: 'Explore cybersecurity concepts, including network security, cryptography, and ethical hacking.', image: '/Image/Ui.png', buttonText: 'Overview' },
];


function Courses1() {
  const navigate = useNavigate();

  const handleClick = (course) => {
    localStorage.setItem('current_course', course.title);
    navigate(`${window.location.pathname}/${course.title.toLowerCase().replace(/\s/g, '-')}`);
  };
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
    color: '#fff',
    fontSize: '2.0rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  };


  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleOpen = (course) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <BaseLayout>
      <h1 className='text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold' style={{ color: "#181FC5" }}>Explore Course </h1>
      <div className='flex flex-wrap justify-around p-20'>
        {coursesData.map((course, index) => (
          <div key={index} className='relative w-300 m-10 text-center shadow-lg rounded-2xl overflow-hidden' style={cardStyle}>
            <img src={course.image} alt={course.title} style={imageStyle} />
            <div className='absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl' style={textStyle}>
              {course.title}
            </div>
            <div className='absolute bottom-5 left-0 right-0 text-center'>
              <button
                className='text-black bg-gray-200 px-6 text-center py-2 rounded-3xl justify-center'
                onClick={() => handleClick(course)}
              >
                {course.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h1 className='text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold' style={{ color: "#181FC5" }}>Popular Courses</h1>
        {popularCoursesData.map((popularCourse, index) => (
          <div key={index} className='bg-[#282D99] items-center justify-between mx-4 md:mx-24 mt-8 rounded-2xl py-4 flex md:flex-row px-4 md:px-8'>
            <div className='mb-2 md:mb-0 md:mr-4'>
              <h1 className='text-xl text-nowrap text-white'>{popularCourse.title}</h1>
            </div>
            <div>
              <img src={popularCourse.image} alt='' className='w-24 md:ml-2' />
            </div>
          </div>
        ))}

      </div>
      <div>
        <h1 className='text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold' style={{ color: "#181FC5" }}>All Courses </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:mx-24 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4'>
          {allCoursesData.map((course, index) => (
            <div key={index} className='bg-[#181FC5] p-4 rounded-lg shadow-lg'>
              <img src={course.image} alt={course.title} className='w-24 h-24 object-cover mb-4 rounded-lg' />
              <h2 className='text-xl text-white font-bold mb-2'>{course.title}</h2>
              <p className='text-gray-200 whitespace-nowrap' style={{ overflow: "hidden", textOverflow: "ellipsis", }}>{course.description}</p>
              <div className='mt-4'>
                <button
                  className='text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue'
                  onClick={() => handleOpen(course)}
                >
                  {course.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog */}
        {selectedCourse && (
          <Dialog className='bg-[#181FC5]' open={openDialog} handler={handleClose}>
            <DialogHeader className="justify-between text-white">
              {selectedCourse.title}
              <IconButton
                color="white"
                size="sm"
                variant="text"
                onClick={handleClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </DialogHeader>
            <DialogBody>
              <img
                src={selectedCourse.image}
                alt={selectedCourse.title}
                className='w-32 h-32 text-white object-cover mb-4 rounded-lg'
              />
              <p className='text-gray-200'>{selectedCourse.description}</p>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={handleClose}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <button onClick={handleClose} className='text-white bg-blue-500 px-8 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue'>
                <NavLink to="/courses/overview/angular-framework-(mean-stack)">
                  <span>Enroll</span>
                </NavLink>

              </button>
            </DialogFooter>
          </Dialog>
        )}
      </div>
    </BaseLayout>
  );
}

export default Courses1;

