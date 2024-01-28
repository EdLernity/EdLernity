import React from 'react';

function Herosection() {
  const heroSectionStyle = {
    backgroundImage: "url('/Image/Background.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    padding: '50px',
    textAlign: 'center',
    minHeight: '300px', // Set a default height for smaller screens
  };

  const heroContentStyle = {
    maxWidth: '100%',
    margin: '0 auto',
  };

  const mediaQueryStyle = {
    '@media (max-width: 768px)': {
      heroSectionStyle: {
        padding: '30px',
        minHeight: '200px', // Adjust height for smaller screens
      },
    },
    '@media (min-width: 769px)': {
      heroSectionStyle: {
        minHeight: '600px', // Adjust height for larger screens (laptops and above)
      },
    },
  };

  return (
    <div style={{ ...heroSectionStyle, ...mediaQueryStyle['@media (max-width: 768px)'].heroSectionStyle, ...mediaQueryStyle['@media (min-width: 769px)'].heroSectionStyle }}>
      <div style={heroContentStyle}>
        {/* <h1 className='text-white text-2xl text-start'>"EdLernity - Where knowledge meets eternity"</h1>
        <p className='text-2xl'>EdLernity provides you industry-leading courses on-demand & online.</p>
        <p className='text-2xl'>Kickstart your career, advance in your role, or upskill as a freelancer with industry-leading courses and products.</p> */}
      </div>
    </div>
  );
}

export default Herosection;
