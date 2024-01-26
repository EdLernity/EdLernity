import React from 'react'
import Navbar from '../Headers/Navbar'
import Herosection from '../Herosectionpage/Herosection'
import Internship from '../Internship/Internship'
import Sucess from '../Sucesspage/Sucess'
import Footer from '../Footerpage/Footer'
import Offer from '../Offerpage.jsx/Offer'
function Home() {
    return (
        <>
            <div>
                <Navbar />
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
                <Footer />
            </div>
        </>
    )
}

export default Home
