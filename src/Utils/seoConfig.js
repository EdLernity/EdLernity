export const SITE_URL = "https://edlernity.com";
export const SITE_NAME = "EdLernity";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/Image/Logo1.svg`;
export const DEFAULT_DESCRIPTION =
  "EdLernity is an online learning platform offering upskilling, placement prep, and certification courses in Python, Web Development, Cyber Security, UI/UX, and more.";

export const PAGE_SEO = {
  home: {
    title: "EdLernity – Online Courses for Upskilling & Career Growth",
    description:
      "Build skills that advance your career. Explore 20+ upskilling, placement prep, and certification courses with video-based learning on EdLernity.",
    path: "/",
    keywords:
      "online courses, upskilling, placement preparation, certification courses, EdLernity, learn Python, web development",
  },
  about: {
    title: "About EdLernity – Our Mission & Story",
    description:
      "Learn about EdLernity Tech (OPC) Private Limited — an innovative edtech platform helping learners build in-demand skills through expert-led online courses.",
    path: "/about",
    keywords: "about EdLernity, edtech company, online education India",
  },
  courses: {
    title: "Explore Online Courses – Python, Web Dev, Cyber Security & More",
    description:
      "Browse EdLernity's catalog of online courses in programming, design, project management, Excel, ChatGPT, and interview preparation. Start learning today.",
    path: "/courses/overview/",
    keywords:
      "online courses, Python course, web development course, cyber security course, UI UX course",
  },
  contact: {
    title: "Contact EdLernity – Get Help & Support",
    description:
      "Need help with courses or enrollment? Contact EdLernity at info@edlernity.com or +91 8073306479. We're here to support your learning journey.",
    path: "/contact",
    keywords: "contact EdLernity, customer support, course help",
  },
  blog: {
    title: "EdLernity Blog – Learning Tips & Tech Insights",
    description:
      "EdLernity blog — coming soon. Stay tuned for learning tips, career advice, and tech insights.",
    path: "/blog",
    keywords: "EdLernity blog, learning tips, tech blog",
    noindex: true,
  },
  careers: {
    title: "Careers & Internships at EdLernity",
    description:
      "Explore EdLernity careers and remote internships in Business Development, Sales & Marketing, Lead Generation, Human Resources, and Technical tracks.",
    path: "/careers",
    keywords:
      "EdLernity careers, business development internship, sales marketing internship, lead generation internship, HR internship, technical internship",
  },
  reviews: {
    title: "EdLernity Reviews – Learner & Internship Testimonials",
    description:
      "Read real EdLernity reviews from learners and interns. Discover internship experiences, course testimonials, certificates, and success stories from our community.",
    path: "/reviews",
    keywords:
      "EdLernity reviews, EdLernity internship review, learner testimonials, online course reviews",
  },
  member: {
    title: "EdLernity Lifetime Membership – Unlimited Course Access",
    description:
      "Get lifetime access to EdLernity courses, verified certificates, academics support, and 150+ hours of expert-led learning with one subscription.",
    path: "/member",
    keywords:
      "EdLernity membership, lifetime subscription, online courses, certification",
  },
  privacy: {
    title: "Privacy Policy – EdLernity",
    description:
      "Read EdLernity's privacy policy to understand how we collect, use, and protect your personal information.",
    path: "/privacy-policy",
    keywords: "EdLernity privacy policy",
  },
  terms: {
    title: "Terms and Conditions – EdLernity",
    description:
      "Review the terms and conditions for using EdLernity's website and online learning platform.",
    path: "/terms-and-conditions",
    keywords: "EdLernity terms and conditions",
  },
  refund: {
    title: "Cancellation and Refund Policy – EdLernity",
    description:
      "Understand EdLernity's cancellation and refund policy for courses, services, and workshops.",
    path: "/cancellation-and-refund-policy",
    keywords: "EdLernity refund policy, cancellation policy",
  },
  verifyCertificate: {
    title: "Verify EdLernity Certificate – Authenticity Check",
    description:
      "Verify any EdLernity internship, workshop, or course certificate worldwide using the certificate ID.",
    path: "/verify-certificate",
    keywords:
      "verify EdLernity certificate, certificate authenticity, certificate validation, EdLernity credential check",
  },
  workshops: {
    title: "EdLernity Workshops – Build AI Agents with MCP",
    description:
      "Live EdLernity workshops including Build Your Own AI Agent with MCP — hands-on sessions for modern AI skills.",
    path: "/workshops",
    keywords:
      "EdLernity workshops, AI agent MCP workshop, Model Context Protocol, build AI agent, live AI workshop",
  },
};

export const buildCanonicalUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EdLernity Tech (OPC) Private Limited",
  alternateName: "EdLernity",
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  email: "info@edlernity.com",
  telephone: "+91-8073306479",
  sameAs: [
    "https://www.linkedin.com/company/edlernity/",
    "https://www.instagram.com/edlernity/",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: "EdLernity Tech (OPC) Private Limited",
  },
};

export const buildCourseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.courseTitle,
  description: course.courseOverviewDesc || course.courseDesc,
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  image: course.courseBanner,
  offers: {
    "@type": "Offer",
    price: course.offeredPrice,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/courses/overview/${course._id}`,
  },
});
