import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/solid";
import { Button } from "@material-tailwind/react";
import { RiDoubleQuotesL } from "react-icons/ri";

function Success() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagePaths, setImagePaths] = useState([]);

  const successStories = [
    {
      id: 1,
      userProfileImage: "sejal-kesharwani.jpeg",
      story:
     "Through interactive lectures, practical exercises, and hands-on projects, Edlernity ensures that students not only grasp the fundamentals but also master advanced concepts in programming and technology. Our dedicated instructors are committed to providing personalized support, guiding students every step of the way towards achieving their career goals in IT.",
      userName: "Surabhi Kesarwani",
    },
    {
      id: 2,
      userProfileImage: "nikhil-reji.jpeg",
      story:
        "I recently came across membership of EdLernity, and I must say, it was a great experience. The platform's intuitive interface and engaging content made learning not only easy but also enjoyable. The courses structure was well-organized, guiding me through each topic seamlessly. I would recommend to take up the membership and explore the courses.",
      userName: "Nikhil Reji",
    },
    {
      id: 3,
      userProfileImage: "sraadha-gupta.jpeg",
      story:
        "Great course, so many important topics covered in depth. There were many assessments which made us confident with our skills. I would like to enroll in more courses offered by EdLernity.I highly recommend EdLernity to anyone looking to enhance their skills and advance their career in the IT industry. The thorough coverage and rigorous assessments truly solidify your knowledge and competence in various key areas.",
      userName: "Shraddha Gupta",
    },
    {
      id: 4,
      userProfileImage: "ali-akbar.jpeg",
      story:
        "EdLernity offers different courses that's helpfull for People who are looking to improve their skills.They have Technical courses and many more.The courses are well structured with clear objectives and engaging contents.Making complex topics easier to understand.Edlernity provides a valuable resource for life long learners. The course has helped provide a starting point for understanding, which certainly will prove useful in my current work/projects.",
      userName: "Ali Akbar P",
    },
    {
      id: 5,
      userProfileImage: "manjari-rastogi.jpeg",
      story:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts Edlernity's comprehensive courses cover everything from basic programming concepts to advanced software development techniques.",
      userName: "Manjari Rastogi",
    },
    {
      id: 6,
      userProfileImage: "abdul-wahab.jpeg",
      story:
        "Edlernity is one of the most amazing platform to get a chance for learning and improving all technical skills required for all IT students it's worthy to have an opportunity to learn and acquire skills of languages that provided by their inspired and professional teachers ..happy learning with EdLernity.",
      userName: "Abdul Wahab",
    },
    {
      id: 7,
      userProfileImage: "r-muskan-zehra.jpeg",
      story:
        "I highly recommend this course provided by EdLernity to anyone looking to take their Python skills to the next level. Whether you're a beginner or an experienced programmer, you'll find valuable insights and practical knowledge that will enhance your proficiency in Python programming. Best of luck on your learning journey.",
      userName: "R Muskan Zehra",
    },
    {
      id: 8,
      userProfileImage: "md-burhanuddin.jpeg",
      story:
        "Packed with valuable insights and applicable skills. Worth every penny! Impressed with EdLernity courses! Easy-to-follow format, great community support, and actionable takeaways.Courses are top-notch Comprehensive curriculum, interactive exercises, and expert guidance. A must-try!.",
      userName: "Md Burhanuddin",
    },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = require.context(
          "../../../public/Image/user-review-img",
          false,
          /\.(png|jpe?g|svg)$/
        );
        const paths = images.keys().map(images);
        const formattedPaths = paths.map((path) => {
          const splitPath = path.split(".");
          const splitPath2 = splitPath[0].split("/");
          const formattedPath = `${splitPath2[3]}.${splitPath[2]}`;
          return formattedPath;
        });
        setImagePaths(formattedPaths);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1
        className="text-5xl text-center font-extrabold mb-10"
        style={{ color: "#1649FF" }}
      >
        Stay in the loop with the latest updates in the tech industry
      </h1>
      <div className="flex flex-col bg-[#F1F0F0] bg-cover bg-center text-white p-6 min-h-[600px] md:p-12 xl:p-16">
        {/* Carousel */}
        <div className="flex flex-col md:flex-row xl:flex-row justify-between items-center p-4 md:p-16 xl:p-24">
          {/* left side image */}
          <div className="relative w-full md:w-[40%] mb-4 md:mb-0">
            <img
              src="/Image/Rectangle_Girl_Reviewer.png"
              className="rounded-[57px] drop-shadow-[18px_12px_4px_gray] w-full"
              alt="reviewer_img"
            />
            <div className="bg-[#181FC5] rounded-full w-[90px] h-[90px] absolute -right-6 -top-6 z-10"></div>
            <p className="text-white absolute text-5xl right-0 -top-1 z-10">
              <RiDoubleQuotesL />
            </p>
          </div>

          {/* right side content */}
          <div className="flex flex-col w-full md:w-[60%] xl:w-[50%] p-4 md:p-0 xl:p-0 justify-between">
            <h1 className="text-2xl md:text-4xl xl:text-5xl font-extrabold text-black mb-4 md:mb-6 xl:mb-6">
              What students say about us
            </h1>
            <p className="text-[#6C6868] mb-4 md:mb-6 xl:mb-6">
              {successStories[currentSlide].story}
            </p>
            <div className="flex items-center mb-4 md:mb-6 xl:mb-6">
              <img
                src={`/Image/user-review-img/${successStories[currentSlide].userProfileImage}`}
                className="w-24 h-24 rounded-full object-cover drop-shadow-[10px_6px_6px_gray]"
                alt="user_image"
              />
              <p className="pl-2 md:pl-4 xl:pl-4 text-base md:text-2xl xl:text-2xl font-bold text-[#302E2E]">{`- ${successStories[currentSlide].userName}`}</p>
            </div>
            <div className="flex justify-center space-x-2 mb-2 md:mb-4 xl:mb-4">
              {successStories.map((_, index) => (
                <div
                  key={index}
                  className={`dot w-3 h-3 md:w-4 md:h-4 xl:w-4 xl:h-4 rounded-full ${index === currentSlide ? "bg-[#181FC5]" : "bg-gray-300"
                    }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center rounded-lg mb-2 mt-8 animate__animated animate__backInUp">
          <Button className="">Success Stories</Button>
        </div>
        <div className="flex  justify-center my-8 -space-x-4 flex-col md:flex-row xl:flex:row items-center animate__animated animate__backInUp">
          <div className="-space-x-4">
            {imagePaths.map((imgPath, index) => (
              <Avatar
                key={index}
                variant="circular"
                className="border-2 border-white hover:z-10 focus:z-10 drop-shadow-[-6px_8px_4px_gray]"
                src={`/Image/user-review-img/${imgPath}`}
                alt={`Image ${index}`}
              />
            ))}
          </div>
          <div
            className="ml-2 flex items-center flex-col md:flex-col xl:flex-col my-2"
            style={{ marginLeft: "20px" }}
          >
            <p className="text-black">10,000+ Students</p>
            <div className="flex mt-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon key={index} className="w-5 h-5 text-yellow-500 " />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Success;









