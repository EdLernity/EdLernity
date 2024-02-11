import React, { useState } from 'react'
import Modal from "react-modal";
import Navbar from '../Headers/Navbar'
import { StarIcon } from '@heroicons/react/solid';
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";

import { Rating } from "@material-tailwind/react";
import Footer from '../Footerpage/Footer';
import BaseLayout from '../../Layout/BaseLayout';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function Ui() {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    function Icon({ id, open }) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        );
    }

    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => setOpen(open === value ? 0 : value);




    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => setCurrentSlide(index),
    };


    const cardData = [
        {
            name: 'John Doe',
            image: 'https://via.placeholder.com/150', // Replace with the actual image URL
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },

        {
            name: 'John Doe',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },


        {
            name: 'John Doe',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },

        {
            name: 'John Doe',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        
        // Add more data objects for each card
    ];
    return (

        <BaseLayout>

            <h1 className='text-3xl mt-10 lg:ml-10 font-bold ' style={{ color: "#181FC5" }}>UI/UX Designing </h1>

            <div>
                <div className="mt-10">
                    <div className="flex py-10 flex-col md:flex-row ml-4 px-12">

                        <div className="md:w-1/3 ml-4  md:ml-10 mt-4 md:mt-0">
                            <div className="" style={{ position: "relative" }}>
                                <img
                                    src="/Image/Rectangle.png"
                                    alt="error"
                                    className="section3 bg-gray-500 rounded-2xl"
                                    style={{ width: "100%", maxWidth: "300px", height: "220px" }}
                                />
                                <button
                                    className="rounded-3xl w-12 h-12 px-4 cursor-pointer"
                                    onClick={openModal}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "35%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                >
                                    <img
                                        src="/Image/Polygon 1.svg"
                                        alt="Play"
                                        className="bg-[#181FC5] rounded-3xl w-12 h-12 px-4 cursor-pointer"
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "40%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="md:w-2/3">

                            <div className='flex items-center mt-5 justify-between flex-wrap'>

                                <div className='bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto'>
                                    <img src='/Image/Badge.png' alt='Top Choice Badge' className='w-6 h-6' />
                                    <h4 className='text-white font-semibold text-sm'>Top Choice</h4>
                                </div>

                                <div className='bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto'>
                                    <img src='/Image/Fire.png' alt='Most Popular Badge' className='w-6 h-6' />
                                    <h4 className='text-white font-semibold text-sm'>Most Popular</h4>
                                </div>

                                <div className='bg-[#181FC5] flex items-center px-4 p-1 gap-2 w-full sm:w-auto'>
                                    <img src='/Image/Fire.png' alt='Best ROI Badge' className='w-6 h-6' />
                                    <h4 className='text-white font-semibold text-sm'>Best ROI</h4>
                                </div>

                            </div>
                            <hr className=' mt-5 text-black font-bold' style={{ color: "#000000" }}></hr>


                            <p
                                className="text-base md:text-lg leading-relaxed"
                                style={{ fontFamily: "Roboto" }}
                            >
                                Creating UX/UI designs using Figma is a highly effective process. Figma, a
                                robust web-based application, offers unparalleled versatility as it transcends
                                platform limitations. Whether you prefer designing within a web browser or
                                through their dedicated desktop applications for Windows and Mac, Figma
                                provides seamless functionality. While it shares similarities with Sketch and
                                Adobe XD, Figma distinguishes itself by excelling in team collaboration and
                                facilitating agile, responsive design processes.
                            </p>
                        </div>
                    </div>

                    <Modal
                        isOpen={isOpen}
                        onRequestClose={closeModal}
                        style={{
                            overlay: {
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            },
                            content: {
                                top: "50%",
                                left: "50%",
                                right: "auto",
                                bottom: "auto",
                                marginRight: "-50%",
                                transform: "translate(-50%, -50%)",
                                width: "80%",
                                maxWidth: "800px",
                                padding: "0",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            },
                        }}
                    >
                        {/* <iframe
                            title="Video"
                            width="100%"
                            height="400"
                            src="https://www.youtube.com/embed/Bv3oewhYAv8?autoplay=1&mute=1"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                         */}

                        <iframe
                            title="Video"
                            width="100%"
                            height="400"
                            src="https://www.youtube.com/embed/udMeRUz-7WY?autoplay=1&mute=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>

                        <button
                            className=""
                            onClick={closeModal}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                cursor: "pointer",
                                background: "white",
                                border: "none",
                                zIndex: 1,
                            }}
                        >
                            {/* Cross Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="#000"
                            >
                                <path d="M6.293 6.293a1 1 0 0 1 1.414 0L12 10.586l4.293-4.293a1 1 0 0 1 1.414 1.414L13.414 12l4.293 4.293a1 1 0 0 1-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L10.586 12 6.293 7.707a1 1 0 0 1 0-1.414z" />
                            </svg>
                        </button>
                    </Modal>
                </div>
            </div>

            <div className='flex items-center mt-5 gap-24  justify-center flex-wrap'>

                <div className='bg-[#181FC5] flex items-center px-4  p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto'>
                    <img src='/Image/Badge.png' alt='Top Choice Badge' className='w-6 h-6' />
                    <h4 className='text-white font-semibold text-sm'>20 Lectures</h4>
                </div>

                <div className='bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto'>
                    <img src='/Image/Fire.png' alt='Most Popular Badge' className='w-6 h-6' />
                    <h4 className='text-white font-semibold text-sm'>3.5 hours</h4>
                </div>

                <div className='bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto'>
                    <img src='/Image/Fire.png' alt='Most Popular Badge' className='w-6 h-6' />
                    <h4 className='text-white font-semibold text-sm'>English</h4>
                </div>

                <div className='bg-[#181FC5] flex items-center px-4 p-1 gap-2 w-full sm:w-auto'>
                    <img src='/Image/Fire.png' alt='Best ROI Badge' className='w-6 h-6' />
                    <h4 className='text-white font-semibold text-sm'>Life Time</h4>
                </div>



            </div>

            <div className='item-center flex justify-center mt-8 sm:mt-24'>
                <div className='bg-[#2F35CB] rounded-2xl px-4 sm:px-12 py-2 sm:p-3'>
                    <button className='text-white text-base sm:text-lg px-8 sm:px-24'>Enroll now</button>
                </div>
            </div>

            <div className="ml-2 flex justify-center mt-5 items-center flex-row" style={{ marginLeft: '20px' }}>
                {[...Array(5)].map((_, index) => (
                    <StarIcon key={index} className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#353BCC" }} />
                ))}
                <p className="ml-2 text-xs sm:text-sm" style={{ color: "#353BCC" }}>5 Reviews</p>
                <span className='ml-4 text-xs sm:text-sm' style={{ color: "#353BCC" }}>
                    ₹699
                </span>
            </div>


            {/* <div className='mt-24'>
                <div className='  flex items-center justify-center  rounded-lg'>
                    <div className='flex bg-gray-300 py-12 rounded-3xl px-12 flex-col'>
                        <h2 className='text-3xl font-bold mb-4 ' style={{color:"#393FCE"}}>Earn a Career Certificate</h2>
                        <p className='text-gray-700'>
                            Add this credential to your LinkedIn profile, resume, or CV.
                            Share it on social media and in your performance review.
                        </p>
                    </div>
                    <img src='/Image/Certificate.png' alt='Certificate Image' className='w-96' />
                </div>
            </div> */}
            <div className='mt-24'>
                <div className='flex items-center px-4 sm:px-8 md:px-12 lg:justify-center rounded-lg'>
                    <div className='bg-gray-300 py-8 sm:py-12 rounded-3xl px-4 sm:px-8 md:px-12'>
                        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-blue-600'>Earn a Career Certificate</h2>
                        <p className='text-gray-700'>
                            Add this credential to your LinkedIn profile, resume, or CV.
                            Share it on social media and in your performance review.
                        </p>
                    </div>
                    <img src='/Image/Certificate.png' alt='Certificate Image' className='w-24 sm:w-48 md:w-64 lg:w-96 h-auto' />
                </div>
            </div>


            <div className='mt-12'>
                <h4 className='text-3xl mt-10 lg:ml-10 font-bold ' style={{ color: "#181FC5" }}>UI/UX Design Training Syllabus</h4>
                <div className='mt-12 items-center justify-center px-12'>
                    <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(1)} style={{ color: "#181FC5" }}> What is the primary goal of UI/UX design?</AccordionHeader>
                        <AccordionBody>
                            The primary goal of UI/UX design is to create a seamless and enjoyable user experience by focusing on the user's needs, preferences, and behaviors. UI design (User Interface) deals with the visual elements and interactive aspects of a product, while UX design (User Experience) encompasses the overall feel and functionality of the product, ensuring it meets the user's expectations and provides a positive interaction.
                        </AccordionBody>
                    </Accordion>
                    <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(2)} style={{ color: "#181FC5" }}>
                            How can responsive design contribute to a better user experience?
                        </AccordionHeader>
                        <AccordionBody>
                            Responsive design is crucial for a better user experience as it ensures that a website or application adapts and functions well across various devices and screen sizes. By employing responsive design principles, UI/UX designers can create a consistent and user-friendly experience, reducing the need for zooming or horizontal scrolling. This approach enhances accessibility and usability, contributing to a more enjoyable and efficient interaction with the product.
                        </AccordionBody>
                    </Accordion>
                    <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(3)} style={{ color: "#181FC5" }}>
                            Explain the importance of user testing in the UI/UX design process.
                        </AccordionHeader>
                        <AccordionBody>
                            User testing is a critical phase in the UI/UX design process as it allows designers to gather valuable feedback from real users. By observing how users interact with a prototype or a live product, designers can identify pain points, usability issues, and areas for improvement. This iterative process helps refine the design, ensuring that the final product aligns with user expectations and provides a satisfying and intuitive experience. Regular user testing is essential for creating user-centric designs and continuously enhancing the overall UI/UX.


                        </AccordionBody>
                    </Accordion>
                </div>
            </div>

            <div className='mt-12'>
                <h1 className='text-center font-bold text-3xl' style={{ color: "#181FC5" }}>Review from Learners</h1>
                <div className="flex flex-col gap-4">

                    <div className="flex mt-5 justify-center items-center">

                        <Rating readonly value={4} ratedColor="blue" />
                        <span className="text-gray-600 ml-2">4.3 Reviews</span>
                    </div>


                </div>

                <div className="max-w-screen-lg mx-auto mt-10">
                    <div className="flex items-center justify-center">
                        {cardData.map((item, index) => (
                            <div key={index} className="w-1/4 p-4">
                                <div className="rounded-md bg-[#D9D9D9]">
                                    <div className="w-full h-24 mx-auto bg-blue-500 rounded-t-md overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                                        <p>{item.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        {[0, 1, 2, 3].map((index) => (
                            <input
                                key={index}
                                type="radio"
                                id={`radio${index}`}
                                name="carousel"
                                checked={currentSlide === index}
                                onChange={() => setCurrentSlide(index)}
                                className="hidden"
                            />
                        ))}
                        {[0, 1, 2, 3].map((index) => (
                            <label
                                key={index}
                                htmlFor={`radio${index}`}
                                className={`w-4 h-4 mx-1 rounded-full cursor-pointer ${currentSlide === index ? 'bg-blue-700' : 'bg-gray-300'
                                    }`}
                            ></label>
                        ))}
                    </div>
                </div>
            </div>
        </BaseLayout>

    )
}

export default Ui
