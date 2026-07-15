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
    "Project Kickoff",
    "Project Build",
    "Project Deploy",
    "Project Showcase",
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
    "Project Kickoff",
    "Project Build",
    "Project Harden & Deploy",
    "Project Showcase",
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
    "Project Kickoff",
    "Project Build",
    "Project Test & Harden",
    "Project Showcase",
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
    "Project Kickoff",
    "Project Build",
    "Project Validate",
    "Project Showcase",
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
    "Project Kickoff",
    "Project Build",
    "Project Scale & Harden",
    "Project Showcase",
  ],
};

const {
  createDefaultLiveClasses,
} = require("./internshipLiveClasses");

function buildDefaultModules(slug) {
  const topics = DEFAULT_CURRICULUM[slug] || [];
  return topics.map((topic, index) => {
    const week = `Week ${index + 1}`;
    const liveClasses = createDefaultLiveClasses(week);
    return {
      weekIndex: index,
      week,
      topic,
      isCapstone: index >= 8,
      published: true,
      liveClasses,
      liveClass: {
        title: liveClasses[0].title,
        meetingLink: "",
        scheduleDay: liveClasses[0].scheduleDay,
        scheduleTime: liveClasses[0].scheduleTime,
      },
      recording: {
        title: `Week ${index + 1} Recording`,
        url: "",
        duration: "1h 45m",
      },
      notes: [],
      assignment: {
        title: index >= 8 ? `Project Milestone - Week ${index + 1}` : "",
        dueLabel: "Submit before next live class",
        instructions: "",
        type: index >= 8 ? "project" : "assignment",
        githubRequired: index >= 8,
      },
      resources: [],
    };
  });
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
  requirement: "Complete all 12 weeks, projects, and hands-on assessments.",
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
      "Total 12 weeks: Weeks 1-8 focus on core lessons. Weeks 9-12 are dedicated entirely to live project execution.",
    liveSchedule: [
      { day: "Monday", time: "7:00 PM - 8:30 PM IST" },
      { day: "Wednesday", time: "7:00 PM - 8:30 PM IST" },
      { day: "Friday", time: "7:00 PM - 8:30 PM IST" },
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
