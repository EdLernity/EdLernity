import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/solid";
import { Button } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

function Success() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const successStories = [
    {
      id: 1,
      image: "/Image/Intern1.png",
      story: "Story 1",
      internshipDetails: "Internship details 1",
    },
    {
      id: 2,
      image: "image_url_2",
      story: "Story 2",
      internshipDetails: "Internship details 2",
    },
    {
      id: 3,
      image: "image_url_3",
      story: "Story 3",
      internshipDetails: "Internship details 3",
    },
    {
      id: 4,
      image: "image_url_4",
      story: "Story 4",
      internshipDetails: "Internship details 4",
    },
    {
      id: 5,
      image: "image_url_5",
      story: "Story 5",
      internshipDetails: "Internship details 5",
    },
    {
      id: 6,
      image: "image_url_6",
      story: "Story 6",
      internshipDetails: "Internship details 6",
    },
    {
      id: 7,
      image: "image_url_7",
      story: "Story 7",
      internshipDetails: "Internship details 7",
    },
    {
      id: 8,
      image: "image_url_8",
      story: "Story 8",
      internshipDetails: "Internship details 8",
    },
    {
      id: 9,
      image: "image_url_9",
      story: "Story 9",
      internshipDetails: "Internship details 9",
    },
    {
      id: 10,
      image: "image_url_10",
      story: "Story 10",
      internshipDetails: "Internship details 10",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % successStories.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + successStories.length) % successStories.length
    );
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    // Adjust the threshold and number of visible cards based on your design
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
    <div>
      <h1
        className="text-2xl text-center font-semibold"
        style={{ color: "#1649FF" }}
      >
        Stay in the loop with the latest updates in the tech industry
      </h1>
      <div className="flex justify-center rounded-lg mt-8">
        <Button className="">Success Stories</Button>
      </div>
      <div className="flex  justify-center mt-8 -space-x-4 flex-col md:flex-row xl:flex:row items-center">
        <div>
          <Avatar
            variant="circular"
            alt="user 1"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <Avatar
            variant="circular"
            alt="user 2"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
          />
          <Avatar
            variant="circular"
            alt="user 3"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
          />
          <Avatar
            variant="circular"
            alt="user 4"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
          />
          <Avatar
            variant="circular"
            alt="user 5"
            className="border-2 border-white hover:z-10 focus:z-10"
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
          />
        </div>
        <div
          className="ml-2 flex items-center flex-col md:flex-row xl:flex-row my-4"
          style={{ marginLeft: "20px" }}
        >
          <p className="text-black">10,000+ Students</p>
          <div className="flex my-4 xl:md-4 md:ml-4">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} className="w-5 h-5 text-yellow-500 " />
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Carousel */}
      <div className="flex justify-center mt-8 -space-x-4 items-center relative overflow-x-auto">
        <button
          className="absolute left-[56px] top-1/2 transform -translate-y-1/2"
          onClick={prevSlide}
        >
          <ChevronLeftIcon className="w-12 h-12 text-gray-600" />
        </button>

        {/* Carousel Content */}
        {successStories.map(
          (story, index) =>
            index >= currentSlide &&
            index < currentSlide + visibleCards && (
              <div
                key={story.id}
                className={`slide w-full mx-auto`}
                style={{
                  width: "15rem",
                  marginLeft: "2rem",
                  marginRight: "4rem",
                }}
              >
                <div className="card p-4 border gap-4">
                  <Avatar
                    variant="circular"
                    alt={`user ${story.id}`}
                    className="border-2 border-white hover:z-10 focus:z-10 mb-4"
                    src={story.image}
                  />
                  <div className="flex items-center flex-row mb-2">
                    <p className="text-black">{story.story}</p>
                    {[...Array(5)].map((_, starIndex) => (
                      <StarIcon
                        key={starIndex}
                        className="w-5 h-5 text-yellow-500 ml-2"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{story.internshipDetails}</p>
                </div>
              </div>
            )
        )}

        <button
          className="absolute right-[56px] top-1/2 transform -translate-y-1/2"
          onClick={nextSlide}
        >
          <ChevronRightIcon className="w-12 h-12 text-gray-600" />
        </button>
      </div>

      {/* Circle Indicators */}
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
  );
}

export default Success;
