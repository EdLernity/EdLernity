import axios from "axios";
import React, { useEffect, useState } from "react";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";
import { BsGlobe } from "react-icons/bs";
import { IoLocationOutline, IoMailOpenOutline } from "react-icons/io5";
import { RiHeadphoneLine } from "react-icons/ri";
import BaseLayout from "../../Layout/BaseLayout";
import { BACKEND_URL } from "../../URL_Config";
import InputButton from "../Input/InputButton";

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
        await axios.post(BACKEND_URL+"/api/contact", formData);
        setSubmitted(true);
      } catch (error) {
        console.error("Error submitting form:", error);
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
    } else if (!/^\d{10}$/.test(data.phone.trim())) {
      errors.phone = "Phone Number must be exactly 10 digits";
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
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const data = {
    0: {
      title: "Our Website",
      text: "www.edlernity.com",
      bgColor: "rgba(82, 95, 225, 0.08)",
      icon: <BsGlobe className="w-5 h-5 text-blue-500" />,
    },
    1: {
      title: "Call Us On",
      text: "+91 8073306479",
      bgColor: "rgba(251, 124, 86, 0.08)",
      icon: <RiHeadphoneLine className="w-5 h-5 text-orange-500" />,
    },
    2: {
      title: "Email Us",
      text: "info@edlernity.com",
      bgColor: "rgba(16, 185, 129, 0.08)",
      icon: <IoMailOpenOutline className="w-5 h-5 text-emerald-500" />,
    },
    3: {
      title: "Our Location",
      text: "20, Sai Archids, Chikkabettahalli Vidyaranyapura Bangalore,India, 560097.",
      bgColor: "rgba(139, 92, 246, 0.08)",
      icon: <IoLocationOutline className="w-5 h-5 text-violet-500" />,
    },
  };

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        path={PAGE_SEO.contact.path}
        keywords={PAGE_SEO.contact.keywords}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-6">
              Connect With Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
              Hi, What can we help you with?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Our team is ready to answer questions, resolve technical setup dependencies, or guide course selections.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column (Information Cards) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.keys(data).map((idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-center min-h-[220px]"
                >
                  <div
                    style={{ backgroundColor: data[idx].bgColor }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                  >
                    {data[idx].icon}
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                    {data[idx].title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-semibold break-all px-2">
                    {data[idx].text}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column (Form Panel) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#181FC5] to-[#4F46E5]"></div>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <InputButton
                        fullWidth
                        label="Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#181FC5]/20 focus:border-[#181FC5] transition-all text-slate-800 placeholder-slate-400"
                      />
                      {errors.name && (
                        <span className="text-xs font-bold text-red-500 mt-1 block">{errors.name}</span>
                      )}
                    </div>
                    <div>
                      <InputButton
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#181FC5]/20 focus:border-[#181FC5] transition-all text-slate-800 placeholder-slate-400"
                      />
                      {errors.email && (
                        <span className="text-xs font-bold text-red-500 mt-1 block">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <InputButton
                        fullWidth
                        label="Subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#181FC5]/20 focus:border-[#181FC5] transition-all text-slate-800 placeholder-slate-400"
                      />
                      {errors.subject && (
                        <span className="text-xs font-bold text-red-500 mt-1 block">{errors.subject}</span>
                      )}
                    </div>
                    <div>
                      <InputButton
                        fullWidth
                        label="Phone no."
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#181FC5]/20 focus:border-[#181FC5] transition-all text-slate-800 placeholder-slate-400"
                      />
                      {errors.phone && (
                        <span className="text-xs font-bold text-red-500 mt-1 block">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      placeholder="Enter your message details here..."
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#181FC5]/20 focus:border-[#181FC5] transition-all text-slate-800 placeholder-slate-400 text-sm"
                      rows="5"
                    ></textarea>
                    {errors.message && (
                      <span className="text-xs font-bold text-red-500 mt-1 block">{errors.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] transition-all text-base"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Submission Successful!</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-base">
                    Thank you for reaching out to us. Our query management team will review your message details and respond back soon. 😊
                  </p>
                  <button
                    className="px-8 py-3 bg-[#181FC5]/5 text-[#181FC5] hover:bg-[#181FC5]/10 font-bold rounded-full transition-all text-sm"
                    onClick={handleReset}
                  >
                    Submit Another Query
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default Contact;