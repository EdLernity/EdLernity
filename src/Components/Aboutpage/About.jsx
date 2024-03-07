// import React, { useState, useEffect } from 'react';
// import BaseLayout from '../../Layout/BaseLayout';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
// import { Typography } from "@material-tailwind/react";
// import { Helmet } from "react-helmet";

// function About() {
//   const heroSectionStyle = {
//     backgroundImage: "url('/Image/Background1.jpg')",
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     color: '#fff',
//     padding: '50px',
//     textAlign: 'center',
//     minHeight: '300px', // Initial height
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//   };

//   const heroContentStyle = {
//     maxWidth: '100%',
//     margin: '0 auto',
//   };

//   const mediaQueryStyle = {
//     '@media (max-width: 768px)': {
//       heroSectionStyle: {
//         padding: '30px',
//         minHeight: '200px',
//       },
//     },
//     '@media (min-width: 769px)': {
//       heroSectionStyle: {
//         minHeight: '300px',
//       },
//     },
//   };

//   const containerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     textAlign: 'center',
//     padding: '20px',
//     flexWrap: 'wrap',
//   };

//   const contentStyle = {
//     maxWidth: '800px',
//     flex: '1',
//     textAlign: 'left',
//     margin: '0 20px',
//   };

//   const imageStyle = {
//     maxWidth: '100%',
//     height: '40vh', // Set height to 80% of viewport height
//   };

//   // carousal

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [visibleCards, setVisibleCards] = useState(1);
//   const successStories = [
//     {
//       id: 1,
//       image: "/Image/Man.png",
//       story: "Story 1",
//       name: "Tayyaba",
//       position: "Founder(CEO)",
//       internshipDetails: "Internship details 1",
//     },
//     {
//       id: 2,
//       image: "/Image/Man.png",
//       story: "Story 2",
//       name: "Nikhil Raj",
//       position: "Developer",
//       internshipDetails: "Internship details 2",
//     },
//     {
//       id: 3,
//       image: "/Image/Man.png",
//       story: "Story 3",
//       name: "Nandan Mishra",
//       position: "Developer",
//       internshipDetails: "Internship details 3",
//     },
//     {
//       id: 4,
//       image: "/Image/Man.png",
//       story: "Story 4",
//       name: "Rishu Kumar",
//       position: "Developer",
//       internshipDetails: "Internship details 4",
//     },
//     {
//       id: 5,
//       image: "/Image/Man.png",
//       story: "Story 5",
//       name: "Akash Kumar",
//       position: "Developer",
//       internshipDetails: "Internship details 5",
//     },
//     {
//       id: 6,
//       image: "/Image/Man.png",
//       story: "Story 6",
//       name: "Ishu Kumar",
//       position: "Developer",
//       internshipDetails: "Internship details 6",
//     },
//     {
//       id: 7,
//       image: "/Image/Man.png",
//       story: "Story 7",
//       name: "Rahul",
//       position: "Developer",
//       internshipDetails: "Internship details 7",
//     },
//     {
//       id: 8,
//       image: "/Image/Man.png",
//       story: "Story 8",
//       name: "Ranjan kumar",
//       position: "Developer",
//       internshipDetails: "Internship details 8",
//     },
//     {
//       id: 9,
//       image: "/Image/Man.png",
//       story: "Story 9",
//       name: "Rajat kumar",
//       position: "Developer",
//       internshipDetails: "Internship details 9",
//     },
//     {
//       id: 10,
//       image: "/Image/Man.png",
//       story: "Story 10",
//       name: "Rishu srivastava",
//       position: "Developer",
//       internshipDetails: "Internship details 10",
//     },

//   ];

//   const nextSlide = () => {
//     setCurrentSlide((prevSlide) => (prevSlide + 1) % successStories.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prevSlide) => (prevSlide - 1 + successStories.length) % successStories.length);
//   };

//   const handleResize = () => {
//     const screenWidth = window.innerWidth;

//     if (screenWidth >= 768) {
//       setVisibleCards(3);
//     } else {
//       setVisibleCards(1);
//     }
//   };

