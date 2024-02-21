import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

function Offer() {
    return (
        <>
            <div className='px-8'>
                <h1 className='mt-12 text-2xl' style={{ color: "#1649FF" }}>What EdLernity offers you?</h1>
            </div>

            <div className="flex flex-wrap justify-around p-8">
                {/* Card 1 */}
                <div className="max-w-sm rounded overflow-hidden border shadow-lg m-4">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Self Placed Courses</div>
                        <p className="text-gray-700 text-base">
                            Learn & Up skill via online Courses.
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between justify-end">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="max-w-sm rounded overflow-hidden border shadow-lg m-4">
                    {/* ... (similar structure for Card 2) */}
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Interactive practice
                            platforms</div>
                        <p className="text-gray-700 text-base">
                            Learn Through Hands on
                            Coding Experience
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between justify-end">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="max-w-sm rounded overflow-hidden border shadow-lg m-4">
                  
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Live Classes</div>
                        <p className="text-gray-700 text-base">
                            Interact with Professional
                            tutors with Live classes

                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between justify-end">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>
                <div className="max-w-sm rounded overflow-hidden border shadow-lg m-4">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Self Placed Courses</div>
                        <p className="text-gray-700 text-base">
                            Learn & Up skill via online Courses.
                        </p>
                    </div>
                    <div className="px-6 py-4 flex items-center  justify-between justify-end">
                        <button className="flex items-center gap-3 text-white font-bold py-2 px-4 rounded" style={{ color: "#1649FF" }}>
                            Take a look
                            <span className=""><FaArrowRight /></span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Offer;
