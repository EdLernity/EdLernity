import React from 'react';
function Herosection() {
  const heroSectionStyle = {
    backgroundImage: "url('/Image/Background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    padding: '50px',
    textAlign: 'center',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative', // Make the position relative for overlay
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity as needed
    backdropFilter: 'blur(4px)', // Adjust the blur intensity as needed
  };

  const heroContentStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    zIndex: 1, // Ensure text is above the overlay
  };

  return (
    <div style={heroSectionStyle}>
      <div style={overlayStyle}></div>
      <div style={heroContentStyle}>
        <h1 className='text-white text-5xl font-bold text-center max-sm:text-xl' style={{ color: "#1539CF" }}>‘’EdLernity -Where knowledge meets edlernity’’</h1>
        <p className='text-center mt-5 text-2xl'>EdLernity Provides you Industry-leading Courses On-demand & Online </p>
        <p className='mt-8 text-lg'>Kickstart your career, advance in your role, or upskill as a Free lancer with industry-leading Courses and products</p>
      </div>
    </div>
  );
}

export default Herosection;
