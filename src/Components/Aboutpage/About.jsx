import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { BookOpen, GraduationCap, ShoppingCart, Star } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";

import "./About.css";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function About() {
  const reviewData = [
    {
      id: 1,
      image: "sejal-kesharwani.jpeg",
      comment:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      name: "Surabhi Kesarwani",
      role: "IT Aspirant",
      rating: 5,
    },
    {
      id: 2,
      image: "nikhil-reji.jpeg",
      comment:
        "I recently came across membership of EdLernity, and I must say, it was a great experience. The platform's intuitive interface and engaging content made learning not only easy but also enjoyable. The courses structure was well-organized, guiding me through each topic seamlessly. I would recommend to take up the membership and explore the courses.",
      name: "Nikhil Reji",
      role: "Lifetime Member",
      rating: 5,
    },
    {
      id: 3,
      image: "sraadha-gupta.jpeg",
      comment:
        "Great course, so many important topics covered in depth. There were many assessments which made us confident with our skills. I would like to enroll in more courses offered by EdLernity.",
      name: "Shraddha Gupta",
      role: "Course Learner",
      rating: 5,
    },
    {
      id: 4,
      image: "ali-akbar.jpeg",
      comment:
        "EdLernity offers different courses that's helpfull for People who are looking to improve their skills.They have Technical courses and many more.The courses are well structured with clear objectives and engaging contents.Making complex topics easier to understand.Edlernity provides a valuable resource for life long learners. The course has helped provide a starting point for understanding, which certainly will prove useful in my current work/projects.",
      name: "Ali Akbar P",
      role: "Professional Upskiller",
      rating: 5,
    },
    {
      id: 5,
      image: "manjari-rastogi.jpeg",
      comment:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      name: "Manjari Rastogi",
      role: "Programming Student",
      rating: 5,
    },
    {
      id: 6,
      image: "abdul-wahab.jpeg",
      comment:
        "Edlernity is one of the most amazing platform to get a chance for learning and improving all technical skills required for all IT students it's worthy to have an opportunity to learn and acquire skills of languages that provided by their inspired and professional teachers ..happy learning with EdLernity.",
      name: "Abdul Wahab",
      role: "Tech Student",
      rating: 5,
    },
    {
      id: 7,
      image: "r-muskan-zehra.jpeg",
      comment:
        "I highly recommend this course provided by EdLernity to anyone looking to take their Python skills to the next level. Whether you're a beginner or an experienced programmer, you'll find valuable insights and practical knowledge that will enhance your proficiency in Python programming. Best of luck on your learning journey.",
      name: "R Muskan Zehra",
      role: "Python Learner",
      rating: 5,
    },
    {
      id: 8,
      image: "md-burhanuddin.jpeg",
      comment:
        "Packed with valuable insights and applicable skills. Worth every penny! Impressed with EdLernity courses! Easy-to-follow format, great community support, and actionable takeaways.Courses are top-notch Comprehensive curriculum, interactive exercises, and expert guidance. A must-try!.",
      name: "Md Burhanuddin",
      role: "Certified Learner",
      rating: 5,
    },
  ];

  const [visibleCards, setVisibleCards] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % reviewData?.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + reviewData.length) % reviewData?.length
    );
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      setVisibleCards(3);
    } else {
      setVisibleCards(1);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        path={PAGE_SEO.about.path}
        keywords={PAGE_SEO.about.keywords}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-center lg:text-left text-slate-800">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-6">
                About EdLernity Tech
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#181FC5] to-[#4F46E5]">EdLernity Tech</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-650 leading-relaxed font-medium mb-6">
                Where innovation converges with purpose to redefine technological solutions.
              </p>
              <p className="text-base text-slate-500 leading-relaxed">
                Established with a vision to lead in the ever-evolving tech industry, EdLernity Tech (OPC) Private Limited is committed to delivering cutting-edge educational products and services that transcend conventional boundaries. We foster professional career capabilities using custom methodologies.
              </p>
            </div>

            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-[#181FC5]/5 rounded-3xl filter blur-2xl transform rotate-3 pointer-events-none"></div>
              <img
                src="/Image/IMG_8829.PNG"
                alt="Welcome to EdLernity Tech"
                className="relative w-full max-w-md lg:max-w-lg hover:scale-[1.01] transition-transform duration-300"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Special Offering */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-6 lg:order-2">
              <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3 py-1 rounded-full">SPECIAL OFFERING</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">
                Immersive Internships Bridging Theory & Practice
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Experience the future of education at EdLernity. Beyond traditional courses, we offer immersive Tech internships, bridging concepts with real-world applications.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Work alongside industry experts, gaining invaluable insights and hands-on experience. Whether aspiring to be a Web Developer or UI/UX Designer, unlock your potential with EdLernity today. Better skills develop nations. Join us and discover yours.
              </p>
              <a
                href="/careers"
                className="inline-flex px-8 py-3.5 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-base"
              >
                Apply for Internships
              </a>
            </div>

            <div className="lg:col-span-6 lg:order-1 flex justify-center relative">
              <div className="absolute inset-0 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
              <img
                src="/Image/IMG_8712.PNG"
                alt="Special Offering"
                className="w-full max-w-md lg:max-w-lg hover:scale-[1.01] transition-transform"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ISO Certified */}
      <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-650 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
              Quality Assurance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
              We Are ISO Certified
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
              EdLernity Tech (OPC) Private Limited is proud to be <strong>ISO 9001:2015 certified</strong>. This certification reaffirms our commitment to maintaining a high standard of quality in our educational services and certification programs related to vocational and technical development. Accredited by the Standards Council of Canada, our certification underscores our dedication to excellence.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/Image/Image_20240430_131514_0000.jpg"
              alt="ISO Certification"
              className="w-full max-w-2xl object-contain hover:scale-[1.01] transition-transform duration-300"
            />
          </div>

        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <img
                src="/Image/IMG_8711.PNG"
                alt="Who We Are"
                className="w-full max-w-md lg:max-w-lg"
              />
            </div>

            <div className="lg:col-span-7">
              <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3 py-1 rounded-full">WHO WE ARE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-10 leading-tight">
                Offering The Best Tech Career Paths
              </h2>

              <div className="space-y-8">
                
                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-[#181FC5] rounded-2xl flex items-center justify-center shadow-sm">
                    <img
                      src="/Image/Industry.png"
                      className="w-6 h-6 object-contain"
                      alt="Industry Icon"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">
                      Industry Expert Instructors
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                      Unlock the wisdom of active specialists. Our instructors are the guiding stars of your educational journey, translating core corporate problems into structured lessons.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <img
                      src="/Image/Industry.png"
                      className="w-6 h-6 object-contain"
                      alt="Industry Icon"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">
                      Up-to-Date Course Content
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                      Stay ahead with a curriculum that evolves with global industry standards. Our courses are continuously updated to reflect the latest packages and best practices.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <img
                      src="/Image/Industry.png"
                      className="w-6 h-6 object-contain"
                      alt="Industry Icon"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">
                      Expanding Student Community
                    </h4>
                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                      Join a thriving community of peers. Collaborate, share code fragments, and grow together alongside students from diverse technical backgrounds.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How Does EdLernity Work? */}
      <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5]">HOW IT WORKS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              How Does EdLernity Work?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <BookOpen className="w-7 h-7 text-[#181FC5]" strokeWidth={2} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                Choose Any Course
              </h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Education is the passport to the future, for tomorrow belongs to those who prepare for it today.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShoppingCart className="w-7 h-7 text-pink-600" strokeWidth={2} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                Purchase Your Course
              </h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Invest in your mind. Purchase knowledge and watch your career potential grow exponentially.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <GraduationCap className="w-7 h-7 text-violet-600" strokeWidth={2} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                Great! Start Learning
              </h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                Embark on your learning journey with enthusiasm, for every lesson is a step toward greatness.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why Choose EdLernity?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-[#181FC5]/5 rounded-3xl filter blur-2xl transform rotate-3 pointer-events-none"></div>
              <img
                src="/Image/IMG_8706.PNG"
                alt="Our Mission"
                className="w-full max-w-sm rounded-3xl relative"
              />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3 py-1 rounded-full">CORE PURPOSE</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 mb-5">
                OUR MISSION
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We are on a mission to pioneer advancements in tech training, creating values for our candidates and contributing to the broader educational infrastructure. Through ethical standards, industry alignment, and a commitment to accessibility, we strive to build future tech leaders.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2 flex justify-center relative">
              <div className="absolute inset-0 bg-pink-500/5 rounded-3xl filter blur-2xl transform -rotate-3 pointer-events-none"></div>
              <img
                src="/Image/IMG_8829.PNG"
                alt="Our Vision"
                className="w-full max-w-sm rounded-3xl relative"
              />
            </div>
            <div className="lg:order-1">
              <span className="text-sm font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">FUTURE OUTLOOK</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 mb-5">
                OUR VISION
              </h3>
              <p className="text-lg text-slate-655 leading-relaxed">
                At EdLernity, we envision a future where technology seamlessly integrates with learning, fostering progress and enhancing career trajectories. Our vision is to be a beacon of innovation, driving positive educational shifts through practical methodologies.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-[#181FC5] to-[#4F46E5] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-center">
            <div>
              <p className="text-5xl sm:text-6xl font-extrabold mb-2">
                <CountUp end={10000} duration={3} />+
              </p>
              <p className="text-blue-100 text-lg font-semibold uppercase tracking-wider">Active Users</p>
            </div>
            <div>
              <p className="text-5xl sm:text-6xl font-extrabold mb-2">
                <CountUp end={12} duration={3} />+
              </p>
              <p className="text-blue-100 text-lg font-semibold uppercase tracking-wider">Expert Courses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-[#ECF7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] mb-3">
              What Our Students Say
            </h2>
            <p className="text-slate-600 text-lg">
              Hear from our global community of learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewData.map((testimonial) => (
              <article
                key={testimonial.id}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#181FC5]/10 border border-slate-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <StarRating rating={testimonial.rating} />
                  <p className="text-slate-600 mt-6 mb-8 leading-relaxed text-sm sm:text-base italic">
                    "{testimonial.comment}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <img
                    src={`/Image/user-review-img/${testimonial.image}`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
                    onError={(e) => {
                      e.target.src = "/Image/Logo1.svg";
                    }}
                  />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs text-slate-400 font-semibold">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-slate-300 opacity-90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of active learners who are building real tech skills and advancing their careers with EdLernity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/courses/overview"
              className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Explore Courses
            </a>
            <a
              href="/careers"
              className="px-8 py-3.5 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all"
            >
              View Careers
            </a>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default About;