//   useEffect(() => {
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <BaseLayout>
//      <Helmet>
//         <meta charSet="utf-8" />
//         <title>EdLernity | About Us</title>
//         <link rel="canonical" href="http://mysite.com/example" />
//       </Helmet>
//       <div
//         style={{
//           ...heroSectionStyle,
//           ...mediaQueryStyle['@media (max-width: 768px)'].heroSectionStyle,
//           ...mediaQueryStyle['@media (min-width: 769px)'].heroSectionStyle,
//         }}
//       >
//         <div style={heroContentStyle}>
//           <h1 className='text-white text-3xl font-bold text-center'>About Us</h1>
//           <p className='text-center text-xl'>Welcome to EdLernity Tech, where innovation converges with purpose to redefine the landscape of technological solutions. Established with a vision to lead in the ever-evolving tech industry, EdLernity Tech (OPC) Private Limited is committed to delivering cutting-edge products and services that transcend conventional boundaries. </p>
//         </div>

//       </div>

//       <div className='mt-12'>
//         <h4 className='text-3xl text-center font-bold uppercase' style={{ color: '#181FC5' }}>
//           Our Vision
//         </h4>

//         <div className='mt-12' style={containerStyle}>
//           <div style={contentStyle}>
//             <p className='text-lg uppercase'>
//               "At Edlernity, we envision a future where technology seamlessly integrates with human needs, fostering progress and enhancing lives. Our vision is to be a beacon of innovation, driving positive change through transformative digital solutions."
//             </p>

//             <p className='text-lg uppercase'>
//               "Our commitment is to lead the way in technological advancements, promoting sustainability, inclusivity, and ethical practices. Together, we strive to build a better future where technology serves as a catalyst for positive social and economic transformation."
//             </p>
//           </div>

//           <div>
//             <img src='/Image/Vision.png' alt='Vision' style={imageStyle} />
//           </div>
//         </div>
//       </div>

//       <div className='mt-12'>
//         <h1 className='text-center font-bold text-3xl' style={{ color: "#181FC5" }}>OUR MISSION</h1>
//         <div className='mt-12' style={containerStyle}>

//           <div>
//             <img src='/Image/Vision.png' alt='Vision' style={imageStyle} />
//           </div>
//           <div style={contentStyle}>
//             <p className='text-lg uppercase'>
//               "We are on a mission to pioneer advancements in technology, creating value for our clients and contributing to the broader societal good. Through a relentless pursuit of excellence, ethical practices, and a commitment to sustainability, we strive to leave a lasting impact on the world."
//             </p>

//             <p className='text-lg uppercase'>
//               "Our commitment is to lead the way in technological advancements, promoting sustainability, inclusivity, and ethical practices. Together, we strive to build a better future where technology serves as a catalyst for positive social and economic transformation."
//             </p>
//           </div>

//           <div>
//             <img src='/Image/Vision.png' alt='Vision' style={imageStyle} />
//           </div>
//         </div>
//       </div>

//       <div className='mt-12'>
//         <h1 className='text-center font-bold text-3xl' style={{ color: "#181FC5" }}>OUR MISSION</h1>
//         <div className='mt-12' style={containerStyle}>

//           <div>
//             <img src='/Image/Vision.png' alt='Vision' style={imageStyle} />
//           </div>
//           <div style={contentStyle}>
//             <p className='text-lg uppercase'>
//               "We are on a mission to pioneer advancements in technology, creating value for our clients and contributing to the broader societal good. Through a relentless pursuit of excellence, ethical practices, and a commitment to sustainability, we strive to leave a lasting impact on the world."
//             </p>

//             <p className='text-lg uppercase'>
//               "Our commitment is to lead the way in technological advancements, promoting sustainability, inclusivity, and ethical practices. Together, we strive to build a better future where technology serves as a catalyst for positive social and economic transformation."
//             </p>
//           </div>

//         </div>
//       </div>

//       <div className='mt-12'>
//         <h4 className='text-center font-bold text-3xl' style={{ color: "#181FC5" }}>MEET OUR TEAM</h4>
//         <div className="flex justify-center mt-8 -space-x-4 items-center relative overflow-x-auto">
//           <button className="absolute left-0 top-1/2 transform -translate-y-1/2" onClick={prevSlide}>
//             <ChevronLeftIcon className="w-12 h-12 text-gray-600" />
//           </button>

//           {/* Carousel Content */}
//           {successStories.map((story, index) => (
//             index >= currentSlide && index < currentSlide + visibleCards && (
//               <div div key={story.id} className={`slide w-full mx-auto`} style={{ width: "15rem" }}>
//                 <div className="card p-4 ">

