import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CourseCard from './CourseCard';
import VideoModal from './VideoModal';
import BaseLayout from '../../Layout/BaseLayout';
import CourseDetails from './CourseDetails';
import { StarIcon } from '@heroicons/react/solid';
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Rating } from "@material-tailwind/react";
import { NavLink } from 'react-router-dom';
function Ui() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');

    const openModal = (videoUrl) => {
        setCurrentVideo(videoUrl);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setCurrentVideo('');
    };

    const cardData = [
        {
            image: '/Image/Rectangle.png',
            video: 'https://www.youtube.com/embed/udMeRUz-7WY?autoplay=1&mute=1',
        },
    ];

    const badges = [
        { image: '/Image/Badge.png', alt: 'Top Choice Badge', text: 'Top Choice' },
        { image: '/Image/Fire.png', alt: 'Most Popular Badge', text: 'Most Popular' },
        { image: '/Image/Fire.png', alt: 'Best ROI Badge', text: 'Best ROI' },

    ];

    const description = "Creating UX/UI designs using Figma is a highly effective process. Figma, a robust web-based application, offers unparalleled versatility as it transcends platform limitations. Whether you prefer designing within a web browser or through their dedicated desktop applications for Windows and Mac, Figma provides seamless functionality. While it shares similarities with Sketch and Adobe XD, Figma distinguishes itself by excelling in team collaboration and facilitating agile, responsive design processes.";
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

    const reviewData = [
        {
            name: 'John Doe1',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },

        {
            name: 'John Doe2',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },


        {
            name: 'John Doe3',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },

        {
            name: 'John Doe4',
            image: 'https://via.placeholder.com/150',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },


    ];


    const topPicksData = [
        {
            courseName: 'Course 1',
            rating: 5,
            duration: '5.2 hours',
            language: 'English',
            price: '$19.99',
        },
        {
            courseName: 'Course 1',
            rating: 5,
            duration: '5.2 hours',
            language: 'English',
            price: '$19.99',
        },
        {
            courseName: 'Course 1',
            rating: 5,
            duration: '5.2 hours',
            language: 'English',
            price: '$19.99',
        },
        {
            courseName: 'Course 1',
            rating: 5,
            duration: '5.2 hours',
            language: 'English',
            price: '$19.99',
        },
        // Add more data for additional cards
    ];

    const [visibleCards, setVisibleCards] = useState(1);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % reviewData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + reviewData.length) % reviewData.length);
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
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <BaseLayout>
            <Helmet>
                <meta charSet="utf-8" />
                <title>EdLernity | UI / UX</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>

            <h1 className='text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold' style={{ color: "#181FC5" }}>UI/UX Designing </h1>

            <div className="mt-10">
                <div className="flex flex-col lg:flex-row mx-2 lg:mx-24">
                    {cardData.map((course, index) => (
                        <CourseCard key={index} course={course} openModal={openModal} />
                    ))}

                    <CourseDetails badges={badges} description={description} />
                </div>

                <VideoModal isOpen={isOpen} closeModal={closeModal} videoUrl={currentVideo} />
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
                <NavLink to="/payment-method">
                    <button className='text-white text-base sm:text-lg px-8 sm:px-24'>Enroll now</button>
                    </NavLink>
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
            <div className='mt-24'>
                <div className='flex items-center px-4 sm:px-8 md:px-12 lg:justify-center'>
                    <div className='relative bg-gray-300 py-8 sm:py-12 rounded-l-3xl px-4 sm:px-8 md:px-12 overflow-hidden'>
                        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-blue-600'>Earn a Career Certificate</h2>
                        <p className='text-gray-700'>
                            Add this credential to your LinkedIn profile, resume, or CV.
                            Share it on social media and in your performance review.
                        </p>
                    </div>
                    <img src='/Image/Certificate.png' alt='Certificate' className='w-24 sm:w-48 md:w-64 lg:w-96 h-auto ml-[-10px] relative z-10' />
                </div>
            </div>

            <div className='mt-12'>
                <h1 className='text-3xl  mt-10  text-center font-bold ' style={{ color: "#181FC5" }}>UI/UX Design Training Syllabus</h1>
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
                <div className="flex justify-center mt-8 -space-x-4 items-center relative overflow-x-auto">
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2" onClick={prevSlide}>
                        <ChevronLeftIcon className="w-12 h-12 text-gray-600" />
                    </button>

                    <div className="max-w-screen-lg mx-auto mt-10 w-full">
                        <div className="flex items-center justify-center flex-wrap">
                            {reviewData.map((item, index) => (
                                index >= currentSlide && index < currentSlide + visibleCards && (
                                    <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                                        <div className="rounded-md bg-[#D9D9D9]">
                                            <div className="w-full h-48 sm:h-32 mx-auto bg-blue-500 rounded-t-md overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="p-4">
                                                <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                                                <p>{item.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2" onClick={nextSlide}>
                        <ChevronRightIcon className="w-12 h-12 text-gray-600" />
                    </button>
                </div>

                <div className="flex justify-center mt-4 space-x-2">
                    {reviewData.map((_, index) => (
                        <div
                            key={index}
                            className={`dot w-4 h-4 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>

            <div className='mt-12'>
                <h4 className='text-3xl mt-10 lg:ml-10 font-bold text-center' style={{ color: "#181FC5" }}>Our Top Picks for You</h4>
                <div className="flex justify-center items-center mt-6 overflow-x-auto">
                    <div className="flex space-x-4">
                        {topPicksData.map((item, index) => (
                            <div key={index} className="bg-blue-700 rounded-2xl p-8">
                                <h5 className="text-white text-center py-10 text-lg font-semibold">{item.courseName}</h5>
                                <div className="flex items-center justify-between mt-2">
                                    <div className='flex items-center'>
                                        <StarIcon className="w-5 h-5 text-white mr-1" /><span className='text-white'>4.5</span>
                                    </div>
                                    <p className="text-white ml-4">{item.duration} | {item.language}</p>
                                </div>
                                <div className="flex  rounded-2xl justify-between items-center gap-4 mt-4">
                                    <p className="text-white">{item.price}</p>
                                    <NavLink to="/payment-method">
                                        <button className="text-white">Know more {">"} </button>
                                    </NavLink>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </BaseLayout>
    );
}

export default Ui;
















