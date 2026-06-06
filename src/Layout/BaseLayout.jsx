import React, { useState } from "react";
import Navbar from "../Components/Headers/Navbar";
import Footer from "../Components/Footerpage/Footer";

export default function BaseLayout({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                {children}
                <Footer />
            </div>

        </>
    );
}
