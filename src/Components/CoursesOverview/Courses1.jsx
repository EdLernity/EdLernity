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
  { title: 'UI / UX', image: '/Image/Ui.png', buttonText: 'Overview', description: 'This course covers fundamental principles of UI/UX design, including user research, wireframing, prototyping, and usability testing. Students will learn industry-standard tools and techniques to create engaging and intuitive user experiences.' },
  { title: 'Web Development', image: '/Image/Web.png', buttonText: 'Overview', description: 'This course covers the foundations of web development, including HTML, CSS, and JavaScript. Students will learn to build responsive and interactive websites using modern web technologies and frameworks.' },
  { title: 'Python', image: '/Image/Ui.png', buttonText: 'Overview', description: 'This course provides an introduction to Python programming language. Students will learn basic syntax, data structures, and control flow, as well as how to write scripts and work with modules.' },
  { title: 'Open AI', image: '/Image/Web.png', buttonText: 'Overview', description: 'This course explores the field of artificial intelligence with a focus on OpenAI technologies. Students will learn about machine learning algorithms, natural language processing, and reinforcement learning.' },
  { title: 'AI & ML', image: '/Image/Ui.png', buttonText: 'Overview', description: 'This course delves into the concepts and applications of artificial intelligence and machine learning. Students will study algorithms for classification, regression, clustering, and neural networks.' },
  { title: 'Angular', image: '/Image/Web.png', buttonText: 'Overview', description: 'This course covers Angular framework for building single-page web applications. Students will learn about components, services, routing, and state management in Angular.' },
  { title: 'React', image: '/Image/Web.png', buttonText: 'Overview', description: 'This course introduces React library for building user interfaces. Students will learn about components, JSX, state management, and hooks, as well as how to integrate React with other libraries and frameworks.' }
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

