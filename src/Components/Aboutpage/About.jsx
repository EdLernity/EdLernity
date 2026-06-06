import React, { useEffect, useState } from "react";
import CountUp from 'react-countup';
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";

import "./About.css";
function About() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < 1000) {
        setCount(prevCount => prevCount + 1);
      }
    }, 10); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, [count]);
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
    setCurrentSlide((prevSlide) => (prevSlide + 1) % reviewData?.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + reviewData.length) % reviewData?.length
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
      <SeoHead
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        path={PAGE_SEO.about.path}
        keywords={PAGE_SEO.about.keywords}
      />
      <section class="py-14 lg:py-24 relative z-0 bg-gray-50">
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
    <h1
        class="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl  text-gray-900 mb-5 md:text-5xl md:leading-normal">
        Welcome to <span class="text-indigo-600">EdLernity Tech </span>
    </h1>
    <p class=" mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">Invest
    where innovation converges with purpose to redefine the landscape of technological solutions. Established with a vision to lead in the ever-evolving tech industry, EdLernity Tech (OPC) Private Limited is committed to delivering cutting-edge products and services that transcend conventional boundaries.</p>


</div>
</section>

<section class="py-14 lg:py-24 relative">
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ">
    <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-9 ">

        <div class="lg:pr-24 flex items-center">
            <div class="data w-full">
                <img src="/Image/employees-are-busy-doing-work.svg" alt="About Us tailwind page"
                    class="block lg:hidden mb-9 mx-auto"/>
                <h2 class="font-manrope font-bold text-4xl lg:text-5xl text-black mb-9 max-lg:text-center">Special Offering</h2>
                <p class="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                Experience the future of education at EdLernity. Beyond traditional courses, we offer immersive Tech internships, bridging theory with real-world application. Work alongside industry experts, gaining invaluable insights and hands-on experience. Whether aspiring to be a Web Developer or UI/UX Designer, unlock your potential with EdLernity today. Better skills develop nations. Join us and discover yours.
                </p>
            </div>
        </div>
        <div class="img-box ">
            <img src="/Image/employees-are-busy-doing-work.svg" alt="About Us tailwind page"
                class="hidden lg:block "/>
        </div>
    </div>
</div>
</section>

<section class=" py-14 lg:py-24 bg-gray-50">
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
  <div class="mb-16 rounded-full">
    <h2 class="text-4xl font-manrope font-bold text-gray-900 text-center">We are ISO Certified</h2>
  </div>

  <div >
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="relative mb-20">
          <div class="max-w-max mx-auto lg:max-w-4xl">
            <p class="text-lg text-gray-500 leading-8 mb-8 text-center">
            EdLernity Tech (OPC) Private Limited is proud to be ISO 9001:2015 certified. This certification reaffirms our commitment to maintaining a high standard of quality in our education services and certification programs related to skill and vocational development. Accredited by the Standards Council of Canada, our certification underscores our dedication to excellence and adherence to international quality standards.
            </p>
          </div>
        </div>
      </div>
      <div class="relative flex w-96 flex-col rounded-xl mx-auto  ">
  <div class="relative mx-4 mt-4 h-96 overflow-hidden rounded-x">
    <img
      src="/Image/Image_20240430_131514_0000.jpg"
      class="h-full w-full object-contain"
    />
  </div>
  
</div>



      
    </div>

  </div>



