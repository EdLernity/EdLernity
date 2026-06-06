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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f1ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#181FC5] mb-4">
                EdLernity Internship Program
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#181FC5] leading-tight mb-6">
                Real Experiences. Real Skills. Real Careers.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                <em>EdLernity</em> offers more than just online courses,
                mentorships, and one-on-one training. The organization also
                provides internship opportunities for candidates seeking
                practical experience in{" "}
                <em>HR, Marketing, and Technical domains</em>. Upon accepting
                the offer letter, interns are exposed to real-world scenarios
                and gain practical knowledge beyond theoretical concepts.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Through hands-on projects, industry-relevant tasks, and
                professional guidance, interns develop essential skills, enhance
                their practical knowledge, and gain valuable experience that
                prepares them for future career opportunities.
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center px-8 py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
              >
                Apply for Internship
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="/Image/online-learning-concept.svg"
                alt="EdLernity internship and learning"
                className="w-full max-w-md lg:max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#181FC5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            {platformStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold">
                  {stat.value}
                </p>
                <p className="text-blue-100 mt-2 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform pillars */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-[#181FC5] mb-4">
              EdLernity: Education through Technology & Innovation
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              A global digital platform committed to making learning effective,
              accessible, and career-focused for learners worldwide.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {platformPillars.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activePillar === pillar.id
                    ? "bg-[#181FC5] text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#181FC5]"
                }`}
              >
                {pillar.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#181FC5] mb-4">
              {currentPillar.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {currentPillar.content}
            </p>
          </div>
        </div>
      </section>

      {/* Internship review content */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#181FC5] mb-4">
              Real Experiences: An EdLernity Internship Review
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              One of the most frequently asked questions we encounter is:{" "}
              <em>"What's it really like to intern at EdLernity?"</em> The simple
              answer is: it's a dynamic, hands-on experience that goes beyond
              textbooks and lectures. Interns get the opportunity to collaborate
              on real-world projects, interact with professionals across various
              domains, and directly apply their newly acquired knowledge.
              Through this <em>EdLernity internship review</em>, we aim to
              showcase how our program stands out as a practical and
              career-oriented learning experience.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our interns often highlight the supportive environment we foster.
              They receive mentorship from experienced industry professionals,
              helping them navigate complex tasks, enhance their skills, and
              build confidence. Many of our interns have used their{" "}
              <em>EdLernity internship journey</em> as a stepping stone toward
              securing full-time roles, expanding their professional networks,
              and advancing their careers.
            </p>
          </div>

          <div className="rounded-2xl border border-[#181FC5]/15 bg-gradient-to-br from-[#f0f1ff] to-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#181FC5] mb-4">
              Are EdLernity Internships Fake or Real?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We understand there can be skepticism when exploring online
              internships. However,{" "}
              <span className="font-semibold text-[#181FC5] bg-[#181FC5]/10 px-1.5 py-0.5 rounded">
                EdLernity internship fake or real
              </span>{" "}
              is a concern we address openly. Our platform has partnered with
              reputable organizations, industry experts, and educational leaders
              to ensure the authenticity and quality of every program we offer.
              Each internship is designed to give you{" "}
              <strong>genuine experience</strong>, from project-based tasks to
              constructive performance feedback.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At <strong className="text-[#181FC5]">EdLernity</strong>, the
              overarching goal of our programs is to help individuals develop and
              refine their <strong>core competencies</strong>. By utilizing
              cutting-edge technology and innovative teaching methods, EdLernity
              aims to make learning a more effective and enjoyable experience.
              The positive testimonials from both past interns and the companies
              that hire them serve as strong evidence of our commitment to{" "}
              <strong>excellence</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#181FC5] mb-4">
              What to Expect as an Intern
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We're glad that you're considering joining our team as an intern.
              At <strong>EdLernity</strong>, we value our interns and recognize
              that they are an integral part of our organization. Our internship
              program is designed to provide you with hands-on experience in
              your chosen field and help you develop the skills and knowledge
              necessary for a successful career.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              As an intern at <strong>EdLernity</strong>, you'll have the
              opportunity to work alongside experienced professionals and
              contribute to real-world projects. You'll receive mentorship and
              guidance from industry experts and be encouraged to take ownership
              of your work, enabling you to make a meaningful impact while
              gaining valuable industry exposure.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer internships across a variety of domains, including
              Marketing, Human Resources, Technology, Business Development,
              Content Creation, and more. Our internships are flexible and can be
              tailored to align with your individual interests, goals, and
              learning objectives. We believe in fostering a supportive,
              collaborative, and inclusive environment where interns can thrive
              and grow both personally and professionally.
            </p>
            <p className="text-gray-600 leading-relaxed">
              So, if you're looking for an internship that provides real-world
              experience, professional mentorship, skill development, and
              opportunities to make a difference, look no further than{" "}
              <strong>EdLernity</strong>. Apply today and take the first step
              toward building a successful and rewarding career!
            </p>
          </div>
        </div>
      </section>

      {/* LinkedIn posts from company feed */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#181FC5] mb-3">
                More about EdLernity from LinkedIn
              </h2>
              <p className="text-gray-600">
                Real posts from our official{" "}
                <a
                  href={LINKEDIN_POSTS_FEED}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#181FC5] font-medium hover:underline"
                >
                  LinkedIn company feed
                </a>
              </p>
            </div>
            <a
              href={LINKEDIN_POSTS_FEED}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] text-white font-semibold rounded-full hover:bg-[#004182] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              View All Posts
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {linkedInPosts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#0A66C2]/30 transition-all flex flex-col"
              >
                <div className="h-2 bg-gradient-to-r from-[#0A66C2] to-[#181FC5]" />
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-[#181FC5]">
                      {post.tag}
                    </span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#181FC5] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {post.name}
                      </p>
                      {(post.reactions || post.comments) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {post.reactions ? `${post.reactions} reactions` : ""}
                          {post.reactions && post.comments ? " · " : ""}
                          {post.comments ? `${post.comments} comments` : ""}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A66C2] group-hover:gap-2 transition-all">
                      Read
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={LINKEDIN_POSTS_FEED}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#181FC5] font-semibold hover:underline"
            >
              See more posts on LinkedIn
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-[#ECF7FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#181FC5] mb-3">
              EdLernity Reviews
            </h2>
            <p className="text-gray-600 text-lg">
              What people say about EdLernity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnerReviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                <StarRating rating={review.rating} />
                <p className="text-gray-700 mt-4 mb-6 flex-grow leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={`/Image/user-review-img/${review.image}`}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/Image/Logo1.svg";
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#181FC5] text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {reviewFaqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                {Array.isArray(faq.answer) ? (
                  faq.answer.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-600 leading-relaxed mb-3 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube / Social CTA */}
      <section className="py-16 lg:py-20 bg-[#181FC5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Youtube className="w-12 h-12 mx-auto mb-6 text-white/90" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            See EdLernity in Action
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Follow EdLernity on LinkedIn and social media for learner stories,
            internship updates, course launches, and career tips from our
            community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={LINKEDIN_POSTS_FEED}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#181FC5] font-semibold rounded-full hover:bg-blue-50 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              View LinkedIn Posts
            </a>
            <a
              href={LINKEDIN_COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Company Page
            </a>
            <Link
              to="/courses/overview"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#181FC5] mb-4">
            Take Charge of Your Future
          </h2>
          <p className="text-gray-600 mb-8">
            Step into a world where innovation, technology, and hands-on
            experience converge to shape the leaders of tomorrow.
          </p>
          <Link
            to="/careers"
            className="inline-flex px-8 py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
          >
            Apply for Internship
          </Link>
        </div>
      </section>
    </BaseLayout>
  );
}

export default ReviewPage;
