import React, { useState, useEffect } from "react";
import BaseLayout from "../../Layout/BaseLayout";
import { Helmet } from "react-helmet";
import CountUp from "react-countup";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Rating } from "@material-tailwind/react";
import './About.css';
import { RiDoubleQuotesL, RiDoubleQuotesR} from "react-icons/ri";
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
              src="/Image/About23.png"
              alt="About Image"
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/2 animate__animated animate__backInRight space-y-4 flex flex-col  justify-center">
            <h1 className="text-2xl md:text-xl font-bold mb-4 text-left" style={{ color: "#181FC5" }}>
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
                  guiding stars of your educational journey, illuminating the path
                  to success.
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
                  guiding stars of your educational journey, illuminating the path
                  to success.
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
                  guiding stars of your educational journey, illuminating the path
                  to success.
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
            <span className="inline-flex"><RiDoubleQuotesL/></span>
              We are on a mission to pioneer advancements in technology,
              creating value for our clients and contributing to the broader
              societal good. Through a relentless pursuit of excellence, ethical
              practices, and a commitment to sustainability, we strive to leave
              a lasting impact on the world. <span className="inline-flex"><RiDoubleQuotesR/></span>
            </p>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0 animate__animated animate__backInLeft">
            <h2 className="font-bold text-2xl" style={{ color: "#181FC5" }}>
              OUR VISION
            </h2>
            <p className="text-2xl">
            <span className="inline-flex"><RiDoubleQuotesL/></span>
              At Edlernity, we envision a future where technology seamlessly
              integrates with human needs, fostering progress and enhancing
              lives. Our vision is to be a beacon of innovation, driving
              positive change through transformative digital solutions.
              <span className="inline-flex"><RiDoubleQuotesR/></span>
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
                          <div className="" style={{ marginLeft: "4px", marginTop: "12px" }}>
                            <img
                              src={`/Image/user-review-img/${item?.image}`}
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
                className={`dot w-4 h-4 mb-12 rounded-full ${index === currentSlide ? "bg-[#353BCC]" : "bg-gray-300"
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
