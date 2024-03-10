import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Offer() {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/courses/overview")
    }

    return (
        <div className='my-8 px-4 sm:px-8 lg:px-16 xl:px-20 animate__animated animate__backInLeft'>
            <h1 className='md:mt-12 font-bold text-4xl text-center mb-8' style={{ color: "#1649FF" }}>What EdLernity offers you?</h1>

            <div className="flex flex-wrap justify-center items-stretch gap-4">
                {/* Card 1 */}
                <div className="max-w-sm rounded overflow-hidden border shadow-xl m-4 ">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Self-paced Courses</div>
                        <p className="text-gray-700 text-base bg-[#f8f2cb] p-2 rounded">
                            Learn & Upskill via online courses.
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-center cursor-pointer">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }} onClick={handleClick}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="max-w-sm rounded overflow-hidden border shadow-lg m-4">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Interactive Practice Platforms</div>
                        <p className="text-gray-700 text-base bg-[#d4f8e7] p-2 rounded">
                            Learn through hands-on coding experience.
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-center cursor-pointer">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }} onClick={handleClick}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="max-w-sm rounded overflow-hidden border shadow-lg m-4">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Live Classes</div>
                        <p className="text-gray-700 text-base bg-[#e3defd] p-2 rounded">
                            Interact with professional tutors with live classes.
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-center cursor-pointer">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }} onClick={handleClick}>
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
