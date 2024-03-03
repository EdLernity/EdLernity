import React from "react";
import BaseLayout from "../../Layout/BaseLayout";
import { Helmet } from "react-helmet";
import InputButton from "../Input/InputButton";
import { IoLocationOutline } from "react-icons/io5";

function Contact() {
  const data = {
    0: {
      icon: "",
      title: "Our Website",
      text: "www.edlernity.com",
    },
    1: {
      icon: "",
      title: "Call Us On",
      text: "+91 8073306479",
    },
    2: {
      icon: "",
      title: "Email Us",
      text: "info@edlernity.com",
    },
    3: {
      icon: "",
      title: "Our Location",
      text: "20, Sai Archids, Chikkabettahalli Vidyaranyapura Bangalore,India, 560097.",
    },
  };

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

        <div className="flex flex-row flex-wrap justify-between items-center mt-6 px-52 mb-8">
          {/* Title */}
          <div className="w-full text-center mt-12 ">
            <h1 className="text-2xl font-bold text-[#1539cf] font-sans mb-4">
              NEED HELP?
            </h1>
            <h1 className="text-center font-bold text-xl -mb-12 text-[#231f40] ">
              Hi, What can we help you with?
            </h1>
          </div>
          {/* Contact Information */}
          <div className="w-1/2 flex flex-wrap justify-center gap-8 mt-20">
            {Object.keys(data).map((index) => (
              <div
                key={index}
                className="border-2 w-52 h-fit rounded-lg border-solid shadow-xl"
              >
                <div className="flex py-11 h-full items-center px-3 justify-between flex-col">
                  <div className="w-11 rounded-full bg-blue-400 h-11 border-2 border-red-500 relative">
                    <IoLocationOutline color="blue" className="absolute top-2 w-10 h-6"/>
                  </div>
                  <div className="text-center mt-2">
                    <h1 className="text-black text-xl font-bold mt-2">
                      {data[index].title}
                    </h1>
                    <div className="font-medium text-gray-700 mt-2">
                      {data[index].text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Contact Form */}
          <div className="w-1/2 px-12">
            <form>
              <div className="mb-5">
                <InputButton
                  fullWidth
                  type="text"
                  label="Name"
                  id="name"
                  className="w-full border rounded py-2 px-3"
                />
              </div>

              <div className="mb-5">
                <InputButton
                  fullWidth
                  type="text"
                  label="Email"
                  id="phone number"
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-5">
                <InputButton
                  fullWidth
                  type="text"
                  label="Subject"
                  id="Subject"
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-5">
                <InputButton
                  fullWidth
                  type="text"
                  label="Phone Number"
                  id="phone number"
                  className="w-full border rounded py-2 px-3"
                />
              </div>
              <div className="mb-5">
                <textarea
                  id="message"
                  placeholder="Message"
                  className="w-full border rounded py-2 px-3"
                  rows="4"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-purple-800 text-white w-full max-sm:w-1/2  px-4 py-2 rounded hover:bg-black hover:text-white"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        <div className="px-52 mb-32">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15544.484040192685!2d77.53183771738283!3d13.091516500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23759f6e8a79%3A0xbeb8ddec4f82f2f0!2sSai%20Orchard%20Layout!5e0!3m2!1sen!2sin!4v1707893715831!5m2!1sen!2sin"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </BaseLayout>
    </>
  );
}

export default Contact;
