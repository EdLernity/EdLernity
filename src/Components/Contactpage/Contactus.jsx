import React, { useState , useEffect} from "react";
import BaseLayout from "../../Layout/BaseLayout";
import { Helmet } from "react-helmet";
import InputButton from "../Input/InputButton";
import { IoLocationOutline } from "react-icons/io5";
import { IoMailOpenOutline } from "react-icons/io5";
import { BsGlobe } from "react-icons/bs";
import { RiHeadphoneLine } from "react-icons/ri";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

function Contact() {
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear the error message when user starts typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await axios.post("http://3.110.210.79:3001/api/contact", formData);
        console.log("Form submitted:", formData);
        setSubmitted(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error
      }
    }
  };

  const validateFormData = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Name is required";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (!/^\d{11}$/.test(data.phone.trim())) {
      errors.phone = "Phone Number must be less than  11 digits";
    }
    if (!data.message.trim()) {
      errors.message = "Message is required";
    }
    if (!data.subject.trim()) {
      errors.subject = "Subject is required";
    }
    return errors;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      phone: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after delay
    }, 3000);

    return () => clearTimeout(timer); // Clean up timer
  }, []);

  const data = {
    0: {
      title: "Our Website",
      text: "www.edlernity.com",
      bgColor: "rgba(82, 95, 225, 0.1)",
      icon: <BsGlobe color="blue" className="absolute top-2 w-10 h-6" />,
    },
    1: {
      title: "Call Us On",
      text: "+91 8073306479",
      bgColor: "rgba(251, 124, 86, 0.1)",
      icon: (
        <RiHeadphoneLine color="orange" className="absolute top-2 w-10 h-6" />
      ),
    },
    2: {
      title: "Email Us",
      text: "info@edlernity.com",
      bgColor: "rgba(255, 164, 27, 0.1)",
      icon: (
        <IoMailOpenOutline color="green" className="absolute top-2 w-10 h-6" />
      ),
    },
    3: {
      title: "Our Location",
      text: "20, Sai Archids, Chikkabettahalli Vidyaranyapura Bangalore,India, 560097.",
      bgColor: "rgba(82, 95, 225, 0.1)",
      icon: (
        <IoLocationOutline color="purple" className="absolute top-2 w-10 h-6" />
      ),
    },
  };

  return (
    <>
      <BaseLayout>
        <Helmet>
          <meta charSet="utf-8" />
          <title>EdLernity | Contact</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>

        <div className="xl:flex md:flex flex-row flex-wrap justify-between items-center mt-6 xl:mt-0 md:mt-0 px-0.5 sm:px-8 md:px-2 xl:px-16 mb-8">
          {/* Title */}
          <div className="w-full text-center mt-1 md:mt-12 xl:mt-12 animate__animated animate__fadeInDownBig">
            <h1 className="text-2xl font-bold text-[#1539cf] font-sans mb-4">
              NEED HELP?
            </h1>
            <h1 className="text-center font-bold text-xl -mb-12 text-[#231f40] ">
              Hi, What can we help you with?
            </h1>
          </div>
          {/* Contact Information */}
          <div className="md:mb-8 px-3 md:w-1/2 xl:w-1/2 flex flex-wrap justify-center gap-4 md:gap-8 xl:gap-12 sm:gap-8 mt-20 animate__animated animate__backInLeft">
            {Object.keys(data).map((index) => (
              <div
                key={index}
                className="border-2 w-52 my-4 h-fit rounded-lg shadow-xl transform hover:scale-105 hover:-translate-y-5 hover:bg-[#859BFF] duration-500 ease-in-out md:hover:scale-100 md:hover:-translate-y-5 xl:hover:-translate-y-5 md:hover:duration-1000 xl:hover:duration-1000 transition-all"
              >
                <div className="flex py-11 h-full items-center px-3 justify-between flex-col">
                  <div
                    style={{ backgroundColor: data[index].bgColor }}
                    className={`w-11 rounded-full h-11 border-2 relative`}
                  >
                    {data[index].icon}
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
          <div className="md:w-1/2 xl:w-1/2 md:px-4 px-6 xl:px-28 animate__animated animate__backInRight mt-12 md:mt-0 xl:mt-0">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <InputButton
                    fullWidth
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded py-2 px-3"
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="mb-5">
                  <InputButton
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded py-2 px-3"
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email}</span>
                  )}
                </div>
                <div className="mb-5">
                  <InputButton
                    fullWidth
                    label="Subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border rounded py-2 px-3"
                  />
                  {errors.subject && (
                    <span className="text-red-500">{errors.subject}</span>
                  )}
                </div>
                <div className="mb-5">
                  <InputButton
                    fullWidth
                    label="Phone no."
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded py-2 px-3"
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>
                <div className="mb-5">
                  <textarea
                    id="message"
                    placeholder="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border rounded py-2 px-3"
                    rows="4"
                  ></textarea>
                  {errors.message && (
                    <span className="text-red-500">{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#1539cf] text-white w-full max-sm:w-1/2  px-4 py-2 rounded hover:bg-[#1539cf] hover:text-white"
                >
                  SUBMIT
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p>
                  Thank you for your query, we will repspond you back soon. 😊
                </p>
                <button
                  className="bg-[#1539cf] text-white w-full max-sm:w-1/2  px-4 py-2 rounded hover:bg-[#1539cf] hover:text-white mt-4"
                  onClick={handleReset}
                >
                  Submit Another Response
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mx-8 md:mx-0 rounded-xl md:px-16 xl:px-64 mb-16 md:mb-32 xl:mb-32 animate__animated animate__backInRight">
          {isLoading ? (
            <Skeleton
              count={1}
              height={300}
              className="mx-8 md:mx-0 w-screen rounded-xl md:px-16 xl:px-64 mb-16 md:mb-32 h-full "
            />
          ) : (
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15544.484040192685!2d77.53183771738283!3d13.091516500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23759f6e8a79%3A0xbeb8ddec4f82f2f0!2sSai%20Orchard%20Layout!5e0!3m2!1sen!2sin!4v1707893715831!5m2!1sen!2sin"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          )}
        </div>
      </BaseLayout>
    </>
  );
}

export default Contact;
