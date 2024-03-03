import React from "react";
import "animate.css";

function Internship() {
  const cardStyle = {
    position: "relative",
    width: "300px",
    margin: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "30px",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "20px",
  };

  const textStyle = {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff", // Text color
    fontSize: "2.0rem", // Adjust font size as needed
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Optional text shadow for better readability
  };

  const intershipData = [
    {
      text: "One time membership",
      img: "pic1.png",
    },
    {
      text: "Key Features ",
      img: "pic2.png",
    },
    {
      text: " Upcoming internships ",
      img: "pic3.png",
    },
    {
      text: "EdLernity Academics",
      img: "pic4.png",
    },
  ];

  return (
    <div className="flex flex-wrap justify-around pt-1 px-20 pb-20 animate__animated animate__backInLeft">
      {intershipData.map((data, index) => (
        <div
          key={index}
          style={cardStyle}
          className="relative w-300 m-10 text-center shadow-lg rounded overflow-hidden"
        >
          <img
            src={`/Image/internship/${data.img}`}
            alt="Internship 1"
            style={imageStyle}
            className="w-full h-auto rounded"
          />
          <div
            style={textStyle}
            className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl"
          >
            {data.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Internship;
