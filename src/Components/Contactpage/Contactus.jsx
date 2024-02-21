import React from 'react';
import BaseLayout from '../../Layout/BaseLayout';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from "react-helmet";
import { NavLink } from 'react-router-dom';
function Contact() {
  function onChange(value) {
    console.log("Captcha value:", value);
  }
  return (
    <>
      <BaseLayout>
        <Helmet>
          <meta charSet="utf-8" />
          <title>EdLernity | Contact Us</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <div className=' mt-24 max-w-7xl mx-auto  px-4 md:px-8 text-center'>
          <h5 className='text-center  text-3xl underline ' style={{color:"rgba(21,57,207,1)" }}>Contact US</h5>
          <p className='mt-5'>We are happy to hear from you! For any query, please write to us, and we will get back to you at the earliest.</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-10  mt-6">
          {/* Contact Form */}
          <div className="w-full md:w-1/3 p-6">
            <form>
              {/* ... (Your form fields) ... */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  Name:
                </label>
                <input type="text" placeholder='Enter Your Name' id="name" className="w-full border rounded py-2 px-3" />
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  Email:
                </label>
                <input type="text" id="phone number" placeholder='Enter Your Email' className="w-full border rounded py-2 px-3" />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                  Phone Number:
                </label>
                <input type="text" id="phone number" placeholder='Enter Your Phone Number' className="w-full border rounded py-2 px-3" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
                  Message:
                </label>
                <textarea id="message" placeholder='Write Your Message' className="w-full border rounded py-2 px-3" rows="4"></textarea>
              </div>



              {/* Add your reCAPTCHA component here */}
              <div className="mb-4">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={onChange}
                />
              </div>
              <button type="submit" className="bg-purple-800 text-white w-1/2 max-sm:w-1/2  px-4 py-2 rounded hover:bg-black hover:text-white">
                SUBMIT
              </button>
            </form>
          </div>
          {/* Contact Information */}
          <div className="w-full md:w-1/3 p-6">

            <div className="">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15544.484040192685!2d77.53183771738283!3d13.091516500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23759f6e8a79%3A0xbeb8ddec4f82f2f0!2sSai%20Orchard%20Layout!5e0!3m2!1sen!2sin!4v1707893715831!5m2!1sen!2sin"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">

              </iframe>
            </div>
            <div className="">
              <h2 className="text-2xl font-semibold">Address</h2>
              <p>20, Sai Archids, Chikkabettahalli Vidyaranyapura Bangalore, Bangalore North, Karnataka, India, 560097.</p>
            </div>
            <div className="flex space-x-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email ID:
              </label>
              <NavLink to="mailto:support@kukunamkeen.com" className="text-blue-500 hover:underline"> info@edlernity.com</NavLink>
            </div>
            <div className="flex space-x-4">
              <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                Phone Number:
              </label>
              <NavLink to="tel:9709866551" className="text-blue-500 hover:underline">+91 8073306479</NavLink>
            </div>
            <div className='mb-4 space-x-4'>
              <p className='block text-gray-700 font-bold mb-2'>Customer Care Timings: <span className='text-blue-500 hover:underline'>10:00 AM To 6:00 PM</span></p>
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

export default Contact;
