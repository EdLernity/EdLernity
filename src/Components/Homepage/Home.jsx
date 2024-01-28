import React ,{useState} from 'react'
import Navbar from '../Headers/Navbar'
import Herosection from '../Herosectionpage/Herosection'
import Internship from '../Internship/Internship'
import Sucess from '../Sucesspage/Sucess'
import Footer from '../Footerpage/Footer'
import Offer from '../Offerpage.jsx/Offer'
import Courses from '../Courses/Courses'
function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
  

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    return (
        <>
            <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div>
                    <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </div>
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
                <div className=''>
                    <Footer />
                </div>
            </div>

        </>
    )
}

export default Home
