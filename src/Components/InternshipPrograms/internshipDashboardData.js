import { SYLLABUS_NOTE } from "./internshipTracksData";

const LIVE_CLASS_SCHEDULE = [
  { day: "Tuesday", time: "7:00 PM - 9:00 PM IST" },
  { day: "Friday", time: "7:00 PM - 9:00 PM IST" },
];

const DEFAULT_REZNIO_LOGIN_URL = "https://reznio.com";
const DEFAULT_REZNIO_LOGIN_INSTRUCTIONS =
  "Log in with the same email you used to enroll on EdLernity. If you are new to Reznio, create an account first, then sign in to access your internship benefits.";

const BONUS_ITEMS = [
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

export function mergeBonuses(saved = []) {
  return BONUS_ITEMS.map((defaultBonus) => {
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

export function buildInternshipDashboard(track, enrollment = {}) {
  if (!track) return null;

  const enrolledAt = enrollment.enrolledAt || Date.now();
  const modules = track.curriculum.map((item, index) => {
    const isCapstone = index >= 8;

    return {
      id: `week-${index + 1}`,
      week: item.week,
      topic: item.topic,
      isCapstone,
      liveClass: {
        title: `${item.week} Live Session`,
        schedule: LIVE_CLASS_SCHEDULE[index % 2],
        meetingLink: null,
      },
      recording: {
        available: false,
        title: `${item.week} Recording`,
        duration: "1h 45m",
        url: null,
      },
      notes: [
        { title: `${item.week} Session Notes (PDF)`, type: "pdf", url: null, available: false },
        { title: `${item.week} Slide Deck`, type: "slides", url: null, available: false },
      ],
      assignment: {
        title: isCapstone
          ? `Capstone Milestone - ${item.week}`
          : `${item.week} Practice Assignment`,
        dueLabel: "Submit before next live class",
        instructions: "",
        type: isCapstone ? "project" : "assignment",
      },
      resources: [],
    };
  });

  return {
    program: {
      slug: track.slug,
      title: track.title,
      category: track.category,
      coverImage: track.coverImage,
      duration: "12 Weeks",
      batchLabel: "Current Batch",
      syllabusNote: SYLLABUS_NOTE,
      tools: track.tools || [],
      highlights: track.highlights || [],
    },
    enrollment: {
      enrolledAt,
      progressPercent: 0,
      completedWeeks: 0,
      totalWeeks: modules.length,
      currentWeek: modules[0] || null,
    },
    modules,
    liveSchedule: LIVE_CLASS_SCHEDULE,
    bonuses: mergeBonuses(BONUS_ITEMS),
    certificate: {
      title: "ISO 9001:2015 Internship Certificate",
      requirement: "Complete all 12 weeks, capstone project, and hands-on assessments.",
      progressLabel: `${modules.length} week program`,
    },
    announcements: [
      {
        id: 1,
        title: "Welcome to your internship dashboard",
        body: "Access live classes, recordings, notes, and assignments from this hub.",
        date: "Program start",
        type: "info",
      },
    ],
  };
}
