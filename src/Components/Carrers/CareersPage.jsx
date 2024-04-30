import React from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../../Layout/BaseLayout';

function CareersPage() {
  const jobs = [
    {
      title: "EdLernity - Summer Internship Drive 2024",
      location: "Remote",
      type: "Internship",
      applyLink: "https://forms.gle/4JeqCsAveQRqWWq48"
    }
  ];
  return (
    <>
    <BaseLayout>
    <section class="w-full relative sm:h-[650px] h-[500px] py-28 overflow-hidden md:mt-28 mt-14">
   
      <div className="absolute right-16 top-56 h-96 p-2 w-96 border-dashed border-[#000000] border-[1px] rounded-full"></div>
      <div className="max-w-[1293px] mr-3 w-full sm:h-[578px] h-[500px] bg-[#ECF7FF] rounded-tr-[137px] sm:rounded-tr-[400px] absolute top-0 z-10"></div>
  <img class="absolute top-0 left-0 w-full" src="/Image/lines-horizontal-waves-bg.png" alt=""/>
  <div class="!z-30 container mx-auto px-4 relative">
   
    <div class="text-center mb-32">
      <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl tracking-sm mb-6">Join our team</h1>
      <p class="text-lg text-gray-700">EdLernity: Greening Careers, Expanding Horizons. Your pathway to sustainable success.</p>
    </div>
    
    <div class="max-w-4xl mx-auto">
      <div class="mb-16">
        <span class="block font-medium text-gray-600 mb-6">Internship</span>
        <div class="py-6 px-8 mb-4 bg-white rounded-2xl shadow-md">
          <div class="flex flex-col sm:flex-row md:justify-between items-start">
            <div class="mb-6 sm:mb-0">
              <h4 class="text-xl  font-bold mb-3">EdLernity - Summer Internship Drive 2024</h4>
              <div class="inline-flex mr-8 items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.75 8.5C16.75 13.75 10 18.25 10 18.25C10 18.25 3.25 13.75 3.25 8.5C3.25 6.70979 3.96116 4.9929 5.22703 3.72703C6.4929 2.46116 8.20979 1.75 10 1.75C11.7902 1.75 13.5071 2.46116 14.773 3.72703C16.0388 4.9929 16.75 6.70979 16.75 8.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 10.75C11.2426 10.75 12.25 9.74264 12.25 8.5C12.25 7.25736 11.2426 6.25 10 6.25C8.75736 6.25 7.75 7.25736 7.75 8.5C7.75 9.74264 8.75736 10.75 10 10.75Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">WFH</span>
              </div>
              <div class="inline-flex items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 5.5V10L13 11.5" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">Part-Time</span>
              </div>
            </div>
            <Link to="/internship" class="inline-flex ml-auto group items-center text-lg text-black hover:text-lime-600 transition duration-100">
              <span class="mr-1 font-medium">Apply</span>
              <span class="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-100">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.25 13.75L13.75 6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M6.25 6.25H13.75V13.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
       
      </div>
      {/* <div>
        <span class="block font-medium text-gray-600 mb-6">Engineering</span>
        <div class="py-6 px-8 mb-4 bg-white rounded-2xl shadow-md">
          <div class="flex flex-col sm:flex-row md:justify-between items-start">
            <div class="mb-6 sm:mb-0">
              <h4 class="text-xl font-medium mb-3">Renewable Energy Engineer</h4>
              <div class="inline-flex mr-8 items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.75 8.5C16.75 13.75 10 18.25 10 18.25C10 18.25 3.25 13.75 3.25 8.5C3.25 6.70979 3.96116 4.9929 5.22703 3.72703C6.4929 2.46116 8.20979 1.75 10 1.75C11.7902 1.75 13.5071 2.46116 14.773 3.72703C16.0388 4.9929 16.75 6.70979 16.75 8.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 10.75C11.2426 10.75 12.25 9.74264 12.25 8.5C12.25 7.25736 11.2426 6.25 10 6.25C8.75736 6.25 7.75 7.25736 7.75 8.5C7.75 9.74264 8.75736 10.75 10 10.75Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">San Francisco, US</span>
              </div>
              <div class="inline-flex items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 5.5V10L13 11.5" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">Full-Time</span>
              </div>
            </div>
            <a href="#" class="inline-flex ml-auto group items-center text-lg text-black hover:text-lime-600 transition duration-100">
              <span class="mr-1 font-medium">Apply</span>
              <span class="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-100">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.25 13.75L13.75 6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M6.25 6.25H13.75V13.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </a>
          </div>
        </div>
        <div class="py-6 px-8 mb-4 bg-white rounded-2xl shadow-md">
          <div class="flex flex-col sm:flex-row md:justify-between items-start">
            <div class="mb-6 sm:mb-0">
              <h4 class="text-xl font-medium mb-3">Solar Engineer</h4>
              <div class="inline-flex mr-8 items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.75 8.5C16.75 13.75 10 18.25 10 18.25C10 18.25 3.25 13.75 3.25 8.5C3.25 6.70979 3.96116 4.9929 5.22703 3.72703C6.4929 2.46116 8.20979 1.75 10 1.75C11.7902 1.75 13.5071 2.46116 14.773 3.72703C16.0388 4.9929 16.75 6.70979 16.75 8.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 10.75C11.2426 10.75 12.25 9.74264 12.25 8.5C12.25 7.25736 11.2426 6.25 10 6.25C8.75736 6.25 7.75 7.25736 7.75 8.5C7.75 9.74264 8.75736 10.75 10 10.75Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">San Francisco, US</span>
              </div>
              <div class="inline-flex items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 5.5V10L13 11.5" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">Full-Time</span>
              </div>
            </div>
            <a href="#" class="inline-flex ml-auto group items-center text-lg text-black hover:text-lime-600 transition duration-100">
              <span class="mr-1 font-medium">Apply</span>
              <span class="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-100">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.25 13.75L13.75 6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M6.25 6.25H13.75V13.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </a>
          </div>
        </div>
        <div class="py-6 px-8 bg-white rounded-2xl shadow-md">
          <div class="flex flex-col sm:flex-row md:justify-between items-start">
            <div class="mb-6 sm:mb-0">
              <h4 class="text-xl font-medium mb-3">Wind Energy Engineer</h4>
              <div class="inline-flex mr-8 items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.75 8.5C16.75 13.75 10 18.25 10 18.25C10 18.25 3.25 13.75 3.25 8.5C3.25 6.70979 3.96116 4.9929 5.22703 3.72703C6.4929 2.46116 8.20979 1.75 10 1.75C11.7902 1.75 13.5071 2.46116 14.773 3.72703C16.0388 4.9929 16.75 6.70979 16.75 8.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 10.75C11.2426 10.75 12.25 9.74264 12.25 8.5C12.25 7.25736 11.2426 6.25 10 6.25C8.75736 6.25 7.75 7.25736 7.75 8.5C7.75 9.74264 8.75736 10.75 10 10.75Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">San Francisco, US</span>
              </div>
              <div class="inline-flex items-center">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M10 5.5V10L13 11.5" stroke="#646A69" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 font-medium text-gray-900">Full-Time</span>
              </div>
            </div>
            <a href="#" class="inline-flex ml-auto group items-center text-lg text-black hover:text-lime-600 transition duration-100">
              <span class="mr-1 font-medium">Apply</span>
              <span class="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-100">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.25 13.75L13.75 6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M6.25 6.25H13.75V13.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div> */}
    </div>
  </div>
</section>
</BaseLayout>
    </>
  )
}

export default CareersPage