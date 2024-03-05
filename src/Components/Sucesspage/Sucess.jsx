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
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "sejal-kesharwani.jpeg",
      story:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      userName: "Surabhi Kesarwani",
    },
    {
      id: 2,
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "nikhil-reji.jpeg",
      story:
        "I recently came across membership of EdLernity, and I must say, it was a great experience. The platform's intuitive interface and engaging content made learning not only easy but also enjoyable. The courses structure was well-organized, guiding me through each topic seamlessly. I would recommend to take up the membership and explore the courses.",
      userName: "Nikhil Reji",
    },
    {
      id: 3,
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "sraadha-gupta.jpeg",
      story:
        "Great course, so many important topics covered in depth. There were many assessments which made us confident with our skills. I would like to enroll in more courses offered by EdLernity.",
      userName: "Shraddha Gupta",
    },
    {
      id: 4,
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "ali-akbar.jpeg",
      story:
        "EdLernity offers different courses that's helpfull for People who are looking to improve their skills.They have Technical courses and many more.The courses are well structured with clear objectives and engaging contents.Making complex topics easier to understand.Edlernity provides a valuable resource for life long learners. The course has helped provide a starting point for understanding, which certainly will prove useful in my current work/projects.",
      userName: "Ali Akbar P",
    },
    {
      id: 5,
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "manjari-rastogi.jpeg",
      story:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      userName: "Manjari Rastogi",
    },
    {
      id: 6,
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "abdul-wahab.jpeg",
      story:
        "Edlernity is one of the most amazing platform to get a chance for learning and improving all technical skills required for all IT students it's worthy to have an opportunity to learn and acquire skills of languages that provided by their inspired and professional teachers ..happy learning with EdLernity.",
      userName: "Abdul Wahab",
    },
    {
      id: 7,
      image: "Rectangle_Girl_Reviewer.png",
      userProfileImage: "r-muskan-zehra.jpeg",
      story:
        "I highly recommend this course provided by EdLernity to anyone looking to take their Python skills to the next level. Whether you're a beginner or an experienced programmer, you'll find valuable insights and practical knowledge that will enhance your proficiency in Python programming. Best of luck on your learning journey.",
      userName: "R Muskan Zehra",
    },
    {
      id: 8,
      image: "Rectangle_Girl_Reviewer.png",
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
          "../../../public/Image/user-review-picture",
          false,
          /\.(png|jpe?g|svg)$/
        );
        const paths = images.keys().map(images);
          const formattedPaths = paths.map((path) => {
            const splitPath = path.split(".");
            const splitPath2 = splitPath[0].split("/");
            const formattedPath = `${splitPath2[3]}.${splitPath[2]}`; // Combine folder name and file name
            return formattedPath; // Assigning the second occurrence
        });
        setImagePaths(formattedPaths);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <h1
        className="text-5xl text-center font-extrabold mb-10"
        style={{ color: "#1649FF" }}
      >
        Stay in the loop with the latest updates in the tech industry
      </h1>
      <div className="flex flex-col bg-[#F1F0F0] bg-cover bg-center text-white p-6 min-h-[600px]">
        {/* Carousel */}
        <div className="flex justify-between items-center p-16">
          <div className="relative w-auto animate__animated animate__backInLeft">
            <img
              src={`/Image/${successStories[currentSlide].image}`}
              className="rounded-[57px] drop-shadow-[18px_12px_4px_gray]"
              alt="reviewer_img"
            />
            <div className="bg-[#181FC5] rounded-full w-[90px] h-[90px] absolute -right-6 -top-6 z-10"></div>
            <p className="text-white absolute text-5xl right-0 -top-1 z-10">
              <RiDoubleQuotesL />
            </p>
          </div>
          <div className="flex flex-col p-12 w-[50%] justify-between animate__animated animate__backInRight">
            <h1 className="text-5xl font-extrabold text-black w-[70%] py-6">
              What students say about us
            </h1>
            <p className="text-[#6C6868] py-6 min-h-[200px]">
              {successStories[currentSlide].story}
            </p>
            <div className="flex py-12 items-center">
              <img
                src={`/Image/user-review-picture/${successStories[currentSlide].userProfileImage}`}
                className="w-24 h-24 rounded-full object-cover drop-shadow-[10px_6px_6px_gray]"
                alt="user_image"
              />
              <p className="pl-4 text-2xl font-bold text-[#302E2E]">{`- ${successStories[currentSlide].userName}`}</p>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {successStories.map((_, index) => (
                <div
                  key={index}
                  className={`dot w-4 h-4 rounded-full ${
                    index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center rounded-lg mt-8 animate__animated animate__backInUp">
          <Button className="">Success Stories</Button>
        </div>
        <div className="flex  justify-center mt-8 -space-x-4 flex-col md:flex-row xl:flex:row items-center animate__animated animate__backInUp">
          <div className="-space-x-4">
            {imagePaths.map((imgPath, index) => (
              <Avatar
                key={index}
                variant="circular"
                className="border-2 border-white hover:z-10 focus:z-10 drop-shadow-[-6px_8px_4px_gray]"
                src={`/Image/user-review-picture/${imgPath}`}
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
