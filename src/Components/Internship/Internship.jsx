import React from 'react';

function Internship() {
    // const cardContainerStyle = {
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     justifyContent: 'space-around',
    //     padding: '20px',
    // };

    const cardStyle = {
        position: 'relative',
        width: '300px',
        margin: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
    };

    const textStyle = {
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff', // Text color
        fontSize: '2.0rem', // Adjust font size as needed
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Optional text shadow for better readability
    };

    return (
        <div className="flex flex-wrap justify-around p-20">
            <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded overflow-hidden">
                <img src='/Image/Intern1.png' alt='Internship 1' style={imageStyle} className="w-full h-auto rounded" />
                <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
                    Key Features
                </div>
            </div>

            <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded overflow-hidden">
                <img src='/Image/Intern1.png' alt='Internship 1' style={imageStyle} className="w-full h-auto rounded" />
                <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
                    Key Features2
                </div>
            </div>
            <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded overflow-hidden">
                <img src='/Image/Intern2.png' alt='Internship 2' style={imageStyle} className="w-full h-auto rounded" />
                <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
                    One-time Membership
                </div>
            </div>
            <div style={cardStyle} className="relative w-300 m-10 text-center shadow-lg rounded overflow-hidden">
                <img src='/Image/Intern3.png' alt='Internship 3' style={imageStyle} className="w-full h-auto rounded" />
                <div style={textStyle} className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl">
                    Upcoming Internships
                </div>
            </div>
        </div>
    );
}

export default Internship;
