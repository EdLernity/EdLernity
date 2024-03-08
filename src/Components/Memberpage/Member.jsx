// import React from "react";
// import BaseLayout from "../../Layout/BaseLayout";
// import { Button } from "@material-tailwind/react";
// function Member() {
//   return (
//     <BaseLayout>
//       <div className="bg-[#3d71f5] min-h-screen p-8 text-white">
//         <main>
//         <section className="flex flex-col items-center justify-center mb-12">
//   <div className="flex items-center space-x-3">
//     <div className="bg-white rounded-full p-2">
//       <img src="/Image/Logo1.svg" className="w-10 text-[#3d71f5]" alt="Logo" />
//     </div>
//     <h1 className="text-3xl font-bold">EdLernity</h1>
//   </div>
//   <h2 className="text-5xl font-extrabold mb-6">
//     Lifetime Learning Pass
//   </h2>
//   <div className="bg-[#5c59a7] p-6 rounded-lg max-w-md">
//     <p className="text-lg">
//       Team EdLernity is exhilarated to announce that, due to our remarkable growth over the last few months, we are initiating a new pass that will be a turning point for you and your career development.
//     </p>
//   </div>
//   <Button className="mt-6 bg-[#5c59a7] hover:bg-[#4b489d]">
//     Get Access
//   </Button>
// </section>

//           <section className="grid grid-cols-3 gap-8">
//             <div className="bg-[#5c59a7] p-6 rounded-lg text-center">
//               <h3 className="text-6xl font-bold">974+</h3>
//               <p className="text-xl font-semibold mt-2">Members</p>
//               <p className="text-sm mt-2">
//                 Join the community with over 21000+ Students all over the globe.
//               </p>
//             </div>
//             <div className="bg-[#5c59a7] p-6 rounded-lg text-center">
//               <h3 className="text-6xl font-bold">73+</h3>
//               <p className="text-xl font-semibold mt-2">Hours</p>
//               <p className="text-sm mt-2">
//                 Get access to the library of 150+ hours of content.
//               </p>
//             </div>
//             <div className="bg-[#5c59a7] p-6 rounded-lg text-center">
//               <h3 className="text-6xl font-bold">325+</h3>
//               <p className="text-xl font-semibold mt-2">Lectures</p>
//               <p className="text-sm mt-2">
//                 Watch 500+ self paced lectures anytime anywhere.
//               </p>
//             </div>
//           </section>
//         </main>
//         <div className="absolute top-0 left-0 w-32 h-32 bg-[#5c59a7] rounded-full -translate-x-16 translate-y-16" />
//         <div className="absolute top-0 right-0 w-24 h-24 bg-[#5c59a7] rounded-full translate-x-16 -translate-y-12" />
//         <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5c59a7] rounded-full -translate-x-16 -translate-y-16" />
//       </div>
//     </BaseLayout>
//   );
// }

// export default Member;

import React from "react";
import BaseLayout from "../../Layout/BaseLayout";
import { Button } from "@material-tailwind/react";

