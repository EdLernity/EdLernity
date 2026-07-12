/** Default careers internships — seeded into DB when empty */
const DEFAULT_CAREERS_PROGRAMS = [
  {
    slug: "business-development",
    title: "Business Development Internship",
    category: "Business Development",
    trackLabel: "Business Track",
    coverImage: "/Image/business_dev_card.png",
    location: "Remote",
    duration: "2 Months",
    applyUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    highlights: [
      "Strategic partnerships & outreach",
      "Market research & analysis",
      "Client relationship building",
    ],
    description:
      "Drive strategic partnerships, lead corporate outreach campaigns, compile market analysis, and architect client relationship strategies.",
    sortOrder: 1,
  },
  {
    slug: "sales-marketing",
    title: "Sales and Marketing Internship",
    category: "Sales & Marketing",
    trackLabel: "Marketing Track",
    coverImage: "/Image/sales_marketing_card.png",
    location: "Remote",
    duration: "2 Months",
    applyUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    highlights: [
      "Social media & campaign planning",
      "Marketing analytics & content",
      "Lead conversion support",
    ],
    description:
      "Plan social outreach, curate campaign visuals, analyze marketing analytics dashboards, and assist in business growth lead conversion.",
    sortOrder: 2,
  },
  {
    slug: "lead-generation",
    title: "Lead Generation Internship",
    category: "Lead Generation",
    trackLabel: "Growth Track",
    coverImage: "/Image/lead_generation.png",
    location: "Remote",
    duration: "2 Months",
    applyUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    highlights: [
      "Prospect research & outreach lists",
      "Email & LinkedIn lead campaigns",
      "CRM tracking & pipeline hygiene",
    ],
    description:
      "Identify high-intent prospects, run structured outreach campaigns, qualify inbound interest, and maintain CRM pipelines that fuel sales and growth.",
    offerLetterRoleDescription:
      "The intern will assist in identifying and generating potential leads, team leading, maintaining lead databases, conducting market research, qualifying prospects, coordinating with different departments, attending meetings, and performing other lead generation-related tasks assigned by the reporting manager.",
    sortOrder: 3,
  },
  {
    slug: "human-resources",
    title: "Human Resources Internship",
    category: "Human Resources",
    trackLabel: "HR Track",
    coverImage: "/Image/hr_internship_card.png",
    location: "Remote",
    duration: "2 Months",
    applyUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    highlights: [
      "Recruitment & candidate screening",
      "Onboarding & employee relations",
      "HR operations & coordination",
    ],
    description:
      "Coordinate talent recruitment drives, screen candidate applications, structure onboarding frameworks, and drive employee relations.",
    sortOrder: 4,
  },
  {
    slug: "technical",
    title: "Technical Internship",
    category: "Software Development",
    trackLabel: "Tech Track",
    coverImage: "/Image/technical_internship.png",
    location: "Remote",
    duration: "3 Months",
    applyUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    preferred: true,
    preferredNote: "People with technical knowledge will be preferred more for hiring.",
    highlights: [
      "Web & app development projects",
      "Database & API fundamentals",
      "Code reviews & testing",
    ],
    description:
      "Develop full-scale web and app components, design responsive interfaces, model database architectures, and perform code testing audits.",
    sortOrder: 5,
  },
];

module.exports = { DEFAULT_CAREERS_PROGRAMS };
