import React, { useState, useEffect } from 'react';
import { BsArrowUpCircleFill } from 'react-icons/bs';
function ScrollToBottomTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={`${isVisible ? 'block' : 'hidden'
        } fixed bottom-20 right-8  cursor-pointer`}
      onClick={scrollToTop}
    >
      <BsArrowUpCircleFill size={35} style={{ color: 'rgb(21, 57, 207)' }} />
    </button>
  );
}

export default ScrollToBottomTop;