//                   <div className="flex items-center justify-center mb-4">
//                     <img
//                       src={story.image}
//                       alt={`user ${story.id}`}
//                       className="w-32 h-32 object-cover rounded-full border-2 border-white hover:z-10 focus:z-10"
//                     />
//                   </div>

//                   <h5 className="text-lg text-center font-bold">{story.name}</h5>

//                   <p className="text-gray-600 text-center mb-2">{story.position}</p>

//                   {/* <p className="text-gray-600 mb-4">{story.internshipDetails}</p> */}

//                   <div className="flex justify-center space-x-4">
//                   <div className="flex gap-4  sm:justify-center">

//                         <Typography as="a" href="#" className=" hover:opacity-100">
//                             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </Typography>
//                         <Typography as="a" href="#" className=" hover:opacity-100">
//                             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </Typography>
//                         <Typography as="a" href="#" className=" hover:opacity-100">
//                             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                 <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                             </svg>
//                         </Typography>
//                         <Typography as="a" href="#" className=" hover:opacity-100">
//                             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </Typography>
//                         <Typography as="a" href="#" className=" hover:opacity-100">
//                             <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </Typography>

//                     </div>
//                   </div>
//                 </div>
//               </div>

//             )
//           ))}

//           <button className="absolute right-0 top-1/2 transform -translate-y-1/2" onClick={nextSlide}>
//             <ChevronRightIcon className="w-12 h-12 text-gray-600" />
//           </button>
//         </div>

//         {/* Circle Indicators */}
//         <div className="flex justify-center mt-4 space-x-2">
//           {successStories.map((_, index) => (
//             <div
//               key={index}
//               className={`dot w-4 h-4 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
//               onClick={() => setCurrentSlide(index)}
//             />
//           ))}
//         </div>
//       </div>
//     </BaseLayout >
//   );
// }

// export default About;

