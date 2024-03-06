import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Offer() {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/courses/overview")
    }

    return (
        <div className='my-8 animate__animated animate__backInLeft'>
            <div className='px-12 '>
                <h1 className='md:mt-12 ml-8 font-bold text-4xl' style={{ color: "#1649FF" }}>What EdLernity offers you?</h1>
            </div>

            <div className="flex flex-wrap p-12 px-16 justify-between drop-shadow-[6px_3px_4px_gray]">
                {/* Card 1 */}
                <div className="max-w-sm flex flex-col justify-between rounded overflow-hidden border shadow-xl m-4 flex-1 ">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Self paced Courses</div>
                        <p className="text-gray-700 text-base inline bg-[#f8f2cb]">
                            Learn & Up skill via online Courses.
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between cursor-pointer" onClick={handleClick}>
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="max-w-sm flex flex-col justify-between rounded overflow-hidden border shadow-lg m-4 flex-1">
                    {/* ... (similar structure for Card 2) */}
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Interactive practice
                            platforms</div>
                        <p className="text-gray-700 text-base inline bg-[#d4f8e7]">
                            Learn Through Hands on
                            Coding Experience
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="max-w-sm rounded flex flex-col justify-between overflow-hidden border shadow-lg m-4 flex-1">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Live Classes</div>
                        <p className="text-gray-700 text-base inline bg-[#e3defd]">
                            Interact with Professional
                            tutors with Live classes

                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Offer;