function Member() {
  function BadgeIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      </svg>
    );
  }

  function GraduationCapIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  }

  function InfinityIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
      </svg>
    );
  }

  function LightbulbIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    );
  }

  return (
    <BaseLayout>
      <div className="bg-[#3d71f5]  p-8 text-white">
        <main>
          <section className="flex flex-col items-center justify-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <img
                  src="/Image/Logo1.svg"
                  className="w-10 text-[#3d71f5]"
                  alt="Logo"
                />
              </div>
              <h1 className="text-3xl font-bold">EdLernity</h1>
            </div>
            <h2 className="text-5xl text-center mt-5 font-extrabold mb-6">
              EdLernity's Lifetime subscription"
            </h2>
            <div className="bg-[#131313] p-6 rounded-xl max-w-md">
              <p className="text-lg">
              We're thrilled to announce our latest course package offer designed to supercharge your learning journey! Dive into a world of knowledge with our comprehensive package, crafted to empower you with the skills and insights you need to succeed. Stay tuned for more details on how you can seize this incredible opportunity!
              </p>
            </div>
            <Button className="mt-6 bg-[#181FC5] hover:bg-[#181FC5]">
              Get Access
            </Button>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#181FC5] p-6 rounded-lg text-center">
              <h3 className="text-6xl font-bold">974+</h3>
              <p className="text-xl font-semibold mt-2">Members</p>
              <p className="text-sm mt-2">
                Join the community with over 21000+ Students all over the globe.
              </p>
            </div>
            <div className="bg-[#181FC5] p-6 rounded-lg text-center">
              <h3 className="text-6xl font-bold">73+</h3>
              <p className="text-xl font-semibold mt-2">Hours</p>
              <p className="text-sm mt-2">
                Get access to the library of 150+ hours of content.
              </p>
            </div>
            <div className="bg-[#181FC5] p-6 rounded-lg text-center">
              <h3 className="text-6xl font-bold">325+</h3>
              <p className="text-xl font-semibold mt-2">Lectures</p>
              <p className="text-sm mt-2">
                Watch 500+ self-paced lectures anytime anywhere.
              </p>
            </div>
          </section>
        </main>
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#181FC5] rounded-full -translate-x-16 translate-y-16" />
        {/* <div className="absolute top-32 right-20 w-24 h-24 bg-[#181FC5] rounded-full translate-x-16 -translate-y-16" /> */}
        <div className="absolute bottom-28 left-0 w-32 h-32 bg-[#181FC5] rounded-full -translate-x-16 -translate-y-16" />
        <div className=" min-h-screen flex items-center justify-center p-4">
          <div className="flex flex-col md:flex-row  text-white rounded-lg  lg:space-x-24 justify-center overflow-hidden  w-full">
            <div className="bg-[#181FC5] p-8 rounded-2xl flex flex-col items-center justify-between">
              <h2 className="text-4xl font-bold mb-4">Join</h2>
              <p className="text-6xl font-bold mb-4">₹ 989</p>
              <div className="border-t border-white w-full py-4">
                <ul className="text-center space-y-4">
                  <li>Verified Certificates for lifetime</li>
                  <li>100+ Upcoming Courses In 2024</li>
                  <li>Unlimited Access To All Courses</li>
                  <li>Get Free Access To EdLernity Academics</li>
                </ul>
              </div>
              <Button className="bg-[#3b49df] text-white rounded-3xl mt-4">
                Save 90%
              </Button>
              <Button className="bg-[#3b49df] text-white mt-4">
                Get Access
              </Button>
            </div>
            <div className=" mt-8 space-y-10">
              <div className="flex items-center space-x-4">
                <img  src="/Image/Line.png" className="text-[#3b49df] h-12 bg-black w-12 rounded-full p-2"
                alt="line.png"
                 />
                <div>
                  <h3 className="text-xl font-semibold">20+ Courses</h3>
                  <p className="text-lg">
                    Access prerecorded online courses by professionals. Build
                    skills that worth for you.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <img  src="/Image/User1.png" className="text-[#3b49df] h-12 bg-black w-12 rounded-full p-2"
              alt="user1"
              />
                <div>
                  <h3 className="text-xl font-semibold">Lifetime Access</h3>
                  <p className="text-lg">
                    You'll have unlimited lifetime access to over 20 courses
                    covering practical skills.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <img  src="/Image/User2.png" className="text-[#3b49df] h-12 bg-black w-12 rounded-full p-2" 
              alt="user2"
              />
                <div>
                  <h3 className="text-xl font-semibold">Certified</h3>
                  <p className="text-lg">
                    Each EdLernity course is with certification to boost your
                    CV.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <img  src="/Image/User3.png" className="text-[#3b49df] h-12 bg-black w-12 rounded-full p-2" 
               alt="user3"
              />
                <div>
                  <h3 className="text-xl font-semibold">EdLernity Academics</h3>
                  <p>
                    A especially curated platform for students, help them to
                    find jobs and prepratory material.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col space-y-4">
              <div className="">
                <img
                  src="/Image/Setting.png"
                  className="text-[#6fd6ff] h-12 w-12 p-2 rounded-full bg-[#214531]"
                  alt="Settings Icon"
                />
                <div className=" space-y-1 items-center ">
                  <h2 className="text-2xl font-bold mt-2">Hike</h2>
                  <p className="text-lg">
                    The time and effort invested in professional certifications
                    often results in increased income.
                  </p>
                </div>
              </div>
              <div className="">
                <img
                  src="/Image/Star.png"
                  className="text-[#6fd6ff] p-2 h-12 w-12 rounded-full bg-[#214531]"
                  alt="Star Icon"
                />
                <div className="space-y-1 items-center">
                  <h2 className="text-2xl mt-2 font-bold">Advantage</h2>
                  <p className="text-lg">
                    When you have training that your competitors don’t, it sets
                    you.
                  </p>
                </div>
              </div>
              <div className="">
                <img
                  src="/Image/Star.png"
                  className="text-[#6fd6ff] p-2 h-12 w-12 rounded-full bg-[#214531]"
                  alt="Star Icon"
                />
                <div className="space-y-1 items-center">
                  <h2 className="text-2xl mt-2 font-bold">Efficiency</h2>
                  <p className="text-lg">
                    Beginning your career with the foundation that professional
                    certifications provide means that you're already ahead.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-8">
              <img
                alt="Sample Certificate"
                className="max-w-full h-auto shadow-lg mb-4"
                src="/Image/Certificate.png"
                style={{
                  aspectRatio: "700/500",
                  objectFit: "cover",
                }}
              />
              <p className="text-3xl text-center  lg:ml-32 lg:text-left ">
                Sample Certificate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#181FC5] mt-8  py-4 ">
          <div className="text-center">
            <h2 className="text-3xl text-white  font-bold">Got a question?</h2>
            <p className="text-white text-2xl">
              We'd like to talk more about what you need
            </p>
          </div>
        </div>

        <div className=" mt-6 space-y-2 items-center justify-center">
          <h4 className="text-center text-white text-2xl ">Email</h4>
          <p className="text-lg text-center underline" href="#">
            info@edlernity.com
          </p>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Member;