import React, { useState, useEffect } from "react";
import BaseLayout from "../../Layout/BaseLayout";
import { Helmet } from "react-helmet";
import CountUp from "react-countup";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Rating } from "@material-tailwind/react";
import './About.css';
function About() {
  const reviewData = [
    {
      id: 1,
      image: "sejal-kesharwani.jpeg",
      comment:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      name: "Surabhi Kesarwani",
    },
    {
      id: 2,
      image: "nikhil-reji.jpeg",
      comment:
        "I recently came across membership of EdLernity, and I must say, it was a great experience. The platform's intuitive interface and engaging content made learning not only easy but also enjoyable. The courses structure was well-organized, guiding me through each topic seamlessly. I would recommend to take up the membership and explore the courses.",
      name: "Nikhil Reji",
    },
    {
      id: 3,
      image: "sraadha-gupta.jpeg",
      comment:
        "Great course, so many important topics covered in depth. There were many assessments which made us confident with our skills. I would like to enroll in more courses offered by EdLernity.",
      name: "Shraddha Gupta",
    },
    {
      id: 4,
      image: "ali-akbar.jpeg",
      comment:
        "EdLernity offers different courses that's helpfull for People who are looking to improve their skills.They have Technical courses and many more.The courses are well structured with clear objectives and engaging contents.Making complex topics easier to understand.Edlernity provides a valuable resource for life long learners. The course has helped provide a starting point for understanding, which certainly will prove useful in my current work/projects.",
      name: "Ali Akbar P",
    },
    {
      id: 5,
      image: "manjari-rastogi.jpeg",
      comment:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      name: "Manjari Rastogi",
    },
    {
      id: 6,
      image: "abdul-wahab.jpeg",
      comment:
        "Edlernity is one of the most amazing platform to get a chance for learning and improving all technical skills required for all IT students it's worthy to have an opportunity to learn and acquire skills of languages that provided by their inspired and professional teachers ..happy learning with EdLernity.",
      name: "Abdul Wahab",
    },
    {
      id: 7,
      image: "r-muskan-zehra.jpeg",
      comment:
        "I highly recommend this course provided by EdLernity to anyone looking to take their Python skills to the next level. Whether you're a beginner or an experienced programmer, you'll find valuable insights and practical knowledge that will enhance your proficiency in Python programming. Best of luck on your learning journey.",
      name: "R Muskan Zehra",
    },
    {
      id: 8,
      image: "md-burhanuddin.jpeg",
      comment:
        "Packed with valuable insights and applicable skills. Worth every penny! Impressed with EdLernity courses! Easy-to-follow format, great community support, and actionable takeaways.Courses are top-notch Comprehensive curriculum, interactive exercises, and expert guidance. A must-try!.",
      name: "Md Burhanuddin",
    },
  ];

  const [visibleCards, setVisibleCards] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % reviewData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + reviewData.length) % reviewData.length
    );
  };
  const handleResize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 768) {
      setVisibleCards(3);
    } else {
      setVisibleCards(1);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <BaseLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | About Us</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <div className="mt-10 px-4 md:px-8 lg:px-12">
        <div>
          <h1 className="text-center font-bold text-4xl animate__animated animate__fadeInDownBig">
            About us
          </h1>
          <p
            className="text-lg md:text-xl lg:text-2xl mt-5 animate__animated animate__backInLeft"
            style={{ color: "#605C5C" }}
          >
            Welcome to EdLernity Tech, where innovation converges with purpose
            to redefine the landscape of technological solutions. Established
            with a vision to lead in the ever-evolving tech industry, EdLernity
            Tech (OPC) Private Limited is committed to delivering cutting-edge
            products and services that transcend conventional boundaries.
          </p>
        </div>

        <div className="mt-5">
          <h2 className="text-left font-semibold text-2xl animate__animated animate__fadeInDownBig">
            Special Offering:
          </h2>
          <p
            className="text-lg md:text-xl lg:text-2xl mt-5 animate__animated animate__backInRight"
            style={{ color: "#605C5C" }}
          >
            At EdLernity, we go beyond traditional education. In addition to our
            wide array of courses, we are proud to offer Tech internships that
            provide real-time practical knowledge. These internships are
            designed to bridge the gap between theory and application, giving
            you the hands-on experience needed to excel in your career.
          </p>
          <p
            className="text-lg md:text-xl lg:text-2xl mt-5 animate__animated animate__backInRight"
            style={{ color: "#605C5C" }}
          >
            Our internships offer a unique opportunity to work with industry
            experts, gain valuable insights, and apply your skills in real-world
            scenarios. Whether you're aspiring to be a Web Developer
            professional or a UI/UX Designer, EdLernity is here to support your
            journey and help you acquire the practical expertise that sets you
            apart.
          </p>

          <p
            className="text-lg md:text-xl lg:text-2xl mt-5 animate__animated animate__backInRight"
            style={{ color: "#605C5C" }}
          >
            Join us on this transformative educational journey, because at
            EdLernity, we firmly believe that "Better skills develop the nation.
            Discover your potential with EdLernity today!
          </p>
        </div>
        <hr className="border-gray-500 mt-10"></hr>
        <div className="flex flex-wrap justify-center mt-10">
          <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0 animate__animated animate__backInLeft">
            <img
              src="/Image/About1.svg"
              alt="About Image"
              className="w-full md:w-auto h-auto md:max-w-md md:max-h-96"
            />
          </div>
          <div className="w-full md:w-1/2  animate__animated animate__backInRight">
            <h1
              className="text-2xl md:text-xl font-bold mb-4"
              style={{ color: "#181FC5" }}
            >
              WHO WE ARE
            </h1>
            <h2 className="text-4xl md:text-3xl font-semibold mb-2">
              We Offer The Best <br /> Carrier
            </h2>

            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/Image/Industry.png"
                  className="w-8 h-8"
                  alt="Industry Icon"
                />
                <h4>Industry Expert Instructor</h4>
              </div>
              <p className="ml-12 text-gray-700">
                Unlock the wisdom of industry experts. Our instructors are the
                guiding stars of your educational journey, illuminating the path
                to success.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/Image/Industry.png"
                  className="w-8 h-8"
                  alt="Industry Icon"
                />
                <h4>Up-to-Date Course Content</h4>
              </div>
              <p className="ml-12 text-gray-700">
                Unlock the wisdom of industry experts. Our instructors are the
                guiding stars of your educational journey, illuminating the path
                to success.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/Image/Industry.png"
                  className="w-8 h-8"
                  alt="Industry Icon"
                />
                <h4>Biggest Student Community</h4>
              </div>
              <p className="ml-12 text-gray-700">
                Unlock the wisdom of industry experts. Our instructors are the
                guiding stars of your educational journey, illuminating the path
                to success.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-[#D9D9D9] rounded-xl p-4 animate__animated animate__fadeInUpBig">
          <div className="text-center">
            <h4
              className="text-2xl font-bold"
              style={{ color: "#181FC5", paddingTop: "50px" }}
            >
              WHO WE ARE
            </h4>
            <h2 className="mt-5 text-3xl font-bold">
              How Does EdLernity Work?
            </h2>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center sm:px-8 lg:px-32 pb-8">
            <div className="text-center items-center space-y-4 justify-center mb-8 sm:mb-0">
              <img
                src="/Image/Book.png"
                className="w-12 h-12 p-2 bg-[#181FC5] rounded-full mx-auto"
                alt="Choose Any Courses"
              />
              <h5>Choose Any Courses</h5>
              <p className="text-sm" style={{ color: "#5E5E5E" }}>
                Education is the passport to the future, for tomorrow belongs to
                those who prepare for it today.
              </p>
            </div>

            <div className="text-center items-center space-y-4 justify-center mb-8 sm:mb-0">
              <img
                src="/Image/Book4.png"
                className="w-12 h-12 p-2 bg-[#181FC5] rounded-full mx-auto"
                alt="Purchase Your Course"
              />
              <h5>Purchase Your Course</h5>
              <p className="text-sm" style={{ color: "#5E5E5E" }}>
                Invest in your mind. Purchase knowledge and watch your potential
                grow.
              </p>
            </div>

            <div className="text-center items-center space-y-4 justify-center">
              <img
                src="/Image/Book2.png"
                className="w-12 h-12 p-2 bg-[#181FC5] rounded-full mx-auto"
                alt="Great! Start Learn"
              />
              <h5>Great! Start Learn</h5>
              <p className="text-sm" style={{ color: "#5E5E5E" }}>
                Embark on your learning journey with enthusiasm, for every
                lesson is a step toward greatness.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white pt-16 px-4">
          <div className="relative flex space-x-4 pt-12">
            <div className="absolute top-1 -left-12 h-[250px] w-[250px] bg-[#623CEA] rounded-full" />
            <div className="absolute top-[105px] -right-16 h-[300px] w-[300px] bg-[#FF6B81] rounded-full" />
            <div className="z-10 flex h-[280px] w-[350px] items-center justify-center rounded-lg p-4">
              <img
                alt="Group of people"
                className="h-full w-full object-cover rounded-lg"
                height="160"
                src="/Image/People.png"
                style={{
                  aspectRatio: "280/160",
                  objectFit: "cover",
                }}
                width="280"
              />
            </div>

            <div className="z-20 flex h-[300px] w-[420px] items-center justify-center rounded-lg p-4">
              <img
                alt="Smiling woman"
                className="h-full w-full object-cover rounded-lg"
                height="180"
                src="/Image/People1.png"
                style={{
                  aspectRatio: "300/180",
                  objectFit: "cover",
                }}
                width="280"
              />
            </div>
            <div className="z-10 flex h-[280px] w-[400px] items-center justify-center rounded-lg  p-4">
              <img
                alt="Man with laptop"
                className="h-full w-full object-cover rounded-lg"
                height="160"
                src="/Image/People2.png"
                style={{
                  aspectRatio: "280/160",
                  objectFit: "cover",
                }}
                width="280"
              />
            </div>
          </div>
        </div>
        <div
          className=" flex flex-col md:flex-row"
          style={{ marginBlock: "150px" }}
        >
          <div className="md:w-1/2 pr-4 animate__animated animate__backInRight">
            <h2 className="font-bold text-2xl" style={{ color: "#181FC5" }}>
              OUR MISSION
            </h2>
            <p className="text-2xl">
              "We are on a mission to pioneer advancements in technology,
              creating value for our clients and contributing to the broader
              societal good. Through a relentless pursuit of excellence, ethical
              practices, and a commitment to sustainability, we strive to leave
              a lasting impact on the world."
            </p>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0 animate__animated animate__backInLeft">
            <h2 className="font-bold text-2xl" style={{ color: "#181FC5" }}>
              OUR VISION
            </h2>
            <p className="text-2xl">
              "At Edlernity, we envision a future where technology seamlessly
              integrates with human needs, fostering progress and enhancing
              lives. Our vision is to be a beacon of innovation, driving
              positive change through transformative digital solutions."
            </p>
          </div>
        </div>

        <div
          className="mt-10 border-black rounded-xl bg-[#181FC5] relative animate__animated animate__fadeIn"
          style={{ marginBlock: "-120px" }}
        >
          <div className="py-24 text-center flex flex-col justify-center items-center">
            <img
              src="/Image/User.png"
              alt="User Icon"
              className="mx-auto w-24 h-24 mb-4"
            />
            <CountUp
              start={0}
              end={7077}
              duration={100}
              separator=","
              delay={0.5}
            >
              {({ countUpRef }) => (
                <div className="text-4xl font-bold text-white">
                  <span ref={countUpRef}></span>+
                </div>
              )}
            </CountUp>
            <p className="text-xl font-semibold text-white pb-12">
              STUDENTS ENROLLED
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#808080]">
        <div className="">
          <h2
            className="text-center text-3xl  font-bold "
            style={{ color: "#181FC5", paddingTop: "12rem" }}
          >
            Review from Learners
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex  justify-center items-center">
              <Rating
                readonly
                value={4}
                ratedColor="blue"
                style={{ color: "#353BCC" }}
              />
              <span className=" ml-2" style={{ color: "#353BCC" }}>
                4.3 Reviews
              </span>
            </div>
          </div>
          <div className="flex justify-center mt-8 -space-x-4 items-center relative overflow-x-auto">
            <div className="max-w-screen-lg mx-auto mt-10 w-full">
              <div className="flex items-center justify-center flex-wrap">
                {reviewData?.map(
                  (item, index) =>
                    index >= currentSlide &&
                    index < currentSlide + visibleCards && (
                      <div
                        key={index}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4"
                      >
                        <div className="review-container h-72 flex bg-[#D9D9D9]">
                          <div className="" style={{marginLeft:"4px" , marginTop:"12px"}}>
                            <img
                              src={`/Image/user-review-picture/${item?.image}`}
                              alt={item?.name}
                              className="w-[1080px] h-[85px] rounded-full p-2 object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h2 className="text-xl whitespace-nowrap font-bold mb-2">
                              {item?.name}
                            </h2>
                            <p className="pb-3">{item?.comment}</p>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {reviewData?.map((_, index) => (
              <div
                key={index}
                className={`dot w-4 h-4 mb-12 rounded-full ${
                  index === currentSlide ? "bg-[#353BCC]" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default About;

// <div className="flex items-center justify-center bg-white py-8 px-4">
//   <div className="relative flex space-x-4">
//     <div className="absolute top-0 left-0 h-[100px] w-[100px] bg-[#623CEA] rounded-full" />
//     <div className="absolute top-0 right-0 h-[150px] w-[150px] bg-[#FF6B81] rounded-full" />
//     <div className="z-10 flex h-[180px] w-[300px] items-center justify-center rounded-lg bg-[#F9D5A7] p-4">
//       <img
//         alt="Group of people"
//         className="h-full w-full object-cover rounded-lg"
//         height="160"
//         src="/placeholder.svg"
//         style={{
//           aspectRatio: "280/160",
//           objectFit: "cover",
//         }}
//         width="280"
//       />
//     </div>
//     <div className="z-20 flex h-[200px] w-[320px] items-center justify-center rounded-lg bg-[#56C2E6] p-4">
//       <img
//         alt="Smiling woman"
//         className="h-full w-full object-cover rounded-lg"
//         height="180"
//         src="/placeholder.svg"
//         style={{
//           aspectRatio: "300/180",
//           objectFit: "cover",
//         }}
//         width="300"
//       />
//     </div>
//     <div className="z-10 flex h-[180px] w-[300px] items-center justify-center rounded-lg bg-[#F4E06D] p-4">
//       <img
//         alt="Man with laptop"
//         className="h-full w-full object-cover rounded-lg"
//         height="160"
//         src="/placeholder.svg"
//         style={{
//           aspectRatio: "280/160",
//           objectFit: "cover",
//         }}
//         width="280"
//       />
//     </div>
//   </div>
// </div>
