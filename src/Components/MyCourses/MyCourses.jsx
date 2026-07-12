import React, { useContext, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Shield, User, GraduationCap } from "lucide-react";
import { Store } from "../../Context.js";
import BaseLayout from "../../Layout/BaseLayout.jsx";
import SeoHead from "../SEO/SeoHead.jsx";
import { fetchMyInternshipsFromBackend } from "../InternshipPrograms/internshipCartUtils.js";
import UserAvatar from "../../assets/user.png";

function MyCourses() {
  const { myCourses, userProfile } = useContext(Store);
  const [myInternships, setMyInternships] = useState([]);
  const [activeTab, setActiveTab] = useState("internships");
  const navigate = useNavigate();

  const fullName = [userProfile?.firstName, userProfile?.lastName]
    .filter(Boolean)
    .join(" ");
  const displayName = userProfile?.firstName || "Learner";
  const initials = fullName
    ? fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "EL";
  const courseCount = myCourses?.length || 0;
  const internshipCount = myInternships.length;
  const userRole = userProfile?.effectiveRole || userProfile?.role || "student";
  const isAdmin = userRole === "admin";
  const isTrainer = userRole === "trainer" || isAdmin;

  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigate("/auth/login", { replace: true });
      return;
    }

    let active = true;
    fetchMyInternshipsFromBackend().then((list) => {
      if (active) setMyInternships(list);
    });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleClick = (course) => {
    navigate(`/mycourses/${course._id}`, {
      state: { course },
    });
  };

  const tabs = [
    {
      id: "internships",
      label: "Internships",
      count: myInternships.length,
    },
    {
      id: "courses",
      label: "Academics",
      count: myCourses?.length || 0,
    },
  ];

  return (
    <BaseLayout>
      <SeoHead
        title="My Learning - EdLernity"
        description="Access your enrolled courses and internship programs in one place."
        path="/mycourses"
      />
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto font-sans">
        <div className="mb-8 rounded-3xl border border-slate-100 bg-gradient-to-br from-[#ECEFFE] via-white to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
              {userProfile ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#181FC5] to-[#4F46E5] text-white flex items-center justify-center text-xl sm:text-2xl font-extrabold shrink-0 shadow-md">
                  {initials}
                </div>
              ) : (
                <img
                  src={UserAvatar}
                  alt="User profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                />
              )}

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5] mb-1">
                  My Learning
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  Hi {displayName}
                </h1>
                {fullName && (
                  <p className="text-base sm:text-lg font-semibold text-slate-700 mt-1">
                    {fullName}
                  </p>
                )}
                <p className="text-slate-600 font-medium mt-2 text-sm sm:text-base">
                  Your learning hub for internships and academics in one place.
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 mt-4 text-sm text-slate-600">
                  {userProfile?.email && (
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-[#181FC5] shrink-0" />
                      <span className="truncate">{userProfile.email}</span>
                    </span>
                  )}
                  {userProfile?.phone && (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#181FC5] shrink-0" />
                      <span>{userProfile.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#181FC5]/20 bg-white text-[#181FC5] text-sm font-bold hover:bg-[#181FC5] hover:text-white transition-colors shrink-0"
            >
              <User className="w-4 h-4" />
              View Profile
            </Link>
          </div>

          {(isAdmin || isTrainer) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {isAdmin && (
                <Link
                  to="/admin/internships"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
                >
                  <Shield className="w-4 h-4" />
                  Command Center
                </Link>
              )}
              {isTrainer && (
                <Link
                  to="/trainer/internships"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
                >
                  <GraduationCap className="w-4 h-4" />
                  Trainer Dashboard
                </Link>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 text-center sm:text-left">
              <p className="text-2xl font-extrabold text-[#181FC5]">{internshipCount}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Internships
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 text-center sm:text-left">
              <p className="text-2xl font-extrabold text-[#181FC5]">{courseCount}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Academics
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 text-center sm:text-left">
              <p className="text-2xl font-extrabold text-[#181FC5]">
                {internshipCount + courseCount}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Total Enrollments
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/80 border border-slate-300 rounded-2xl w-full sm:w-fit mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all border ${
                  isActive
                    ? "bg-white text-[#181FC5] border-[#181FC5]/30 shadow-md"
                    : "bg-transparent text-slate-700 border-transparent hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 inline-flex min-w-[1.25rem] justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-[#181FC5]/10 text-[#181FC5]"
                      : "bg-slate-300/80 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Internships tab */}
        {activeTab === "internships" && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800">
                My Internships
              </h2>
              <Link
                to="/internship-programs"
                className="text-sm font-bold text-[#181FC5] hover:underline"
              >
                Browse internship programs
              </Link>
            </div>

            {myInternships.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <p className="text-slate-600 font-medium mb-3">
                  No internship enrolled yet.
                </p>
                <Link
                  to="/internship-programs"
                  className="inline-flex px-5 py-2.5 rounded-full bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
                >
                  Explore Internships
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myInternships.map((item) => (
                  <div
                    key={item.slug}
                    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="w-full md:w-40 shrink-0">
                      <img
                        className="w-full h-24 object-cover rounded-xl"
                        src={item.coverImage}
                        alt={item.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#181FC5] mb-1">
                        Internship Program
                      </p>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Includes GenAI workshop + Reznio access
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/my-internships/${item.slug}`)}
                      className="cursor-pointer rounded-xl bg-[#181FC5] px-4 py-2.5 text-center inline-flex items-center justify-center text-sm font-semibold text-white shadow-sm hover:bg-[#1418a0]"
                    >
                      Open Program
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 ml-2"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Academics tab */}
        {activeTab === "courses" && (
          <section>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-5">
              {myCourses?.length === 0 ? "My Academics" : "Enrolled Academics"}
            </h2>

            {(!myCourses || myCourses.length === 0) && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                <p className="text-slate-600 font-medium mb-3">No academics enrolled yet.</p>
                <Link
                  to="/courses"
                  className="inline-flex px-5 py-2.5 rounded-full bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
                >
                  Browse Academics
                </Link>
              </div>
            )}

            {myCourses?.map((course, index) => (
              <div
                key={course._id || index}
                className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
              >
                <div className="pb-4 md:pb-8 w-full md:w-40">
                  <img
                    className="w-full hidden md:block rounded-xl"
                    src={course.courseBanner}
                    alt={course.courseTitle}
                  />
                  <img
                    className="w-full md:hidden rounded-xl"
                    src={course.courseBanner}
                    alt={course.courseTitle}
                  />
                </div>
                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                  <div className="w-full flex flex-col justify-start items-start space-y-8">
                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                      {course.courseTitle}
                    </h3>
                  </div>
                  <div className="flex justify-between space-x-8 items-start w-full">
                    <p
                      onClick={() => handleClick(course)}
                      className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-center inline-flex items-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Go to Course
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 ml-2"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </BaseLayout>
  );
}

export default MyCourses;
