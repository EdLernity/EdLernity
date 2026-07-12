const { getInternshipBySlug } = require("./internshipCatalog");

const DEFAULT_CURRICULUM = {
  "ai-machine-learning": [
    "AI & ML Foundations",
    "Python for ML",
    "Math for ML",
    "Supervised Learning",
    "Classical ML Models",
    "Unsupervised Learning",
    "Neural Networks & Deep Learning",
    "NLP, Generative AI & MLOps Basics",
    "Capstone Kickoff",
    "Capstone Build",
    "Capstone Deploy",
    "Capstone Showcase",
  ],
  "full-stack-ai": [
    "Modern Web Foundations",
    "React Essentials",
    "Next.js & TypeScript",
    "Frontend Systems",
    "Backend APIs",
    "Databases & Auth",
    "AI Product Features",
    "Full-Stack Delivery",
    "Capstone Kickoff",
    "Capstone Build",
    "Capstone Harden & Deploy",
    "Capstone Showcase",
  ],
  "salesforce-cloud-ai": [
    "Salesforce CRM Foundations",
    "Admin Essentials",
    "Data Model & Reporting",
    "Lightning Experience",
    "Apex Fundamentals",
    "Apex Advanced",
    "Einstein AI & Automation",
    "Integration Basics",
    "Capstone Kickoff",
    "Capstone Build",
    "Capstone Test & Harden",
    "Capstone Showcase",
  ],
  "python-data-science-ml": [
    "Python Fundamentals",
    "NumPy & Pandas",
    "Data Wrangling",
    "Visualization & EDA",
    "Feature Engineering",
    "Stats & SQL",
    "Scikit-Learn Core",
    "Classical ML & Tuning",
    "Capstone Kickoff",
    "Capstone Build",
    "Capstone Validate",
    "Capstone Showcase",
  ],
  "cloud-computing-devops": [
    "Cloud Foundations",
    "Compute & Networking",
    "Storage & Databases",
    "Linux & Automation",
    "Containers",
    "Kubernetes Intro",
    "CI/CD Pipelines",
    "IaC & Observability",
    "Capstone Kickoff",
    "Capstone Build",
    "Capstone Scale & Harden",
    "Capstone Showcase",
  ],
};

function buildDefaultModules(slug) {
  const topics = DEFAULT_CURRICULUM[slug] || [];
  return topics.map((topic, index) => ({
    weekIndex: index,
    week: `Week ${index + 1}`,
    topic,
    isCapstone: index >= 8,
    published: true,
    liveClass: {
      title: `Week ${index + 1} Live Session`,
      meetingLink: "",
      scheduleDay: index % 2 === 0 ? "Tuesday" : "Friday",
      scheduleTime: "7:00 PM - 9:00 PM IST",
    },
    recording: {
      title: `Week ${index + 1} Recording`,
      url: "",
      duration: "1h 45m",
    },
    notes: [
      { title: `Week ${index + 1} Session Notes (PDF)`, url: "", type: "pdf" },
      { title: `Week ${index + 1} Slide Deck`, url: "", type: "slides" },
    ],
    assignment: {
      title: index >= 8 ? `Capstone Milestone - Week ${index + 1}` : `Week ${index + 1} Practice Assignment`,
      dueLabel: "Submit before next live class",
      instructions: "",
      type: index >= 8 ? "project" : "assignment",
    },
    resources: [],
  }));
}

const DEFAULT_REZNIO_LOGIN_URL = "https://reznio.com";
const DEFAULT_REZNIO_LOGIN_INSTRUCTIONS =
  "Log in with the same email you used to enroll on EdLernity. If you are new to Reznio, create an account first, then sign in to access your internship benefits.";

const STATIC_BONUSES = [
  {
    id: "genai-workshop",
    title: "GenAI & Prompt Engineering Workshop",
    description: "Live workshop on LLM APIs, prompt patterns, and building AI features.",
    meetingLink: "",
  },
  {
    id: "reznio",
    title: "Reznio Job-Search Platform",
    description: "Premium job-search tools, resume insights, and interview prep access.",
    url: DEFAULT_REZNIO_LOGIN_URL,
    active: false,
    loginInstructions: DEFAULT_REZNIO_LOGIN_INSTRUCTIONS,
  },
];

const STATIC_CERTIFICATE = {
  title: "ISO 9001:2015 Internship Certificate",
  requirement: "Complete all 12 weeks, capstone project, and hands-on assessments.",
};

function resolveBonuses(saved = []) {
  return STATIC_BONUSES.map((defaultBonus) => {
    const found = (saved || []).find((b) => b.id === defaultBonus.id);
    const isReznio = defaultBonus.id === "reznio";
    return {
      ...defaultBonus,
      ...(found || {}),
      id: defaultBonus.id,
      title: found?.title || defaultBonus.title,
      description: found?.description || defaultBonus.description,
      meetingLink: found?.meetingLink || defaultBonus.meetingLink || "",
      url: found?.url || defaultBonus.url || (isReznio ? DEFAULT_REZNIO_LOGIN_URL : ""),
      active: isReznio ? Boolean(found?.active) : true,
      loginInstructions:
        found?.loginInstructions ||
        defaultBonus.loginInstructions ||
        (isReznio ? DEFAULT_REZNIO_LOGIN_INSTRUCTIONS : ""),
    };
  });
}

function buildDefaultProgramConfig(slug) {
  const internship = getInternshipBySlug(slug);
  if (!internship) return null;

  return {
    internshipSlug: slug,
    title: internship.title,
    category: internship.category,
    coverImage: internship.coverImage,
    syllabusNote:
      "Total 12 weeks: Weeks 1-8 focus on core lessons. Weeks 9-12 are dedicated entirely to Live Capstone Project execution.",
    liveSchedule: [
      { day: "Tuesday", time: "7:00 PM - 9:00 PM IST" },
      { day: "Friday", time: "7:00 PM - 9:00 PM IST" },
    ],
    bonuses: STATIC_BONUSES,
    announcements: [
      {
        id: "welcome",
        title: "Welcome to your internship dashboard",
        body: "Access live classes, recordings, notes, and assignments from this hub.",
        date: "Program start",
        type: "info",
      },
    ],
    modules: buildDefaultModules(slug),
  };
}

module.exports = {
  buildDefaultProgramConfig,
  buildDefaultModules,
  STATIC_BONUSES,
  STATIC_CERTIFICATE,
  resolveBonuses,
  DEFAULT_REZNIO_LOGIN_URL,
  DEFAULT_REZNIO_LOGIN_INSTRUCTIONS,
};