</div>
</section>
      <div className="mt-10 px-4 md:px-8 lg:px-12">
      

        
        

        <div className="flex flex-wrap justify-center mt-10">
          <div className="w-full md:w-1/2 pr-4 mb-4 md:mb-0 animate__animated animate__backInLeft">
            <img
              src="/Image/about-us.svg"
              alt="About Image"
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/2 animate__animated animate__backInRight space-y-4 flex flex-col  justify-center">
            <h1
              className="text-2xl md:text-xl font-bold mb-4 text-left"
              style={{ color: "#181FC5" }}
            >
              WHO WE ARE
            </h1>
            <h2 className="text-4xl md:text-3xl font-semibold mb-2 text-left">
              We Offer The Best <br /> Carrier
            </h2>

            <div className="mb-4 flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <img
                src="/Image/Industry.png"
                className="w-8 h-8 mb-2 md:mb-0"
                alt="Industry Icon"
              />
              <div className="text-center md:text-left">
                <h4>Industry Expert Instructor</h4>
                <p className="text-gray-700">
                  Unlock the wisdom of industry experts. Our instructors are the
                  guiding stars of your educational journey, illuminating the
                  path to success.
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <img
                src="/Image/Industry.png"
                className="w-8 h-8 mb-2 md:mb-0"
                alt="Industry Icon"
              />
              <div className="text-center md:text-left">
                <h4>Up-to-Date Course Content</h4>
                <p className="text-gray-700">
                  Unlock the wisdom of industry experts. Our instructors are the
                  guiding stars of your educational journey, illuminating the
                  path to success.
                </p>
              </div>
            </div>

            <div className="mb-4 flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <img
                src="/Image/Industry.png"
                className="w-8 h-8 mb-2 md:mb-0"
                alt="Industry Icon"
              />
              <div className="text-center md:text-left">
                <h4>Biggest Student Community</h4>
                <p className="text-gray-700">
                  Unlock the wisdom of industry experts. Our instructors are the
                  guiding stars of your educational journey, illuminating the
                  path to success.
                </p>
              </div>
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

        <div className="flex items-center justify-center bg-white pt-16 px-4 sm:hidden md:hidden">
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

           
          </div>
        </div>
        <div class="text-center p-8">
    <h2 class="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        Why to choose US?
    </h2>

    <div class="flex flex-wrap items-center mt-20 text-left text-center">
        <div class="w-full md:w-3/5 lg:w-1/2 px-4">
            <img src="/Image/Astronaut with space shuttle.gif" alt="gem" class="inline-block rounded w-96 "/>
        </div>
        <div class="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
            <h3 class="font-bold mt-8 text-xl md:mt-0 sm:text-2xl text-[#181FC5]">
            OUR MISSION
            </h3>
            <p class="sm:text-lg mt-6">
            We are on a mission to pioneer advancements in technology,
              creating value for our clients and contributing to the broader
              societal good. Through a relentless pursuit of excellence, ethical
              practices, and a commitment to sustainability, we strive to leave
              a lasting impact on the world.
            </p>
        </div>
    </div>

    <div class="flex flex-wrap items-center mt-20 text-left text-center">
        <div class="w-full md:w-3/5 lg:w-1/2 px-4">
            <img src="/Image/employee-predicts-business-vision.svg" alt="project members" class="inline-block rounded  w-96 "/>
        </div>
        <div class="w-full md:w-2/5 lg:w-1/2 px-4 md:order-first text-center md:text-left lg:pr-12">
            <h3 class="font-bold mt-8 text-xl md:mt-0 sm:text-2xl text-[#181FC5]">
            OUR VISION
            </h3>
            <p class="sm:text-lg mt-6">
            At Edlernity, we envision a future where technology seamlessly integrates with human needs, fostering progress and enhancing lives. Our vision is to be a beacon of innovation, driving positive change through transformative digital solutions.
            </p>
        </div>
    </div>

    
</div>
       
      
      </div>
      <div className="pb-12 mt-15  sm:pb-16">
    <div className="relative">
      <div className="absolute inset-0 h-1/2  "></div>
      <div className="relative max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <dl className="bg-white  rounded-lg shadow-sm sm:grid sm:grid-cols-2">
            <div className="flex flex-col p-6 text-center border-b border-gray-100  sm:border-0 sm:border-r">
              <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 " id="item-1">
                Users
              </dt>
              <dd className="order-1 text-5xl font-extrabold leading-none text-indigo-600 " aria-describedby="item-1" id="starsCount">
                <CountUp end={1000} duration={5}  />+
              </dd>
            </div>
            <div className="flex flex-col p-6 text-center border-t border-b border-gray-100  sm:border-0 sm:border-l sm:border-r">
              <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 ">
                Courses
              </dt>
              <dd className="order-1 text-5xl font-extrabold leading-none text-indigo-600 " id="downloadsCount">
                <CountUp end={12} duration={5} />+
              </dd>
            </div>
            
          </dl>
        </div>
      </div>
    </div>
  </div>
  <section class="bg-white px-4 py-12 md:py-24">
  <div class="max-w-screen-xl mx-auto">
    <h2 class="font-black  text-center text-3xl leading-none uppercase max-w-2xl mx-auto mb-12 text-[#181FC5]">What Our Students
      Are Saying</h2>
      <div class="flex overflow-x-scroll pb-10 hide-scroll-bar pt-3">
          {reviewData.map((testimonial, index) => (
          <div  key={index}  class="inline-block px-2">
              <div className="lg:ml-[5.5rem] md:ml-10 relative rounded-2xl bg-white p-6 shadow shadow-slate-900/10 w-[50rem] h-[19rem] max-w-xs cursor-pointer overflow-hidden  hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <svg aria-hidden="true"
                width="105" height="78" class="absolute opacity-10">
                <path
                  d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z">
                </path>
              </svg>
                <div className="relative">
                <p className="text-lg tracking-tight text-slate-900 overflow-auto h-[10rem]">
  { testimonial.comment}
</p>


                </div>
                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div>
                    <div className="font-display text-base text-slate-900">{testimonial.name}</div>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-50">
                    <img alt="" className="h-14 w-14 object-cover" src={`/Image/user-review-img/${testimonial?.image}`} />
                  </div>
                </figcaption>
              </div>
            </div>
          ))}
          </div>
  </div>
</section>

     
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
