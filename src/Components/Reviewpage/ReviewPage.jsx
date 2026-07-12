import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Linkedin, Star, Youtube } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import {
  LINKEDIN_COMPANY_URL,
  LINKEDIN_POSTS_FEED,
  linkedInPosts,
  learnerReviews,
  platformPillars,
  platformStats,
  reviewFaqs,
} from "../../StaticObj/reviewsData";
import { PAGE_SEO } from "../../Utils/seoConfig";

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

function ReviewPage() {
  const [activePillar, setActivePillar] = useState(platformPillars[0].id);
  const currentPillar =
    platformPillars.find((p) => p.id === activePillar) || platformPillars[0];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: reviewFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(faq.answer) ? faq.answer.join(" ") : faq.answer,
      },
    })),
  };

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.reviews.title}
        description={PAGE_SEO.reviews.description}
        path={PAGE_SEO.reviews.path}
        keywords={PAGE_SEO.reviews.keywords}
        jsonLd={faqSchema}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-7 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-6">
                Internship Validation
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#181FC5] tracking-tight leading-none mb-6">
                Real Experiences. <span className="text-[#4F46E5]">Real Skills.</span> Real Careers.
              </h1>
              
              <div className="space-y-4 text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
                <p>
                  <em>EdLernity</em> offers more than just online courses, mentorships, and one-on-one training. The organization also provides internship opportunities for candidates seeking practical experience in <strong>HR, Marketing, and Technical domains</strong>.
                </p>
                <p>
                  Through hands-on projects, industry-relevant tasks, and professional guidance, interns develop essential skills, enhance their practical knowledge, and gain valuable experience that prepares them for future career opportunities.
                </p>
              </div>

              <Link
                to="/careers"
                className="inline-flex px-8 py-3.5 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#181FC5]/20 hover:scale-[1.02] transition-all text-base"
              >
                Apply for Internship
              </Link>
            </div>

            <div className="lg:col-span-5 flex justify-center relative">
              <div className="absolute inset-0 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
              <div className="relative bg-white/50 backdrop-blur border border-white/60 p-4 rounded-3xl shadow-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                <img
                  src="/Image/online-learning-concept.svg"
                  alt="EdLernity internship and learning"
                  className="w-full max-w-md lg:max-w-lg rounded-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-[#181FC5] to-[#4F46E5] py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            {platformStats.map((stat) => (
              <div key={stat.label} className="border-r border-white/10 last:border-0">
                <p className="text-3xl sm:text-4xl font-extrabold">
                  {stat.value}
                </p>
                <p className="text-blue-100 mt-2 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform pillars */}
      <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-black">
              <iframe
                src="https://www.youtube.com/embed/pvPdU3zi1Is"
                title="EdLernity - Education through Technology and Innovation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5]">CORE FRAMEWORK</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
              Education Through Technology & Innovation
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              A global digital platform committed to making learning effective, accessible, and career-focused for learners worldwide.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {platformPillars.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold shadow-sm transition-all ${
                  activePillar === pillar.id
                    ? "bg-[#181FC5] text-white shadow-md hover:bg-[#1418a0]"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#181FC5]"
                }`}
              >
                {pillar.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#181FC5] to-[#4F46E5]"></div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-4 pl-2">
              {currentPillar.title}
            </h3>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              {currentPillar.content}
            </p>
          </div>

        </div>
      </section>

      {/* Editorial Content */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="border-l-4 border-indigo-500 pl-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              Real Experiences: An EdLernity Internship Review
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
              One of the most frequently asked questions we encounter is: <em>"What's it really like to intern at EdLernity?"</em> The simple answer is: it's a dynamic, hands-on experience that goes beyond textbooks and lectures. Interns get the opportunity to collaborate on real-world projects, interact with professionals across various domains, and directly apply their newly acquired knowledge.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Our interns often highlight the supportive environment we foster. They receive mentorship from experienced industry professionals, helping them navigate complex tasks, enhance their skills, and build confidence. Many of our interns have used their <em>EdLernity internship journey</em> as a stepping stone toward securing full-time roles.
            </p>
          </div>

          <div className="rounded-3xl border border-[#181FC5]/10 bg-gradient-to-br from-[#ECEFFE] to-white p-6 sm:p-10 shadow-lg">
            <span className="inline-flex px-3 py-1 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase mb-4">Transparency</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181FC5] mb-4">
              Are EdLernity Internships Fake or Real?
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
              We understand there can be skepticism when exploring online internships. However, <span className="font-bold text-[#181FC5] bg-[#181FC5]/10 px-1.5 py-0.5 rounded">EdLernity internship fake or real</span> is a concern we address openly. Our platform has partnered with reputable organizations, industry experts, and educational leaders to ensure the authenticity and quality of every program we offer.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              At <strong className="text-[#181FC5]">EdLernity</strong>, the overarching goal of our programs is to help individuals develop and refine their <strong>core competencies</strong>. By utilizing cutting-edge technology and innovative teaching methods, EdLernity aims to make learning a more effective and enjoyable experience. The positive testimonials from past interns serve as strong evidence of our commitment.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
              What to Expect as an Intern
            </h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                We're glad that you're considering joining our team as an intern. At <strong>EdLernity</strong>, we value our interns and recognize that they are an integral part of our organization. Our internship program is designed to provide you with hands-on experience in your chosen field and help you develop the skills and knowledge necessary for a successful career.
              </p>
              <p>
                As an intern at <strong>EdLernity</strong>, you'll have the opportunity to work alongside experienced professionals and contribute to real-world projects. You'll receive mentorship and guidance from industry experts and be encouraged to take ownership of your work, enabling you to make a meaningful impact while gaining valuable industry exposure.
              </p>
              <p>
                We offer internships across a variety of domains, including Marketing, Human Resources, Technology, Business Development, Content Creation, and more. Our internships are flexible and can be tailored to align with your individual interests, goals, and learning objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn posts from company feed */}
      <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5]">Social Proof</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-3">
                More About EdLernity on LinkedIn
              </h2>
              <p className="text-slate-550">
                Real posts from our official{" "}
                <a
                  href={LINKEDIN_POSTS_FEED}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#181FC5] font-semibold hover:underline"
                >
                  LinkedIn company feed
                </a>
              </p>
            </div>
            <a
              href={LINKEDIN_POSTS_FEED}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0A66C2] text-white font-bold rounded-full hover:bg-[#004182] hover:scale-105 transition-all shadow-sm"
            >
              <Linkedin className="w-5 h-5" />
              View LinkedIn Feed
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {linkedInPosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-[#0A66C2]/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-1.5 bg-gradient-to-r from-[#0A66C2] to-[#181FC5]" />
                  <div className="p-8">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#181FC5]">
                        {post.tag}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{post.date}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg mb-3 group-hover:text-[#181FC5] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {post.name}
                      </p>
                      {(post.reactions || post.comments) && (
                        <p className="text-[11px] text-slate-400 font-semibold mt-1">
                          {post.reactions ? `${post.reactions} reactions` : ""}
                          {post.reactions && post.comments ? " · " : ""}
                          {post.comments ? `${post.comments} comments` : ""}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0A66C2] group-hover:gap-2 transition-all">
                      Read
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={LINKEDIN_POSTS_FEED}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#181FC5] font-bold hover:underline"
            >
              See more posts on LinkedIn
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-[#ECF7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] mb-3">
              EdLernity Reviews
            </h2>
            <p className="text-slate-600 text-lg">
              What people say about EdLernity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learnerReviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#181FC5]/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <StarRating rating={review.rating} />
                  <p className="text-slate-600 mt-6 mb-8 leading-relaxed text-sm sm:text-base italic">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <img
                    src={`/Image/user-review-img/${review.image}`}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
                    onError={(e) => {
                      e.target.src = "/Image/Logo1.svg";
                    }}
                  />
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm sm:text-base">{review.name}</p>
                    <p className="text-xs text-slate-400 font-semibold">{review.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {reviewFaqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 hover:border-indigo-100 transition-colors"
              >
                <h3 className="font-extrabold text-slate-800 text-lg mb-3">
                  {faq.question}
                </h3>
                {Array.isArray(faq.answer) ? (
                  faq.answer.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube / Social CTA */}
      <section className="py-20 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Youtube className="w-12 h-12 mx-auto mb-6 text-white/95" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            See EdLernity in Action
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto leading-relaxed text-base sm:text-lg">
            Follow EdLernity on LinkedIn and social media for learner stories, internship updates, course launches, and career tips from our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={LINKEDIN_POSTS_FEED}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#181FC5] font-bold rounded-full hover:bg-slate-50 hover:scale-105 transition-all text-base shadow-lg"
            >
              <Linkedin className="w-5 h-5" />
              View LinkedIn Posts
            </a>
            <a
              href={LINKEDIN_COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/60 text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all text-base"
            >
              Company Page
            </a>
            <Link
              to="/courses/overview"
              className="inline-flex items-center px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all text-base"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_1px]"></div>
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Take Charge of Your Future
          </h2>
          <p className="text-slate-300 opacity-90 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Step into a world where innovation, technology, and hands-on experience converge to shape the leaders of tomorrow.
          </p>
          <Link
            to="/careers"
            className="inline-flex px-8 py-3.5 bg-gradient-to-r from-blue-500 to-pink-600 text-white font-bold rounded-full hover:opacity-95 hover:scale-105 transition-all shadow-xl"
          >
            Apply for Internship
          </Link>
        </div>
      </section>
    </BaseLayout>
  );
}

export default ReviewPage;