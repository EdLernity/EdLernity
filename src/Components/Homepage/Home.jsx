import React, { useState } from 'react'
import Navbar from '../Headers/Navbar'
import Herosection from '../Herosectionpage/Herosection'
import Internship from '../Internship/Internship'
import Sucess from '../Sucesspage/Sucess'
import Footer from '../Footerpage/Footer'
import Offer from '../Offerpage.jsx/Offer'
import Courses from '../Courses/Courses'
import BaseLayout from '../../Layout/BaseLayout'
import { Helmet } from "react-helmet";
function Home() {
    // const [isDarkMode, setIsDarkMode] = useState(false);


    // const toggleDarkMode = () => {
    //     setIsDarkMode(!isDarkMode);
    // };
    return (
        <>
            {/* <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div>
                    <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </div> */}
            <BaseLayout>
            <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | Home </title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
                <div className=''>
                    <Herosection />
                </div>
                <div>
                    <Internship />
                </div>
                <div>
                    <Sucess />
                </div>
                <div>
                    <Offer />
                </div>
                <div className=''>
                    <Courses />
                </div>

                {/* </div> */}
            </BaseLayout>
        </>
    )
}

export default Home
